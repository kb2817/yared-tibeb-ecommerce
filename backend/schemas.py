from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    price: float
    stock: int = 10
    image: str

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    user_id: str
    status: str
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True
