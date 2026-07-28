export type ProductCategory = 'All' | 'Wedding' | "Men's" | 'Holiday' | 'Family' | 'Baby' | 'Formal';

export type UserRole = 'Customer' | 'Admin';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  loyaltyPoints?: number;
  membershipTier?: 'Silver Habesha' | 'Gold Habesha' | 'Royal Axumite';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  additionalImages?: string[];
  materials?: string;
  weavingTimeDays?: number;
  artisanName?: string;
  isFeatured?: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  shippingAddress: string;
  trackingNumber?: string;
  paymentMethod: string;
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  avatar?: string;
  rating: number;
  comment: string;
  productTitle?: string;
  date: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
}

export interface SiteImages {
  heroBanner: string;
  secondaryBanner: string;
  aboutImage: string;
  studioImages: string[];
  collectionBanner: string;
  logo: string;
  backgroundImages: string[];
  promoBanners: string[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeProducts: number;
  salesData30Days: { date: string; revenue: number; orders: number }[];
  topProducts: { name: string; salesCount: number; revenue: number }[];
  ordersByStatus: Record<OrderStatus, number>;
}
