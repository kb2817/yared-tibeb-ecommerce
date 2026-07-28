from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import random

from backend.config import settings
from backend.database import get_db, engine
from backend.models import User, Product, Order, OrderItem, RoleEnum, OrderStatusEnum, Base
from backend import schemas
from backend.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    get_current_admin,
    get_optional_user
)
from backend.seed import seed_db

app = FastAPI(
    title="YARED TIBEB API",
    description="Full-stack Ethiopian Traditional Fashion E-commerce Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    seed_db()

@app.get("/")
def read_root():
    return {
        "brand": "YARED TIBEB",
        "website": "yaredtibeb.com",
        "status": "online",
        "version": "1.0.0"
    }

# ================================
# AUTHENTICATION ENDPOINTS
# ================================

@app.post("/api/auth/register", response_model=schemas.TokenResponse)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email.ilike(user_in.email)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Account with this email already exists")

    new_user = User(
        id=f"usr-{int(datetime.utcnow().timestamp() * 1000)}",
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=RoleEnum.Customer,
        phone=user_in.phone,
        address=user_in.address,
        loyalty_points=100,
        membership_tier="Silver Habesha",
        created_at=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.id, "role": new_user.role.value})
    return schemas.TokenResponse(token=token, access_token=token, user=new_user)

@app.post("/api/auth/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email.ilike(credentials.email)).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token({"sub": user.id, "role": user.role.value})
    return schemas.TokenResponse(token=token, access_token=token, user=user)

@app.get("/api/auth/me", response_model=dict)
def get_me(current_user: User = Depends(get_current_user)):
    return {"user": schemas.UserResponse.from_orm(current_user)}

@app.put("/api/auth/me", response_model=dict)
def update_me(user_update: schemas.UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.phone is not None:
        current_user.phone = user_update.phone
    if user_update.address is not None:
        current_user.address = user_update.address

    db.commit()
    db.refresh(current_user)
    return {"user": schemas.UserResponse.from_orm(current_user)}

# ================================
# PRODUCT ENDPOINTS
# ================================

@app.get("/api/products", response_model=List[schemas.ProductResponse])
def get_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if category and category != "All":
        query = query.filter(Product.category.ilike(category))
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_pattern)) |
            (Product.description.ilike(search_pattern)) |
            (Product.category.ilike(search_pattern))
        )
    return query.order_by(Product.created_at.desc()).all()

