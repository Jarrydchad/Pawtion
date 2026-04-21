"""Seed the database with brands and products."""
from models import db
from models.models import Brand, Product, Subscription


BRANDS_DATA = [
    {"slug": "montego", "name": "Montego", "tagline": "South African everyday nutrition", "color": "#8C5A2B", "logo_emoji": "🦴"},
    {"slug": "ultra-dog", "name": "Ultra Dog", "tagline": "Complete nutrition for all life stages", "color": "#B4472A", "logo_emoji": "🐶"},
    {"slug": "royalcanin", "name": "Royal Canin", "tagline": "Breed- and size-specific nutrition", "color": "#C4574A", "logo_emoji": "👑"},
    {"slug": "hills", "name": "Hill's Science Diet", "tagline": "Science-led everyday nutrition", "color": "#4A8BA8", "logo_emoji": "🔬"},
    {"slug": "acana", "name": "Acana", "tagline": "Protein-rich recipes", "color": "#4D8B5A", "logo_emoji": "🌿"},
    {"slug": "orijen", "name": "Orijen", "tagline": "High-protein whole-prey inspired diets", "color": "#7B5EA7", "logo_emoji": "🥩"},
    {"slug": "purina-pro-plan", "name": "Purina Pro Plan", "tagline": "Performance-focused formulas", "color": "#B98A23", "logo_emoji": "🏅"},
    {"slug": "canidae", "name": "Canidae", "tagline": "Simple ingredient recipes", "color": "#C9872A", "logo_emoji": "🌾"},
]


