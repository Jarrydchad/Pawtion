import uuid
from datetime import datetime, timedelta, timezone
from models import db
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy import func
import math


# ─── USER ────────────────────────────────────────────────
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(30), nullable=True)
    street_address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    pets = db.relationship("Pet", backref="owner", lazy="dynamic", cascade="all, delete-orphan")
    subscriptions = db.relationship("Subscription", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    notifications = db.relationship("Notification", backref="user", lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": {
                "street": self.street_address,
                "city": self.city,
                "postal_code": self.postal_code,
            },
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ─── PET ─────────────────────────────────────────────────
class Pet(db.Model):
    __tablename__ = "pets"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    breed = db.Column(db.String(100), nullable=True)
    size = db.Column(db.String(20), nullable=False)  # toy, small, medium, large, giant
    stage = db.Column(db.String(20), nullable=False)  # puppy, adult, senior
    activity = db.Column(db.String(20), nullable=False)  # low, moderate, active, athletic
    weight = db.Column(db.Float, nullable=True)  # in kg
    health_tags = db.Column(ARRAY(db.String), default=list)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    subscriptions = db.relationship("Subscription", backref="pet", lazy="dynamic", cascade="all, delete-orphan")

    # Recommended daily grams by size
    DAILY_GRAMS = {
        "toy": 80, "small": 150, "medium": 280,
        "large": 400, "giant": 560
    }

    @property
    def recommended_daily_grams(self):
        base = self.DAILY_GRAMS.get(self.size, 250)
        # Adjust for activity level
        multipliers = {"low": 0.85, "moderate": 1.0, "active": 1.15, "athletic": 1.3}
        mult = multipliers.get(self.activity, 1.0)
        # Adjust for life stage
        if self.stage == "puppy":
            mult *= 1.2
        elif self.stage == "senior":
            mult *= 0.9
        return round(base * mult)

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "name": self.name,
            "breed": self.breed,
            "size": self.size,
            "stage": self.stage,
            "activity": self.activity,
            "weight": self.weight,
            "health_tags": self.health_tags or [],
            "recommended_daily_grams": self.recommended_daily_grams,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ─── BRAND ───────────────────────────────────────────────
class Brand(db.Model):
    __tablename__ = "brands"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    tagline = db.Column(db.String(255), nullable=True)
    color = db.Column(db.String(10), nullable=True)
    logo_emoji = db.Column(db.String(10), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    products = db.relationship("Product", backref="brand", lazy="dynamic")

    def to_dict(self):
        return {
            "id": str(self.id),
            "slug": self.slug,
            "name": self.name,
            "tagline": self.tagline,
            "color": self.color,
            "logo_emoji": self.logo_emoji,
        }


# ─── PRODUCT ────────────────────────────────────────────
class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    brand_id = db.Column(UUID(as_uuid=True), db.ForeignKey("brands.id"), nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Integer, nullable=False)  # in ZAR (cents-free, whole rands)
    bag_size_kg = db.Column(db.Float, nullable=False)
    rating = db.Column(db.Float, default=0.0)
    review_count = db.Column(db.Integer, default=0)
    tags = db.Column(ARRAY(db.String), default=list)  # health/dietary tags
    compatible_sizes = db.Column(ARRAY(db.String), default=list)  # toy, small, etc
    compatible_stages = db.Column(ARRAY(db.String), default=list)  # puppy, adult, senior
    img_emoji = db.Column(db.String(10), nullable=True)
    is_bestseller = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    subscriptions = db.relationship("Subscription", backref="product", lazy="dynamic")

    def bag_days(self, daily_grams):
        """How many days one bag lasts at given daily consumption."""
        if daily_grams <= 0:
            return 999
        return math.floor((self.bag_size_kg * 1000) / daily_grams)

    def monthly_cost(self, daily_grams):
        """Monthly subscription cost based on consumption rate."""
        days = self.bag_days(daily_grams)
        if days <= 0:
            return self.price
        bags_per_month = math.ceil(30 / days)
        return self.price * bags_per_month

    def to_dict(self, include_brand=False):
        d = {
            "id": str(self.id),
            "brand_id": str(self.brand_id),
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "bag_size_kg": self.bag_size_kg,
            "rating": self.rating,
            "review_count": self.review_count,
            "tags": self.tags or [],
            "compatible_sizes": self.compatible_sizes or [],
            "compatible_stages": self.compatible_stages or [],
            "img_emoji": self.img_emoji,
            "is_bestseller": self.is_bestseller,
        }
        if include_brand and self.brand:
            d["brand"] = self.brand.to_dict()
        return d


# ─── SUBSCRIPTION ────────────────────────────────────────
class Subscription(db.Model):
    __tablename__ = "subscriptions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    pet_id = db.Column(UUID(as_uuid=True), db.ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = db.Column(UUID(as_uuid=True), db.ForeignKey("products.id"), nullable=False, index=True)
    daily_grams = db.Column(db.Integer, nullable=False)
    bag_days = db.Column(db.Integer, nullable=False)  # computed on creation
    monthly_price = db.Column(db.Integer, nullable=False)  # computed on creation
    status = db.Column(db.String(20), default="active")  # active, paused, cancelled
    start_date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    next_delivery_date = db.Column(db.DateTime(timezone=True), nullable=True)
    last_delivery_date = db.Column(db.DateTime(timezone=True), nullable=True)
    cancelled_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    deliveries = db.relationship("Delivery", backref="subscription", lazy="dynamic", cascade="all, delete-orphan")

    @property
    def days_into_bag(self):
        ref = self.last_delivery_date or self.start_date
        if ref is None:
            return 0
        now = datetime.now(timezone.utc)
        if ref.tzinfo is None:
            ref = ref.replace(tzinfo=timezone.utc)
        return max(0, (now - ref).days)

    @property
    def bag_usage_pct(self):
        if self.bag_days <= 0:
            return 100
        return min(100, round((self.days_into_bag / self.bag_days) * 100))

    @property
    def days_remaining(self):
        return max(0, self.bag_days - self.days_into_bag)

    def to_dict(self, include_product=False, include_pet=False):
        d = {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "pet_id": str(self.pet_id),
            "product_id": str(self.product_id),
            "daily_grams": self.daily_grams,
            "bag_days": self.bag_days,
            "monthly_price": self.monthly_price,
            "status": self.status,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "next_delivery_date": self.next_delivery_date.isoformat() if self.next_delivery_date else None,
            "last_delivery_date": self.last_delivery_date.isoformat() if self.last_delivery_date else None,
            "days_into_bag": self.days_into_bag,
            "bag_usage_pct": self.bag_usage_pct,
            "days_remaining": self.days_remaining,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_product and self.product:
            d["product"] = self.product.to_dict(include_brand=True)
        if include_pet and self.pet:
            d["pet"] = self.pet.to_dict()
        return d


# ─── DELIVERY ───────────────────────────────────────────
class Delivery(db.Model):
    __tablename__ = "deliveries"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subscription_id = db.Column(UUID(as_uuid=True), db.ForeignKey("subscriptions.id", ondelete="CASCADE"), nullable=False, index=True)
    status = db.Column(db.String(20), default="confirmed")  # confirmed, packing, shipped, delivered
    tracking_number = db.Column(db.String(100), nullable=True)
    estimated_delivery = db.Column(db.DateTime(timezone=True), nullable=True)
    shipped_at = db.Column(db.DateTime(timezone=True), nullable=True)
    delivered_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": str(self.id),
            "subscription_id": str(self.subscription_id),
            "status": self.status,
            "tracking_number": self.tracking_number,
            "estimated_delivery": self.estimated_delivery.isoformat() if self.estimated_delivery else None,
            "shipped_at": self.shipped_at.isoformat() if self.shipped_at else None,
            "delivered_at": self.delivered_at.isoformat() if self.delivered_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ─── PAYMENT ─────────────────────────────────────────────
class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subscription_id = db.Column(UUID(as_uuid=True), db.ForeignKey("subscriptions.id", ondelete="CASCADE"), nullable=False, index=True)
    yoco_checkout_id = db.Column(db.String(100), unique=True, nullable=True)
    checkout_url = db.Column(db.String(500), nullable=True)
    amount = db.Column(db.Integer, nullable=False)  # in ZAR cents
    status = db.Column(db.String(20), default="pending")  # pending, paid, failed
    payment_type = db.Column(db.String(20), nullable=False)  # initial, renewal
    paid_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    subscription = db.relationship("Subscription", backref=db.backref("payments", lazy="dynamic"))

    def to_dict(self):
        return {
            "id": str(self.id),
            "subscription_id": str(self.subscription_id),
            "yoco_checkout_id": self.yoco_checkout_id,
            "checkout_url": self.checkout_url,
            "amount": self.amount,
            "status": self.status,
            "payment_type": self.payment_type,
            "paid_at": self.paid_at.isoformat() if self.paid_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ─── NOTIFICATION ────────────────────────────────────────
class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=True)
    notification_type = db.Column(db.String(30), nullable=False)  # order_confirmed, shipping, low_stock, delivered
    is_read = db.Column(db.Boolean, default=False)
    related_subscription_id = db.Column(UUID(as_uuid=True), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "title": self.title,
            "message": self.message,
            "type": self.notification_type,
            "is_read": self.is_read,
            "related_subscription_id": str(self.related_subscription_id) if self.related_subscription_id else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
