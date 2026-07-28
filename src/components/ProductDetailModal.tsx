import React, { useState } from 'react';
import { Product } from '../types';
import { X, Heart, Share2, ShoppingBag, Check, ShieldCheck, Clock, Award, Sparkles, Tag } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product, size?: string, qty?: number) => void;
  onShareProduct: (p: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onShareProduct,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  const images = [product.image, ...(product.additionalImages || [])];

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FAF6F0] border border-[#ECE3D4] shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#2C1A14] hover:text-[#D4AF37] bg-[#FAF6F0]/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 bg-[#1A0F0B] p-6 flex flex-col justify-between">
            <div className="relative aspect-[3/4] overflow-hidden mb-4 border border-[#D4AF37]/30">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-20 border-2 overflow-hidden shrink-0 transition-all ${
                      selectedImage === img ? 'border-[#D4AF37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Purchase Form */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C59B27]">
                  {product.category} Collection
                </span>
                <span className="text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-medium">
                  In Stock ({product.stock})
                </span>
              </div>

              <h2 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#2C1A14]">
                {product.name}
              </h2>

              <div className="space-y-2">
                <div className="flex items-baseline space-x-3">
                  <span className="font-serif-heading text-3xl font-bold text-[#2C1A14]">
                    ETB {product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-[#2C1A14]/50 line-through">
                      ETB {product.originalPrice}
                    </span>
                  )}
                </div>

                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="bg-gradient-to-r from-red-950/10 via-amber-900/10 to-transparent p-2.5 border-l-4 border-[#C59B27] flex items-center justify-between text-xs font-semibold text-[#2C1A14]">
                    <div className="flex items-center space-x-2">
                      <Tag size={15} className="text-[#C59B27]" />
                      <span>Special Heritage Offer: You Save <strong>ETB {product.originalPrice - product.price}</strong></span>
                    </div>
                    <span className="bg-red-900 text-[#FFD700] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#2C1A14]/80 leading-relaxed font-sans-ui">
                {product.description}
              </p>

              {/* Artisan & Weaving Details */}
              <div className="bg-[#FAF5EE] p-4 border border-[#ECE3D4] space-y-2 text-xs">
                {product.materials && (
                  <div className="flex items-start space-x-2 text-[#2C1A14]">
                    <Sparkles size={14} className="text-[#C59B27] shrink-0 mt-0.5" />
                    <span><strong>Materials:</strong> {product.materials}</span>
                  </div>
                )}

                {product.weavingTimeDays && (
                  <div className="flex items-center space-x-2 text-[#2C1A14]">
                    <Clock size={14} className="text-[#C59B27] shrink-0" />
                    <span><strong>Loom Duration:</strong> {product.weavingTimeDays} days of artisanal handweaving</span>
                  </div>
                )}

                {product.artisanName && (
                  <div className="flex items-center space-x-2 text-[#2C1A14]">
                    <Award size={14} className="text-[#C59B27] shrink-0" />
                    <span><strong>Master Artisan:</strong> {product.artisanName}</span>
                  </div>
                )}
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C1A14]">
                  Select Size / Tailoring
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['S', 'M', 'L', 'XL', 'Bespoke'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-all ${
                        selectedSize === sz
                          ? 'bg-[#2C1A14] text-[#D4AF37] border-[#2C1A14]'
                          : 'bg-white text-[#2C1A14] border-[#ECE3D4] hover:border-[#D4AF37]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2C1A14]">
                  Quantity:
                </label>
                <div className="flex items-center border border-[#ECE3D4] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold hover:bg-[#ECE3D4]"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-sm font-bold hover:bg-[#ECE3D4]"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#ECE3D4]">
              {addedToast && (
                <div className="bg-emerald-900 text-emerald-100 p-2.5 text-xs text-center font-medium flex items-center justify-center space-x-2">
                  <Check size={16} />
                  <span>Added {quantity} x {product.name} ({selectedSize}) to cart!</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-4 bg-[#2C1A14] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#1A0F0B] font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-4 border transition-colors ${
                    isWishlisted
                      ? 'bg-red-900 text-red-100 border-red-900'
                      : 'border-[#2C1A14] text-[#2C1A14] hover:bg-[#2C1A14] hover:text-[#D4AF37]'
                  }`}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>

                <button
                  onClick={() => onShareProduct(product)}
                  className="p-4 border border-[#2C1A14] text-[#2C1A14] hover:bg-[#2C1A14] hover:text-[#D4AF37] transition-colors"
                  title="Share Garment"
                >
                  <Share2 size={18} />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-[#2C1A14]/70 pt-2">
                <ShieldCheck size={14} className="text-[#C59B27]" />
                <span>Worldwide Insured DHL Shipping • Direct from Addis Ababa</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