PRODUCTS_DATA = [
    {"brand": "montego", "name": "Montego Karoo Adult Lamb & Rice", "description": "Adult dry food with lamb and rice for everyday feeding.", "price": 619, "bag_size_kg": 20, "rating": 4.5, "review_count": 540, "tags": [], "compatible_sizes": ["small", "medium", "large", "giant"], "compatible_stages": ["adult"], "img_emoji": "🦴", "is_bestseller": True},
    {"brand": "montego", "name": "Montego Karoo Puppy Chicken", "description": "Puppy formula designed for growth and healthy development.", "price": 589, "bag_size_kg": 8, "rating": 4.5, "review_count": 300, "tags": ["High Protein"], "compatible_sizes": ["toy", "small", "medium", "large"], "compatible_stages": ["puppy"], "img_emoji": "🐕"},
    {"brand": "montego", "name": "Montego Classic Adult", "description": "General adult maintenance food with balanced nutrition.", "price": 479, "bag_size_kg": 25, "rating": 4.3, "review_count": 760, "tags": [], "compatible_sizes": ["small", "medium", "large", "giant"], "compatible_stages": ["adult"], "img_emoji": "🥣"},
    {"brand": "ultra-dog", "name": "Ultra Dog Premium Recipe Adult", "description": "Adult kibble for maintenance, digestion, and coat support.", "price": 539, "bag_size_kg": 20, "rating": 4.4, "review_count": 410, "tags": ["Skin & Coat"], "compatible_sizes": ["small", "medium", "large", "giant"], "compatible_stages": ["adult"], "img_emoji": "🐶"},
    {"brand": "ultra-dog", "name": "Ultra Dog Superwoof Puppy", "description": "Puppy food with DHA support for early development.", "price": 519, "bag_size_kg": 8, "rating": 4.4, "review_count": 220, "tags": ["High Protein"], "compatible_sizes": ["toy", "small", "medium", "large"], "compatible_stages": ["puppy"], "img_emoji": "🍼"},
    {"brand": "ultra-dog", "name": "Ultra Dog Special Diet Sensitive", "description": "Sensitive-digestion formula for adult dogs needing a gentler recipe.", "price": 599, "bag_size_kg": 12, "rating": 4.5, "review_count": 180, "tags": ["Sensitive Stomach"], "compatible_sizes": ["small", "medium", "large"], "compatible_stages": ["adult"], "img_emoji": "💛"},
    {"brand": "royalcanin", "name": "Royal Canin Mini Puppy", "description": "Small-breed puppy recipe with targeted growth support.", "price": 559, "bag_size_kg": 4, "rating": 4.7, "review_count": 860, "tags": ["High Protein"], "compatible_sizes": ["toy", "small"], "compatible_stages": ["puppy"], "img_emoji": "🐾"},
    {"brand": "royalcanin", "name": "Royal Canin Medium Adult", "description": "Adult maintenance formula for medium-sized dogs.", "price": 699, "bag_size_kg": 10, "rating": 4.6, "review_count": 1240, "tags": [], "compatible_sizes": ["medium"], "compatible_stages": ["adult"], "img_emoji": "🐕"},
    {"brand": "royalcanin", "name": "Royal Canin Maxi Adult", "description": "Large-breed adult food with joint-focused support.", "price": 819, "bag_size_kg": 15, "rating": 4.7, "review_count": 950, "tags": ["Joint Support"], "compatible_sizes": ["large", "giant"], "compatible_stages": ["adult"], "img_emoji": "👑"},
    {"brand": "hills", "name": "Hill's Science Diet Adult Chicken & Barley Recipe", "description": "Balanced adult recipe built around everyday digestion and muscle maintenance.", "price": 759, "bag_size_kg": 12, "rating": 4.5, "review_count": 2100, "tags": [], "compatible_sizes": ["small", "medium", "large"], "compatible_stages": ["adult"], "img_emoji": "🔬", "is_bestseller": True},
    {"brand": "hills", "name": "Hill's Science Diet Sensitive Stomach & Skin", "description": "Adult formula aimed at gentle digestion and coat condition.", "price": 839, "bag_size_kg": 11, "rating": 4.7, "review_count": 670, "tags": ["Sensitive Stomach", "Skin & Coat"], "compatible_sizes": ["small", "medium", "large"], "compatible_stages": ["adult"], "img_emoji": "🛡️"},
    {"brand": "hills", "name": "Hill's Science Diet Perfect Weight Adult", "description": "Adult dry food for healthy weight management.", "price": 819, "bag_size_kg": 12, "rating": 4.6, "review_count": 980, "tags": ["Weight Management"], "compatible_sizes": ["medium", "large", "giant"], "compatible_stages": ["adult", "senior"], "img_emoji": "⚖️"},
    {"brand": "acana", "name": "Acana Adult Dog Recipe", "description": "Protein-rich adult recipe with poultry ingredients.", "price": 919, "bag_size_kg": 11.4, "rating": 4.8, "review_count": 620, "tags": ["High Protein"], "compatible_sizes": ["small", "medium", "large", "giant"], "compatible_stages": ["adult"], "img_emoji": "🌿"},
    {"brand": "acana", "name": "Acana Puppy Recipe", "description": "Growth-focused puppy recipe for developing dogs.", "price": 869, "bag_size_kg": 11.4, "rating": 4.8, "review_count": 310, "tags": ["High Protein"], "compatible_sizes": ["small", "medium", "large", "giant"], "compatible_stages": ["puppy"], "img_emoji": "🐶"},
    {"brand": "acana", "name": "Acana Senior Recipe", "description": "Senior formula with a leaner protein-forward profile.", "price": 949, "bag_size_kg": 11.4, "rating": 4.7, "review_count": 260, "tags": ["Joint Support", "High Protein"], "compatible_sizes": ["medium", "large", "giant"], "compatible_stages": ["senior"], "img_emoji": "🦴"},
    {"brand": "orijen", "name": "Orijen Original", "description": "Flagship adult recipe with a broad mix of animal proteins.", "price": 1029, "bag_size_kg": 11.4, "rating": 4.9, "review_count": 1450, "tags": ["Grain-Free", "High Protein"], "compatible_sizes": ["small", "medium", "large", "giant"], "compatible_stages": ["adult"], "img_emoji": "🥩", "is_bestseller": True},
    {"brand": "orijen", "name": "Orijen Puppy", "description": "Puppy formula with dense animal protein and rich nutrition.", "price": 1049, "bag_size_kg": 6, "rating": 4.9, "review_count": 380, "tags": ["Grain-Free", "High Protein"], "compatible_sizes": ["small", "medium", "large"], "compatible_stages": ["puppy"], "img_emoji": "🐾"},
    {"brand": "orijen", "name": "Orijen Senior", "description": "Senior recipe with higher protein and joint-conscious positioning.", "price": 1069, "bag_size_kg": 11.4, "rating": 4.8, "review_count": 540, "tags": ["Joint Support", "Grain-Free", "High Protein"], "compatible_sizes": ["medium", "large", "giant"], "compatible_stages": ["senior"], "img_emoji": "🤍"},
    {"brand": "purina-pro-plan", "name": "Purina Pro Plan Puppy Chicken & Rice Formula", "description": "Puppy formula built around growth and brain development support.", "price": 729, "bag_size_kg": 8, "rating": 4.7, "review_count": 910, "tags": ["High Protein"], "compatible_sizes": ["toy", "small", "medium", "large"], "compatible_stages": ["puppy"], "img_emoji": "🐕‍🦺"},
    {"brand": "purina-pro-plan", "name": "Purina Pro Plan Adult Shredded Blend Chicken & Rice Formula", "description": "Adult formula with mixed kibble textures and high-protein positioning.", "price": 799, "bag_size_kg": 15, "rating": 4.7, "review_count": 1330, "tags": ["High Protein"], "compatible_sizes": ["small", "medium", "large", "giant"], "compatible_stages": ["adult"], "img_emoji": "🏅"},
    {"brand": "purina-pro-plan", "name": "Purina Pro Plan Sensitive Skin & Stomach Salmon & Rice Formula", "description": "Adult food centered on salmon and gentle digestion support.", "price": 829, "bag_size_kg": 13, "rating": 4.8, "review_count": 880, "tags": ["Sensitive Stomach", "Skin & Coat"], "compatible_sizes": ["small", "medium", "large"], "compatible_stages": ["adult"], "img_emoji": "🐟"},
    {"brand": "canidae", "name": "Canidae All Life Stages Multi-Protein", "description": "Multi-protein kibble suitable across life stages.", "price": 689, "bag_size_kg": 11.3, "rating": 4.5, "review_count": 720, "tags": [], "compatible_sizes": ["small", "medium", "large", "giant"], "compatible_stages": ["puppy", "adult", "senior"], "img_emoji": "🌈"},
    {"brand": "canidae", "name": "Canidae PURE Petite Small Breed Salmon Recipe", "description": "Small-breed salmon recipe with a simplified ingredient profile.", "price": 619, "bag_size_kg": 4.5, "rating": 4.6, "review_count": 380, "tags": ["Sensitive Stomach"], "compatible_sizes": ["toy", "small"], "compatible_stages": ["adult"], "img_emoji": "✨"},
    {"brand": "canidae", "name": "Canidae PURE Healthy Weight", "description": "Weight-conscious adult formula with a simpler ingredient list.", "price": 709, "bag_size_kg": 10.8, "rating": 4.5, "review_count": 290, "tags": ["Weight Management"], "compatible_sizes": ["medium", "large", "giant"], "compatible_stages": ["adult", "senior"], "img_emoji": "🥕"},
]


