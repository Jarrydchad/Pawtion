import hmac
import hashlib
import requests as http
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta, timezone
from models import db
from models.models import Subscription, Delivery, Notification, Payment
from config import Config

payments_bp = Blueprint("payments", __name__, url_prefix="/api/payments")

YOCO_API_BASE = "https://payments.yoco.com/api"


def _create_yoco_checkout(amount_cents, subscription_id, payment_id):
    resp = http.post(
        f"{YOCO_API_BASE}/checkouts",
        headers={
            "Authorization": f"Bearer {Config.YOCO_SECRET_KEY}",
            "Content-Type": "application/json",
            "Idempotency-Key": str(payment_id),
        },
        json={
            "amount": amount_cents,
            "currency": "ZAR",
            "successUrl": f"{Config.FRONTEND_URL}/payment/success?payment_id={payment_id}",
            "cancelUrl": f"{Config.FRONTEND_URL}/payment/cancel",
            "failureUrl": f"{Config.FRONTEND_URL}/payment/cancel",
            "metadata": {
                "subscription_id": str(subscription_id),
                "payment_id": str(payment_id),
            },
        },
        timeout=10,
    )
    if not resp.ok:
        raise Exception(f"{resp.status_code} {resp.text}")
    return resp.json()


def _build_pending_payment(sub, payment_type):
    """Create a Payment record and Yoco checkout. Flushes but does not commit."""
    amount_cents = sub.product.price * 100
    payment = Payment(
        subscription_id=sub.id,
        amount=amount_cents,
        status="pending",
        payment_type=payment_type,
    )
    db.session.add(payment)
    db.session.flush()

    checkout = _create_yoco_checkout(amount_cents, sub.id, payment.id)
    payment.yoco_checkout_id = checkout["id"]
    payment.checkout_url = checkout["redirectUrl"]
    return payment


# ─── INITIATE PAYMENT ────────────────────────────────────

@payments_bp.route("/initiate/<sub_id>", methods=["POST"])
@jwt_required()
def initiate_payment(sub_id):
    """Create (or return existing) a Yoco checkout for the given subscription."""
    user_id = get_jwt_identity()
    sub = Subscription.query.filter_by(id=sub_id, user_id=user_id).first()
    if not sub:
        return jsonify({"error": "Subscription not found"}), 404
    if sub.status not in ("active", "paused"):
        return jsonify({"error": "Subscription is not active"}), 400

    # Return existing pending payment rather than creating a duplicate
    existing = Payment.query.filter_by(subscription_id=sub.id, status="pending").first()
    if existing:
        return jsonify({
            "checkout_url": existing.checkout_url,
            "payment_id": str(existing.id),
            "amount": existing.amount,
        }), 200

    has_paid = Payment.query.filter_by(subscription_id=sub.id, status="paid").first()
    payment_type = "renewal" if has_paid else "initial"

    try:
        payment = _build_pending_payment(sub, payment_type)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Could not create Yoco checkout: {str(e)}"}), 502

    db.session.commit()
    return jsonify({
        "checkout_url": payment.checkout_url,
        "payment_id": str(payment.id),
        "amount": payment.amount,
    }), 201


# ─── YOCO WEBHOOK ────────────────────────────────────────

