from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from models import db
from models.models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required = ["name", "email", "password"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    if len(data["password"]) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    existing = User.query.filter_by(email=data["email"].lower().strip()).first()
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    password_hash = bcrypt.hashpw(
        data["password"].encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user = User(
        name=data["name"].strip(),
        email=data["email"].lower().strip(),
        password_hash=password_hash,
        phone=data.get("phone", "").strip() or None,
        street_address=data.get("street_address", "").strip() or None,
        city=data.get("city", "").strip() or None,
        postal_code=data.get("postal_code", "").strip() or None,
    )
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Account created successfully",
        "token": token,
        "user": user.to_dict()
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=data["email"].lower().strip()).first()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not bcrypt.checkpw(data["password"].encode("utf-8"), user.password_hash.encode("utf-8")):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if data.get("name"):
        user.name = data["name"].strip()
    if data.get("email"):
        user.email = data["email"].lower().strip()
    if data.get("phone") is not None:
        user.phone = data["phone"].strip() or None
    if data.get("street_address") is not None:
        user.street_address = data["street_address"].strip() or None
    if data.get("city") is not None:
        user.city = data["city"].strip() or None
    if data.get("postal_code") is not None:
        user.postal_code = data["postal_code"].strip() or None

    db.session.commit()
    return jsonify({"message": "Profile updated", "user": user.to_dict()}), 200