def _reset_catalog_if_safe():
    if Subscription.query.count() > 0:
        print("Catalog changes skipped because subscriptions already exist.")
        return False

    print("Refreshing catalog with current brand/product data...")
    Product.query.delete()
    Brand.query.delete()
    db.session.commit()
    return True


def seed_data(force_reset=False):
    """Insert or refresh brands and products."""
    expected_slugs = {b["slug"] for b in BRANDS_DATA}
    existing_brands = Brand.query.all()
    existing_slugs = {b.slug for b in existing_brands}

    if existing_brands and not force_reset:
        if existing_slugs == expected_slugs and Product.query.count() >= len(PRODUCTS_DATA):
            print("Database already seeded.")
            return
        if not _reset_catalog_if_safe():
            return
    elif force_reset and existing_brands:
        if not _reset_catalog_if_safe():
            return

    print("Seeding brands...")
    brands_data = BRANDS_DATA

    brands = {}
    for bd in brands_data:
        b = Brand(**bd)
        db.session.add(b)
        brands[bd["slug"]] = b

    db.session.flush()

    print("Seeding products...")
    products_data = PRODUCTS_DATA

    for pd in products_data:
        brand_slug = pd.pop("brand")
        p = Product(brand_id=brands[brand_slug].id, **pd)
        db.session.add(p)

    db.session.commit()
    print(f"Seeded {len(brands_data)} brands and {len(products_data)} products.")
