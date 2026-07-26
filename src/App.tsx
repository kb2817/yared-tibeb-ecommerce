import React, { useState, useEffect } from 'react';
import { Product, CartItem, User, Order } from './types';
import { INITIAL_PRODUCTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SocialSidebar } from './components/SocialSidebar';
import { ProductShareModal } from './components/ProductShareModal';
import { InstagramFeed } from './components/InstagramFeed';
import { BrandStory } from './components/BrandStory';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'dashboard' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shareProduct, setShareProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Fetch initial products and verify user token on startup
  useEffect(() => {
    fetchProducts();
    checkAuthSession();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      console.log('Using initial products client state');
    }
  };

  const checkAuthSession = async () => {
    const token = localStorage.getItem('yt_token');
    if (!token) return;

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: token }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        localStorage.removeItem('yt_token');
      }
    } catch (err) {
      console.error('Check auth session error:', err);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, size = 'M', qty = 1) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.product.id === product.id && ci.selectedSize === size
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      }
      return [...prev, { product, quantity: qty, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, size: string | undefined, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.product.id === productId && ci.selectedSize === size) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string, size: string | undefined) => {
    setCartItems((prev) =>
      prev.filter((ci) => !(ci.product.id === productId && ci.selectedSize === size))
    );
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // User auth actions
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('yt_token');
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleOrderSuccess = (order: Order) => {
    setCartItems([]);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C1A14] flex flex-col font-sans-ui selection:bg-[#D4AF37] selection:text-[#1A0F0B]">
      
      {/* Top Navbar */}
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigate={(view) => {
          if (view === 'heritage') {
            setCurrentView('home');
            setTimeout(() => {
              const el = document.getElementById('brand-story');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            setCurrentView(view);
          }
        }}
        currentView={currentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Fixed Floating Social Sidebar */}
      <SocialSidebar />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              onShopClick={() => {
                setCurrentView('catalog');
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onHeritageClick={() => {
                const el = document.getElementById('brand-story');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <ProductCatalog
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={(p) => handleAddToCart(p)}
              onShareProduct={(p) => setShareProduct(p)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              searchQuery={searchQuery}
            />

            <BrandStory />

            <InstagramFeed />

            <Testimonials />

            <Newsletter />
          </>
        )}

        {currentView === 'catalog' && (
          <div className="pt-24">
            <ProductCatalog
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={(p) => handleAddToCart(p)}
              onShareProduct={(p) => setShareProduct(p)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              searchQuery={searchQuery}
            />
            <Newsletter />
          </div>
        )}

        {currentView === 'dashboard' && currentUser && (
          <CustomerDashboard
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser((prev) => (prev ? { ...prev, ...updated } : prev))}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'admin' && currentUser?.role === 'Admin' && (
          <AdminDashboard onReturnToStorefront={() => setCurrentView('home')} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(view) => setCurrentView(view)} />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, size, qty) => handleAddToCart(p, size, qty)}
        onShareProduct={(p) => setShareProduct(p)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <ProductShareModal
        product={shareProduct}
        onClose={() => setShareProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
