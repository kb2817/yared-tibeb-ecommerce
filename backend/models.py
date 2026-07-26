from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
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

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.Customer)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    orders = relationship("Order", back_populates="user")

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=10)
    image = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(SQLEnum(OrderStatusEnum), default=OrderStatusEnum.Pending)
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
