from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict
from datetime import datetime
from backend.models import RoleEnum, OrderStatusEnum

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class UserResponse(UserBase):
    id: str
    role: RoleEnum
    loyalty_points: int = Field(alias="loyaltyPoints")
    membership_tier: str = Field(alias="membershipTier")
    created_at: datetime = Field(alias="createdAt")

    class Config:
        from_attributes = True
        populate_by_name = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    price: float
    original_price: Optional[float] = Field(default=None, alias="originalPrice")
    stock: int = 10
    image: str
    materials: Optional[str] = "Handspun Ethiopian Cotton"
    weaving_time_days: Optional[int] = Field(default=14, alias="weavingTimeDays")
    artisan_name: Optional[str] = Field(default="Addis Artisan Collective", alias="artisanName")
    is_featured: Optional[bool] = Field(default=False, alias="isFeatured")

    class Config:
        populate_by_name = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = Field(default=None, alias="originalPrice")
    stock: Optional[int] = None
    image: Optional[str] = None
    materials: Optional[str] = None
    weaving_time_days: Optional[int] = Field(default=None, alias="weavingTimeDays")
    artisan_name: Optional[str] = Field(default=None, alias="artisanName")
    is_featured: Optional[bool] = Field(default=None, alias="isFeatured")

    class Config:
        populate_by_name = True

class ProductResponse(ProductBase):
    id: str
    rating: float = 5.0
    reviews_count: int = Field(default=1, alias="reviewsCount")
    created_at: datetime = Field(alias="createdAt")

    class Config:
        from_attributes = True
        populate_by_name = True

# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: str = Field(alias="productId")
    product_name: str = Field(alias="productName")
    product_image: str = Field(alias="productImage")
    quantity: int
    price: float

    class Config:
        populate_by_name = True

class OrderItemResponse(BaseModel):
    id: int
    product_id: str = Field(alias="productId")
    product_name: str = Field(alias="productName")
    product_image: str = Field(alias="productImage")
    quantity: int
    price: float

    class Config:
        from_attributes = True
        populate_by_name = True

class OrderCreate(BaseModel):
    user_id: Optional[str] = Field(default="guest", alias="userId")
    customer_name: str = Field(alias="customerName")
    customer_email: str = Field(alias="customerEmail")
    items: List[OrderItemCreate]
    total_price: Optional[float] = Field(default=None, alias="totalPrice")
    shipping_address: str = Field(alias="shippingAddress")
    payment_method: Optional[str] = Field(default="Credit Card", alias="paymentMethod")

    class Config:
        populate_by_name = True

class OrderUpdateStatus(BaseModel):
    status: Optional[OrderStatusEnum] = None
    tracking_number: Optional[str] = Field(default=None, alias="trackingNumber")

    class Config:
        populate_by_name = True

class OrderResponse(BaseModel):
    id: str
    user_id: str = Field(alias="userId")
    customer_name: str = Field(alias="customerName")
    customer_email: str = Field(alias="customerEmail")
    items: List[OrderItemResponse]
    status: OrderStatusEnum
    total_price: float = Field(alias="totalPrice")
    shipping_address: str = Field(alias="shippingAddress")
    tracking_number: Optional[str] = Field(default=None, alias="trackingNumber")
    payment_method: str = Field(alias="paymentMethod")
    created_at: datetime = Field(alias="createdAt")

    class Config:
        from_attributes = True
        populate_by_name = True

# Admin Dashboard Stats Schema
class DailySales(BaseModel):
    date: str
    revenue: float
    orders: int

class TopProductStat(BaseModel):
    name: str
    sales_count: int = Field(alias="salesCount")
    revenue: float

    class Config:
        populate_by_name = True

class DashboardStats(BaseModel):
    total_revenue: float = Field(alias="totalRevenue")
    total_orders: int = Field(alias="totalOrders")
    total_customers: int = Field(alias="totalCustomers")
    active_products: int = Field(alias="activeProducts")
    sales_data_30_days: List[DailySales] = Field(alias="salesData30Days")
    top_products: List[TopProductStat] = Field(alias="topProducts")
    orders_by_status: Dict[str, int] = Field(alias="ordersByStatus")

    class Config:
        populate_by_name = True
