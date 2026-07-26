import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User as UserIcon, Shield, Menu, X, Heart, SlidersHorizontal } from 'lucide-react';
import { User } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  currentUser: User | null;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onNavigate: (view: 'home' | 'catalog' | 'heritage' | 'dashboard' | 'admin') => void;
  currentView: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  currentUser,
  onOpenCart,
  onOpenAuth,
  onNavigate,
  currentView,
  searchQuery,
  onSearchChange
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#e7d8b2] ${
        isScrolled
          ? 'bg-[#e7d8b2]/95 backdrop-blur-md border-b border-[#d6c59d] shadow-sm py-3'
          : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#2C1A14] hover:text-[#D4AF37] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group"
          >
            <Logo variant="header" size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm uppercase tracking-wider font-medium transition-colors ${
                currentView === 'home'
                  ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1'
                  : 'text-[#2C1A14] hover:text-[#D4AF37]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className={`text-sm uppercase tracking-wider font-medium transition-colors ${
                currentView === 'catalog'
                  ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1'
                  : 'text-[#2C1A14] hover:text-[#D4AF37]'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                const el = document.getElementById('brand-story');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm uppercase tracking-wider font-medium text-[#2C1A14] hover:text-[#D4AF37] transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                const el = document.getElementById('instagram-feed');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm uppercase tracking-wider font-medium text-[#2C1A14] hover:text-[#D4AF37] transition-colors"
            >
              Studio
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Search Toggle */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#ECE3D4] rounded-full px-3 py-1 animate-fadeIn">
                  <Search size={16} className="text-[#C59B27] mr-2" />
                  <input
                    type="text"
                    placeholder="Search Habesha dress, Tibeb..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-transparent text-xs text-[#2C1A14] focus:outline-none w-36 sm:w-48"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-[#2C1A14] hover:text-red-700 ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsSearchOpen(true);
                    onNavigate('catalog');
                  }}
                  className="p-2 text-[#2C1A14] hover:text-[#D4AF37] transition-colors"
                  title="Search"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Wishlist Indicator */}
            <button
              onClick={() => onNavigate('catalog')}
              className="relative p-2 text-[#2C1A14] hover:text-[#D4AF37] transition-colors hidden sm:block"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#D4AF37] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button with Counter */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#2C1A14] hover:text-[#D4AF37] transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2C1A14] text-[#D4AF37] border border-[#D4AF37] rounded-full text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-[#2C1A14] text-[#D4AF37] border-[#D4AF37]'
                      : 'border-[#C59B27] text-[#2C1A14] hover:bg-[#ECE3D4]'
                  }`}
                >
                  <UserIcon size={14} />
                  <span className="hidden sm:inline font-semibold">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {currentUser.role === 'Admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`p-1.5 rounded-full transition-colors ${
                      currentView === 'admin'
                        ? 'bg-[#D4AF37] text-[#1A0F0B]'
                        : 'bg-[#2C1A14] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0F0B]'
                    }`}
                    title="Admin Control Panel"
                  >
                    <Shield size={16} />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#2C1A14] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#1A0F0B] text-xs font-semibold uppercase tracking-wider rounded-none transition-all duration-300"
              >
                <UserIcon size={14} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6F0] border-b border-[#ECE3D4] px-6 py-4 shadow-xl animate-fadeIn">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => {
                onNavigate('home');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-sm uppercase tracking-wider font-semibold text-[#2C1A14]"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('catalog');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-sm uppercase tracking-wider font-semibold text-[#2C1A14]"
            >
              Shop Collection
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                setIsMobileMenuOpen(false);
                const el = document.getElementById('brand-story');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left text-sm uppercase tracking-wider font-semibold text-[#2C1A14]"
            >
              About Us
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                setIsMobileMenuOpen(false);
                const el = document.getElementById('instagram-feed');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left text-sm uppercase tracking-wider font-semibold text-[#2C1A14]"
            >
              Studio
            </button>
            
            {currentUser && (
              <>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm uppercase tracking-wider font-semibold text-[#D4AF37]"
                >
                  My Dashboard & Orders
                </button>

                {currentUser.role === 'Admin' && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-sm uppercase tracking-wider font-semibold text-red-800"
                  >
                    Admin Control Panel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
