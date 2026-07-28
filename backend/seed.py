from backend.database import SessionLocal
from backend.models import User, Product, Order, OrderItem, RoleEnum, OrderStatusEnum
from backend.auth import get_password_hash
from datetime import datetime

INITIAL_PRODUCTS = [
    {
        "id": "yt-001",
        "name": "Royal Axumite Zuria Kemis",
        "description": "Handwoven 100% fine Shemma cotton dress with gold Tibeb borders.",
        "category": "Wedding",
        "price": 680.0,
        "original_price": 780.0,
        "stock": 8,
        "image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000",
        "materials": "Pure Handspun Cotton (Shemma), Metallic Gold Threads",
        "weaving_time_days": 28,
        "artisan_name": "Ato Worku & Team",
        "is_featured": True,
        "rating": 5.0,
        "reviews_count": 24,
        "created_at": datetime.utcnow()
    },
    {
        "id": "yt-002",
        "name": "Emperor's Tibeb Suit & Netela",
        "description": "Tailored ivory Shemma linen suit with hand-embroidered Tilf neck detail.",
        "category": "Men's",
        "price": 520.0,
        "original_price": 620.0,
        "stock": 12,
        "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=1000",
        "materials": "Organic Ethiopian Cotton, Silk Embroidery Threads",
        "weaving_time_days": 18,
        "artisan_name": "Gashaw Weaving Studio",
        "is_featured": True,
        "rating": 4.9,
        "reviews_count": 19,
        "created_at": datetime.utcnow()
    }
]

DEFAULT_USERS = [
    {
        "id": "usr-admin",
        "name": "Yared Administrator",
        "email": "admin@yaredtibeb.com",
        "password_hash": get_password_hash("adminpassword123"),
        "role": RoleEnum.Admin,
        "phone": "+251 91 123 4567",
        "address": "Bole Road, Imperial Building #402, Addis Ababa, Ethiopia",
        "loyalty_points": 1250,
        "membership_tier": "Royal Axumite",
        "created_at": datetime.utcnow()
    },
    {
        "id": "usr-cust-1",
        "name": "Bethlehem Tassew",
        "email": "customer@yaredtibeb.com",
        "password_hash": get_password_hash("customerpassword123"),
        "role": RoleEnum.Customer,
        "phone": "+1 202 555 0192",
        "address": "1428 NW Peacock Ave, Washington, DC 20001, USA",
        "loyalty_points": 680,
        "membership_tier": "Gold Habesha",
        "created_at": datetime.utcnow()
    }
]

DEFAULT_ORDERS = [
    {
        "id": "ORD-84920",
        "user_id": "usr-cust-1",
        "customer_name": "Bethlehem Tassew",
        "customer_email": "customer@yaredtibeb.com",
        "status": OrderStatusEnum.Delivered,
        "total_price": 680.0,
        "shipping_address": "1428 NW Peacock Ave, Washington, DC 20001, USA",
        "tracking_number": "YT-ETH-884920-US",
        "payment_method": "Credit Card (Visa ending in 4242)",
        "created_at": datetime.utcnow()
    }
]

DEFAULT_ORDER_ITEMS = [
    {
        "order_id": "ORD-84920",
        "product_id": "yt-001",
        "product_name": "Royal Axumite Zuria Kemis",
        "product_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000",
        "quantity": 1,
        "price": 680.0
    }
]


def seed_db():
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            for user_data in DEFAULT_USERS:
                user = User(**user_data)
                db.add(user)
            db.commit()

        if db.query(Product).count() == 0:
            for product_data in INITIAL_PRODUCTS:
                product = Product(**product_data)
                db.add(product)
            db.commit()

        if db.query(Order).count() == 0:
            for order_data in DEFAULT_ORDERS:
                order = Order(**order_data)
                db.add(order)
            db.commit()

        if db.query(OrderItem).count() == 0:
            for item_data in DEFAULT_ORDER_ITEMS:
                order_item = OrderItem(**item_data)
                db.add(order_item)
            db.commit()
    finally:
        db.close()
