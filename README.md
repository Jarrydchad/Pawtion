# 🐾 Pawtion — Dog Food Subscription API

A Flask + PostgreSQL backend for a dog food subscription platform with multi-pet profiles, smart recommendations, and automated delivery tracking.

---

## Setup

### 1. Prerequisites
- Python 3.10+
- PostgreSQL 14+

### 2. Create Database
```bash
sudo -u postgres psql -c "CREATE USER pawtion WITH PASSWORD 'pawtion123' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE pawtion_db OWNER pawtion;"
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure (optional)
Set environment variables or edit `config.py`:
```bash
export DATABASE_URL="postgresql://pawtion:pawtion123@localhost:5432/pawtion_db"
export SECRET_KEY="your-secret-key"
export JWT_SECRET_KEY="your-jwt-secret"
```

### 5. Run
```bash
python app.py
```
The server starts on `http://localhost:5000`. Tables are created and seed data is loaded automatically on first run.

---

## Frontend (pawtion.jsx)

The UI in `pawtion.jsx` is wired to a Vite + React setup in this repository.

### 1. Install frontend dependencies
```bash
npm install
```

### 2. Run frontend dev server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 3. Build frontend
```bash
npm run build
```

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Log in, get JWT |
| GET | `/api/auth/me` | Get profile (auth) |
| PUT | `/api/auth/me` | Update profile (auth) |

**Signup body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "min6chars",
  "phone": "+27 82 123 4567",
  "street_address": "123 Main Rd",
  "city": "Cape Town",
  "postal_code": "8001"
}
```

### Pets (auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pets` | List user's pets |
| POST | `/api/pets` | Add a pet |
| GET | `/api/pets/:id` | Get pet details |
| PUT | `/api/pets/:id` | Update pet |
| DELETE | `/api/pets/:id` | Remove pet + subscriptions |

**Create pet body:**
```json
{
  "name": "Biscuit",
  "breed": "Labrador",
  "size": "large",          // toy | small | medium | large | giant
  "stage": "adult",         // puppy | adult | senior
  "activity": "active",     // low | moderate | active | athletic
  "weight": 32,
  "health_tags": ["Joint Support", "High Protein"]
}
```

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all (filters: brand, size, stage, tag, search) |
| GET | `/api/products/:id` | Single product |
| GET | `/api/products/brands` | List brands |
| GET | `/api/products/recommend/:pet_id` | Smart recommendations (auth) |
| POST | `/api/products/calculate` | Calculate bag days & monthly cost |

**Query params:** `?brand=pawtion&size=large&stage=adult&tag=Grain-Free&search=chicken`

### Subscriptions (auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions` | List subs (filter: ?status=active\|all) |
| POST | `/api/subscriptions` | Create subscription |
| GET | `/api/subscriptions/:id` | Details + deliveries |
| POST | `/api/subscriptions/:id/cancel` | Cancel |
| POST | `/api/subscriptions/:id/pause` | Pause |
| POST | `/api/subscriptions/:id/resume` | Resume |
| PUT | `/api/subscriptions/:id/update-feeding` | Change daily grams |
| GET | `/api/subscriptions/:id/deliveries` | Delivery history |
| GET | `/api/subscriptions/notifications` | User notifications |
| POST | `/api/subscriptions/notifications/read-all` | Mark all read |

**Create subscription body:**
```json
{
  "pet_id": "uuid",
  "product_id": "uuid",
  "daily_grams": 400
}
```

---

## Project Structure
```
pawtion-backend/
├── app.py                  # Flask app entry point
├── config.py               # Database & JWT config
├── requirements.txt
├── models/
│   ├── __init__.py         # SQLAlchemy instance
│   └── models.py           # User, Pet, Brand, Product, Subscription, Delivery, Notification
├── routes/
│   ├── __init__.py
│   ├── auth.py             # Signup, login, profile
│   ├── pets.py             # Pet CRUD
│   ├── products.py         # Catalog, filtering, recommendations
│   └── subscriptions.py    # Subscriptions, deliveries, notifications
└── utils/
    ├── __init__.py
    └── seed.py             # Seed brands & products
```

## Key Features
- **Smart recommendations** — Products scored by health tag match + rating for each pet
- **Consumption calculator** — Bag duration based on daily feeding amount, adjusted for size/activity/age
- **Auto-delivery scheduling** — Next delivery set 3 days before estimated bag depletion
- **Multi-pet** — Each user can have unlimited pets with independent subscriptions
- **Bag usage tracking** — Real-time percentage based on days since last delivery
