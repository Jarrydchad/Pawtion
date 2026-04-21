from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta, timezone
from models import db
from models.models import Subscription, Product, Pet, Delivery, Notification
from config import Config
import math

subscriptions_bp = Blueprint("subscriptions", __name__, url_prefix="/api/subscriptions")


@subscriptions_bp.route("", methods=["GET"])
@jwt_required()
def list_subscriptions():
    user_id = get_jwt_identity()
    status_filter = request.args.get("status", "active")

    query = Subscription.query.filter_by(user_id=user_id)
    if status_filter != "all":
        query = query.filter_by(status=status_filter)

    subs = query.order_by(Subscription.created_at.desc()).all()
    return jsonify({
        "subscriptions": [s.to_dict(include_product=True, include_pet=True) for s in subs]
    }), 200


@subscriptions_bp.route("", methods=["POST"])
@jwt_required()
def create_subscription():
    user_id = get_jwt_identity()
    data = request.get_json()

    required = ["pet_id", "product_id", "daily_grams"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Validate pet belongs to user
    pet = Pet.query.filter_by(id=data["pet_id"], user_id=user_id).first()
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    product = Product.query.get(data["product_id"])
    if not product or not product.is_active:
        return jsonify({"error": "Product not found"}), 404

    daily_grams = int(data["daily_grams"])
    if daily_grams < 10 or daily_grams > 2000:
        return jsonify({"error": "daily_grams must be between 10 and 2000"}), 400

    # Check for existing active sub for this pet+product
    existing = Subscription.query.filter_by(
        pet_id=pet.id, product_id=product.id, status="active"
    ).first()
    if existing:
        return jsonify({"error": "Active subscription already exists for this pet and product"}), 409

    bag_days = product.bag_days(daily_grams)
    monthly_price = product.monthly_cost(daily_grams)

    sub = Subscription(
        user_id=user_id,
        pet_id=pet.id,
        product_id=product.id,
        daily_grams=daily_grams,
        bag_days=bag_days,
        monthly_price=monthly_price,
        status="active",
        next_delivery_date=None,  # set after first payment is confirmed
    )
    db.session.add(sub)
    db.session.commit()

    return jsonify({
        "message": "Subscription created. Complete payment to schedule your first delivery.",
        "subscription": sub.to_dict(include_product=True, include_pet=True),
        "requires_payment": True,
    }), 201


@subscriptions_bp.route("/<sub_id>", methods=["GET"])
@jwt_required()
def get_subscription(sub_id):
    user_id = get_jwt_identity()
    sub = Subscription.query.filter_by(id=sub_id, user_id=user_id).first()
    if not sub:
        return jsonify({"error": "Subscription not found"}), 404

    deliveries = Delivery.query.filter_by(subscription_id=sub.id).order_by(Delivery.created_at.desc()).all()

    result = sub.to_dict(include_product=True, include_pet=True)
    result["deliveries"] = [d.to_dict() for d in deliveries]
    return jsonify({"subscription": result}), 200


@subscriptions_bp.route("/<sub_id>/cancel", methods=["POST"])
@jwt_required()
def cancel_subscription(sub_id):
    user_id = get_jwt_identity()
    sub = Subscription.query.filter_by(id=sub_id, user_id=user_id).first()
    if not sub:
        return jsonify({"error": "Subscription not found"}), 404

    if sub.status == "cancelled":
        return jsonify({"error": "Already cancelled"}), 400

    sub.status = "cancelled"
    sub.cancelled_at = datetime.now(timezone.utc)

    notif = Notification(
        user_id=user_id,
        title="Subscription cancelled",
        message=f"Your {sub.product.name} subscription for {sub.pet.name} has been cancelled.",
        notification_type="subscription_cancelled",
        related_subscription_id=sub.id,
    )
    db.session.add(notif)
    db.session.commit()

    return jsonify({"message": "Subscription cancelled", "subscription": sub.to_dict()}), 200


@subscriptions_bp.route("/<sub_id>/pause", methods=["POST"])
@jwt_required()
def pause_subscription(sub_id):
    user_id = get_jwt_identity()
    sub = Subscription.query.filter_by(id=sub_id, user_id=user_id).first()
    if not sub:
        return jsonify({"error": "Subscription not found"}), 404

    if sub.status != "active":
        return jsonify({"error": "Can only pause active subscriptions"}), 400

    sub.status = "paused"
    db.session.commit()
    return jsonify({"message": "Subscription paused", "subscription": sub.to_dict()}), 200


@subscriptions_bp.route("/<sub_id>/resume", methods=["POST"])
@jwt_required()
def resume_subscription(sub_id):
    user_id = get_jwt_identity()
    sub = Subscription.query.filter_by(id=sub_id, user_id=user_id).first()
    if not sub:
        return jsonify({"error": "Subscription not found"}), 404

    if sub.status != "paused":
        return jsonify({"error": "Can only resume paused subscriptions"}), 400

    sub.status = "active"
    sub.next_delivery_date = datetime.now(timezone.utc) + timedelta(
        days=max(1, sub.bag_days - Config.LOW_STOCK_DAYS)
    )
    db.session.commit()
    return jsonify({"message": "Subscription resumed", "subscription": sub.to_dict()}), 200


@subscriptions_bp.route("/<sub_id>/update-feeding", methods=["PUT"])
@jwt_required()
def update_feeding(sub_id):
    """Update the daily feeding amount, recalculate bag_days and monthly_price."""
    user_id = get_jwt_identity()
    sub = Subscription.query.filter_by(id=sub_id, user_id=user_id).first()
    if not sub:
        return jsonify({"error": "Subscription not found"}), 404

    data = request.get_json()
    daily_grams = data.get("daily_grams")
    if not daily_grams or daily_grams < 10 or daily_grams > 2000:
        return jsonify({"error": "daily_grams must be between 10 and 2000"}), 400

    sub.daily_grams = daily_grams
    sub.bag_days = sub.product.bag_days(daily_grams)
    sub.monthly_price = sub.product.monthly_cost(daily_grams)
    sub.next_delivery_date = datetime.now(timezone.utc) + timedelta(
        days=max(1, sub.bag_days - Config.LOW_STOCK_DAYS)
    )

    db.session.commit()
    return jsonify({
        "message": "Feeding plan updated",
        "subscription": sub.to_dict(include_product=True),
    }), 200


# ─── DELIVERIES ──────────────────────────────────────────
@subscriptions_bp.route("/<sub_id>/deliveries", methods=["GET"])
@jwt_required()
def list_deliveries(sub_id):
    user_id = get_jwt_identity()
    sub = Subscription.query.filter_by(id=sub_id, user_id=user_id).first()
    if not sub:
        return jsonify({"error": "Subscription not found"}), 404

    deliveries = Delivery.query.filter_by(subscription_id=sub.id)\
        .order_by(Delivery.created_at.desc()).all()
    return jsonify({"deliveries": [d.to_dict() for d in deliveries]}), 200


# ─── NOTIFICATIONS ───────────────────────────────────────
@subscriptions_bp.route("/notifications", methods=["GET"])
@jwt_required()
def list_notifications():
    user_id = get_jwt_identity()
    notifs = Notification.query.filter_by(user_id=user_id)\
        .order_by(Notification.created_at.desc()).limit(20).all()
    return jsonify({"notifications": [n.to_dict() for n in notifs]}), 200


@subscriptions_bp.route("/notifications/read-all", methods=["POST"])
@jwt_required()
def mark_all_read():
    user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=user_id, is_read=False)\
        .update({"is_read": True})
    db.session.commit()
    return jsonify({"message": "All notifications marked as read"}), 200
