from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.models import Pet

pets_bp = Blueprint("pets", __name__, url_prefix="/api/pets")


@pets_bp.route("", methods=["GET"])
@jwt_required()
def list_pets():
    user_id = get_jwt_identity()
    pets = Pet.query.filter_by(user_id=user_id).order_by(Pet.created_at).all()
    return jsonify({"pets": [p.to_dict() for p in pets]}), 200


@pets_bp.route("", methods=["POST"])
@jwt_required()
def create_pet():
    user_id = get_jwt_identity()
    data = request.get_json()

    required = ["name", "size", "stage", "activity"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    valid_sizes = ["toy", "small", "medium", "large", "giant"]
    valid_stages = ["puppy", "adult", "senior"]
    valid_activity = ["low", "moderate", "active", "athletic"]

    if data["size"] not in valid_sizes:
        return jsonify({"error": f"size must be one of {valid_sizes}"}), 400
    if data["stage"] not in valid_stages:
        return jsonify({"error": f"stage must be one of {valid_stages}"}), 400
    if data["activity"] not in valid_activity:
        return jsonify({"error": f"activity must be one of {valid_activity}"}), 400

    pet = Pet(
        user_id=user_id,
        name=data["name"].strip(),
        breed=data.get("breed", "").strip() or None,
        size=data["size"],
        stage=data["stage"],
        activity=data["activity"],
        weight=data.get("weight"),
        health_tags=data.get("health_tags", []),
    )
    db.session.add(pet)
    db.session.commit()

    return jsonify({"message": "Pet created", "pet": pet.to_dict()}), 201


@pets_bp.route("/<pet_id>", methods=["GET"])
@jwt_required()
def get_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
    if not pet:
        return jsonify({"error": "Pet not found"}), 404
    return jsonify({"pet": pet.to_dict()}), 200


@pets_bp.route("/<pet_id>", methods=["PUT"])
@jwt_required()
def update_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    data = request.get_json()
    if data.get("name"):
        pet.name = data["name"].strip()
    if data.get("breed") is not None:
        pet.breed = data["breed"].strip() or None
    if data.get("size"):
        pet.size = data["size"]
    if data.get("stage"):
        pet.stage = data["stage"]
    if data.get("activity"):
        pet.activity = data["activity"]
    if data.get("weight") is not None:
        pet.weight = data["weight"]
    if data.get("health_tags") is not None:
        pet.health_tags = data["health_tags"]

    db.session.commit()
    return jsonify({"message": "Pet updated", "pet": pet.to_dict()}), 200


@pets_bp.route("/<pet_id>", methods=["DELETE"])
@jwt_required()
def delete_pet(pet_id):
    user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=user_id).first()
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    db.session.delete(pet)
    db.session.commit()
    return jsonify({"message": f"{pet.name} removed"}), 200
