from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.models import Product, Brand, Pet

products_bp = Blueprint("products", __name__, url_prefix="/api/products")


@products_bp.route("/brands", methods=["GET"])
def list_brands():
    brands = Brand.query.filter_by(is_active=True).order_by(Brand.name).all()
    return jsonify({"brands": [b.to_dict() for b in brands]}), 200


@products_bp.route("", methods=["GET"])
def list_products():
    """List products with optional filters: brand, size, stage, tag, search"""
    query = Product.query.filter_by(is_active=True)

    brand_slug = request.args.get("brand")
    if brand_slug:
        brand = Brand.query.filter_by(slug=brand_slug).first()
        if brand:
            query = query.filter_by(brand_id=brand.id)

    size = request.args.get("size")
    if size:
        query = query.filter(Product.compatible_sizes.contains([size]))

    stage = request.args.get("stage")
    if stage:
        query = query.filter(Product.compatible_stages.contains([stage]))

    tag = request.args.get("tag")
    if tag:
        query = query.filter(Product.tags.contains([tag]))

    search = request.args.get("search", "").strip()
    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(
                Product.name.ilike(like),
                Product.description.ilike(like),
            )
        )

    query = query.order_by(Product.is_bestseller.desc(), Product.rating.desc())
    products = query.all()

    return jsonify({
        "products": [p.to_dict(include_brand=True) for p in products],
        "count": len(products),
    }), 200


@products_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product or not product.is_active:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({"product": product.to_dict(include_brand=True)}), 200


@products_bp.route("/recommend/<pet_id>", methods=["GET"])
@jwt_required()
def recommend_for_pet(pet_id):
    """Get smart recommendations for a specific pet based on size, stage, health tags."""
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    # Get compatible products
    products = Product.query.filter(
        Product.is_active == True,
        Product.compatible_sizes.contains([pet.size]),
        Product.compatible_stages.contains([pet.stage]),
    ).all()

    # Score them by health tag overlap + rating
    def score(p):
        tag_match = len(set(p.tags or []) & set(pet.health_tags or []))
        return (tag_match * 10) + p.rating + (1 if p.is_bestseller else 0)

    products.sort(key=score, reverse=True)
    limit = int(request.args.get("limit", 5))

    result = []
    for p in products[:limit]:
        d = p.to_dict(include_brand=True)
        matched_tags = list(set(p.tags or []) & set(pet.health_tags or []))
        d["matched_tags"] = matched_tags
        d["recommendation_score"] = score(p)
        d["bag_days"] = p.bag_days(pet.recommended_daily_grams)
        d["monthly_cost"] = p.monthly_cost(pet.recommended_daily_grams)
        result.append(d)

    return jsonify({
        "pet": pet.to_dict(),
        "recommendations": result,
    }), 200


@products_bp.route("/calculate", methods=["POST"])
def calculate_consumption():
    """Calculate bag duration and monthly cost for a product/consumption combo."""
    data = request.get_json()
    product_id = data.get("product_id")
    daily_grams = data.get("daily_grams")

    if not product_id or not daily_grams:
        return jsonify({"error": "product_id and daily_grams required"}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    import math
    bag_days = product.bag_days(daily_grams)
    bags_per_month = math.ceil(30 / bag_days) if bag_days > 0 else 1
    monthly_cost = product.price * bags_per_month

    return jsonify({
        "product_id": str(product.id),
        "product_name": product.name,
        "bag_size_kg": product.bag_size_kg,
        "daily_grams": daily_grams,
        "bag_days": bag_days,
        "bags_per_month": bags_per_month,
        "price_per_bag": product.price,
        "monthly_cost": monthly_cost,
    }), 200
