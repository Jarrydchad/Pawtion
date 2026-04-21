import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "pawtion-super-secret-key-change-in-prod")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://pawtion:pawtion123@localhost:5432/pawtion_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "pawtion-jwt-secret-change-in-prod")
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours

    # Yoco payment gateway
    YOCO_SECRET_KEY = os.getenv("YOCO_SECRET_KEY", "")
    YOCO_WEBHOOK_SECRET = os.getenv("YOCO_WEBHOOK_SECRET", "")

    # Billing settings
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    LOW_STOCK_DAYS = int(os.getenv("LOW_STOCK_DAYS", "7"))  # trigger payment when this many days remain
