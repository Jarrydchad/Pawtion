"""
Pawtion — Dog Food Subscription API
Flask + PostgreSQL Backend
"""
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

from config import Config
from models import db
from models.models import User, Pet, Brand, Product, Subscription, Delivery, Notification, Payment

from routes.auth import auth_bp
from routes.pets import pets_bp
from routes.products import products_bp
from routes.subscriptions import subscriptions_bp
from routes.payments import payments_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=Config.JWT_ACCESS_TOKEN_EXPIRES)

    # Extensions
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    JWTManager(app)
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(pets_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(subscriptions_bp)
    app.register_blueprint(payments_bp)

    # Health check
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "pawtion-api"}), 200

    # Create tables and seed
    with app.app_context():
        db.create_all()
        from utils.seed import seed_data
        seed_data()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