@payments_bp.route("/webhook", methods=["POST"])
def yoco_webhook():
    """Receive Yoco payment events. On payment.succeeded, create a delivery."""
    payload = request.get_data()

    # Verify HMAC signature when secret is configured
    if Config.YOCO_WEBHOOK_SECRET:
        signature = request.headers.get("X-Yoco-Signature-256", "")
        expected = "sha256=" + hmac.new(
            Config.YOCO_WEBHOOK_SECRET.encode(),
            payload,
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(expected, signature):
            return jsonify({"error": "Invalid signature"}), 401

    event = request.get_json(silent=True) or {}
    if event.get("type") != "payment.succeeded":
        return jsonify({"status": "ignored"}), 200

    # Yoco puts our metadata on the checkout object
    checkout_id = (
        event.get("payload", {}).get("metadata", {}).get("checkoutId")
        or event.get("payload", {}).get("id")
        or event.get("payload", {}).get("checkoutId")
    )
    payment = Payment.query.filter_by(yoco_checkout_id=checkout_id).first()
    if not payment or payment.status == "paid":
        return jsonify({"status": "ok"}), 200

    payment.status = "paid"
    payment.paid_at = datetime.now(timezone.utc)

    sub = payment.subscription
    now = datetime.now(timezone.utc)

    delivery = Delivery(
        subscription_id=sub.id,
        status="confirmed",
        estimated_delivery=now + timedelta(days=5),
    )
    db.session.add(delivery)

    # Reset bag consumption window from payment date
    sub.last_delivery_date = now
    # Next payment trigger = when days_remaining will hit LOW_STOCK_DAYS
    sub.next_delivery_date = now + timedelta(days=max(1, sub.bag_days - Config.LOW_STOCK_DAYS))

    notif = Notification(
        user_id=sub.user_id,
        title="Payment received! Your bag is on its way",
        message=(
            f"{sub.product.name} for {sub.pet.name} — "
            f"estimated delivery in 5 days."
        ),
        notification_type="order_confirmed",
        related_subscription_id=sub.id,
    )
    db.session.add(notif)
    db.session.commit()

    return jsonify({"status": "ok"}), 200


# ─── LOW STOCK CHECK ─────────────────────────────────────

@payments_bp.route("/check-low-stock", methods=["POST"])
@jwt_required()
def check_low_stock():
    """
    Scan the authenticated user's active subscriptions.
    For any bag with days_remaining <= LOW_STOCK_DAYS and no pending payment,
    create a Yoco checkout and fire a low_stock notification.
    Returns the list of subscriptions that need payment.
    """
    user_id = get_jwt_identity()
    subs = Subscription.query.filter_by(user_id=user_id, status="active").all()

    needs_payment = []
    errors = []

    for sub in subs:
        if sub.days_remaining > Config.LOW_STOCK_DAYS:
            continue

        # Already has a pending checkout — surface it
        pending = Payment.query.filter_by(subscription_id=sub.id, status="pending").first()
        if pending:
            needs_payment.append({
                **sub.to_dict(include_product=True, include_pet=True),
                "checkout_url": pending.checkout_url,
                "payment_id": str(pending.id),
            })
            continue

        # Already paid this bag cycle — skip
        if sub.last_delivery_date:
            ref = sub.last_delivery_date
            if ref.tzinfo is None:
                ref = ref.replace(tzinfo=timezone.utc)
            recent = Payment.query.filter(
                Payment.subscription_id == sub.id,
                Payment.status == "paid",
                Payment.paid_at >= ref,
            ).first()
            if recent:
                continue

        try:
            payment = _build_pending_payment(sub, "renewal")
        except Exception as e:
            errors.append({"subscription_id": str(sub.id), "error": str(e)})
            db.session.rollback()
            continue

        notif = Notification(
            user_id=user_id,
            title=f"{sub.pet.name}'s food is running low!",
            message=(
                f"Your {sub.product.name} has ~{sub.days_remaining} day(s) left. "
                f"Complete payment to schedule the next delivery."
            ),
            notification_type="low_stock",
            related_subscription_id=sub.id,
        )
        db.session.add(notif)
        db.session.commit()

        needs_payment.append({
            **sub.to_dict(include_product=True, include_pet=True),
            "checkout_url": payment.checkout_url,
            "payment_id": str(payment.id),
        })

    return jsonify({
        "low_stock_subscriptions": needs_payment,
        "errors": errors,
    }), 200


# ─── PAYMENT HISTORY ─────────────────────────────────────

@payments_bp.route("/<sub_id>/history", methods=["GET"])
@jwt_required()
def payment_history(sub_id):
    """Return payment history for a subscription."""
    user_id = get_jwt_identity()
    sub = Subscription.query.filter_by(id=sub_id, user_id=user_id).first()
    if not sub:
        return jsonify({"error": "Subscription not found"}), 404

    payments = Payment.query.filter_by(subscription_id=sub.id)\
        .order_by(Payment.created_at.desc()).all()
    return jsonify({"payments": [p.to_dict() for p in payments]}), 200
