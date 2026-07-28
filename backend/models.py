from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Enum as SQLEnum, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List, Optional
import enum
from backend.database import Base

class RoleEnum(str, enum.Enum):
    Customer = "Customer"
    Admin = "Admin"

class OrderStatusEnum(str, enum.Enum):
    Pending = "Pending"
    Processing = "Processing"
    Shipped = "Shipped"
    Delivered = "Delivered"
    Cancelled = "Cancelled"

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[RoleEnum] = mapped_column(SQLEnum(RoleEnum), default=RoleEnum.Customer, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    loyalty_points: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    membership_tier: Mapped[str] = mapped_column(String, default="Silver Habesha", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    orders: Mapped[List["Order"]] = relationship("Order", back_populates="user", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String, nullable=False, index=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    original_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    stock: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    image: Mapped[str] = mapped_column(String, nullable=False)
    materials: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    weaving_time_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    artisan_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=5.0, nullable=False)
    reviews_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    customer_name: Mapped[str] = mapped_column(String, nullable=False)
    customer_email: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[OrderStatusEnum] = mapped_column(SQLEnum(OrderStatusEnum), default=OrderStatusEnum.Pending, nullable=False)
    total_price: Mapped[float] = mapped_column(Float, nullable=False)
    shipping_address: Mapped[str] = mapped_column(String, nullable=False)
    tracking_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    payment_method: Mapped[str] = mapped_column(String, default="Credit Card", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped[Optional["User"]] = relationship("User", back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[str] = mapped_column(String, ForeignKey("orders.id"), nullable=False)
    product_id: Mapped[str] = mapped_column(String, ForeignKey("products.id"), nullable=False)
    product_name: Mapped[str] = mapped_column(String, nullable=False)
    product_image: Mapped[str] = mapped_column(String, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    price: Mapped[float] = mapped_column(Float, nullable=False)

    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped[Optional["Product"]] = relationship("Product")