@app.get("/api/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

@app.post("/api/products", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: schemas.ProductCreate, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    new_product = Product(
        id=f"yt-{str(int(datetime.utcnow().timestamp()))[-6:]}",
        name=product_in.name,
        description=product_in.description or "",
        category=product_in.category,
        price=product_in.price,
        original_price=product_in.original_price,
        stock=product_in.stock,
        image=product_in.image,
        materials=product_in.materials,
        weaving_time_days=product_in.weaving_time_days,
        artisan_name=product_in.artisan_name,
        is_featured=product_in.is_featured,
        rating=5.0,
        reviews_count=1,
        created_at=datetime.utcnow()
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.put("/api/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(product_id: str, product_update: schemas.ProductUpdate, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    for key, value in product_update.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@app.delete("/api/products/{product_id}")
def delete_product(product_id: str, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully", "id": product_id}

# ================================
# ORDER ENDPOINTS
# ================================

@app.post("/api/orders", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order_in: schemas.OrderCreate, current_user: Optional[User] = Depends(get_optional_user), db: Session = Depends(get_db)):
    if not order_in.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order must contain at least one item")

    if current_user:
        order_in.user_id = current_user.id

    total_price = order_in.total_price if order_in.total_price and order_in.total_price > 0 else sum(item.price * item.quantity for item in order_in.items)
    order_id = f"ORD-{random.randint(10000, 99999)}"
    tracking_number = f"YT-ETH-{random.randint(100000, 999999)}-INTL"

    new_order = Order(
        id=order_id,
        user_id=order_in.user_id or "guest",
        customer_name=order_in.customer_name,
        customer_email=order_in.customer_email,
        status=OrderStatusEnum.Pending,
        total_price=total_price,
        shipping_address=order_in.shipping_address,
        tracking_number=tracking_number,
        payment_method=order_in.payment_method,
        created_at=datetime.utcnow()
    )
    db.add(new_order)
    db.flush()

    for item in order_in.items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            product_image=item.product_image,
            quantity=item.quantity,
            price=item.price
        )
        db.add(order_item)
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock = max(0, product.stock - item.quantity)

    if current_user and current_user.role != RoleEnum.Admin:
        current_user.loyalty_points += int(total_price // 10)
        if current_user.loyalty_points >= 1000:
            current_user.membership_tier = "Royal Axumite"
        elif current_user.loyalty_points >= 500:
            current_user.membership_tier = "Gold Habesha"

    db.commit()
    db.refresh(new_order)
    return new_order

@app.get("/api/orders", response_model=List[schemas.OrderResponse])
def get_orders(
    user_id: Optional[str] = Query(None, alias="userId"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    if current_user.role != RoleEnum.Admin:
        query = query.filter(Order.user_id == current_user.id)
    elif user_id:
        query = query.filter(Order.user_id == user_id)
    return query.order_by(Order.created_at.desc()).all()

@app.get("/api/orders/{order_id}", response_model=schemas.OrderResponse)
def get_order(order_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if current_user.role != RoleEnum.Admin and order.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return order

@app.get("/api/dashboard/user")
def user_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    order_count = len(orders)
    total_spent = sum(o.total_price for o in orders)
    pending_orders = sum(1 for o in orders if o.status == OrderStatusEnum.Pending)
    return {
        "userId": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "orderCount": order_count,
        "totalSpent": total_spent,
        "pendingOrders": pending_orders,
        "loyaltyPoints": current_user.loyalty_points,
        "membershipTier": current_user.membership_tier,
    }

# ================================
# ADMIN ENDPOINTS
# ================================

@app.get("/api/admin/orders", response_model=List[schemas.OrderResponse])
def admin_get_orders(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@app.put("/api/admin/orders/{order_id}", response_model=schemas.OrderResponse)
def admin_update_order(order_id: str, update_in: schemas.OrderUpdateStatus, current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if update_in.status is not None:
        order.status = update_in.status
    if update_in.tracking_number is not None:
        order.tracking_number = update_in.tracking_number
    db.commit()
    db.refresh(order)
    return order

@app.get("/api/admin/users", response_model=List[schemas.UserResponse])
def admin_get_users(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()

@app.get("/api/admin/stats", response_model=schemas.DashboardStats)
def admin_get_stats(current_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    users = db.query(User).all()
    products = db.query(Product).all()

    total_revenue = sum(o.total_price for o in orders if o.status != OrderStatusEnum.Cancelled)
    total_orders = len(orders)
    total_customers = len([u for u in users if u.role == RoleEnum.Customer])
    active_products = len(products)

    orders_by_status = {
        "Pending": sum(1 for o in orders if o.status == OrderStatusEnum.Pending),
        "Processing": sum(1 for o in orders if o.status == OrderStatusEnum.Processing),
        "Shipped": sum(1 for o in orders if o.status == OrderStatusEnum.Shipped),
        "Delivered": sum(1 for o in orders if o.status == OrderStatusEnum.Delivered),
        "Cancelled": sum(1 for o in orders if o.status == OrderStatusEnum.Cancelled)
    }

    sales_data_30_days = []
    today = datetime.utcnow()
    for i in range(30):
        day_date = today - timedelta(days=(29 - i))
        sales_data_30_days.append({
            "date": day_date.strftime("%b %d"),
            "revenue": float(300 + ((i % 5) * 80)),
            "orders": max(1, (300 + ((i % 5) * 80)) // 180)
        })

    top_products = [
        {"name": p.name, "salesCount": 12 - idx, "revenue": float(p.price * (12 - idx))}
        for idx, p in enumerate(products[:4])
    ]

    return schemas.DashboardStats(
        totalRevenue=total_revenue,
        totalOrders=total_orders,
        totalCustomers=total_customers,
        activeProducts=active_products,
        salesData30Days=sales_data_30_days,
        topProducts=top_products,
        ordersByStatus=orders_by_status
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
