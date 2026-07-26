import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Percent, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, size: string | undefined) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent?: number; amount?: number } | null>({
    code: 'HABESHA10',
    percent: 10
  });
  const [promoError, setPromoError] = useState('');

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalOriginal = cartItems.reduce((sum, item) => {
    const orig = item.product.originalPrice || item.product.price;
    return sum + orig * item.quantity;
  }, 0);

  const catalogSavings = totalOriginal - subtotal;

  let promoSavings = 0;
  if (appliedPromo) {
    if (appliedPromo.percent) {
      promoSavings = (subtotal * appliedPromo.percent) / 100;
    } else if (appliedPromo.amount) {
      promoSavings = Math.min(subtotal, appliedPromo.amount);
    }
  }

  const finalTotal = Math.max(0, subtotal - promoSavings);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const codeUpper = promoCode.trim().toUpperCase();

    if (codeUpper === 'HABESHA10') {
      setAppliedPromo({ code: 'HABESHA10', percent: 10 });
      setPromoCode('');
    } else if (codeUpper === 'TIBEB20') {
      setAppliedPromo({ code: 'TIBEB20', percent: 20 });
      setPromoCode('');
    } else if (codeUpper === 'ENKUTATASH50') {
      setAppliedPromo({ code: 'ENKUTATASH50', amount: 50 });
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon code. Try HABESHA10 or TIBEB20.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] border-l border-[#ECE3D4] shadow-2xl flex flex-col justify-between">
          
          {/* Cart Header */}
          <div className="p-6 border-b border-[#ECE3D4] flex items-center justify-between bg-[#FAF5EE]">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={20} className="text-[#C59B27]" />
              <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14]">
                Your Garment Selection ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#2C1A14] hover:text-[#D4AF37] transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag size={48} className="mx-auto text-[#C59B27]/40" />
                <p className="font-serif-heading text-lg font-medium text-[#2C1A14]">
                  Your Shopping Bag is Empty
                </p>
                <p className="text-xs text-[#2C1A14]/60">
                  Explore our heritage collection and add bespoke Habesha garments to your bag.
                </p>
              </div>
            ) : (
              cartItems.map((item, idx) => {
                const hasDiscount = Boolean(item.product.originalPrice && item.product.originalPrice > item.product.price);
                const itemSavings = hasDiscount
                  ? (item.product.originalPrice! - item.product.price) * item.quantity
                  : 0;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize || 'default'}-${idx}`}
                    className="flex items-start space-x-4 pb-6 border-b border-[#ECE3D4]"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover border border-[#D4AF37]/30 bg-[#1A0F0B] shrink-0"
                    />

                    <div className="flex-1 space-y-1">
                      <h4 className="font-serif-heading font-bold text-sm text-[#2C1A14] line-clamp-1">
                        {item.product.name}
                      </h4>

                      {item.selectedSize && (
                        <span className="inline-block text-[10px] bg-[#ECE3D4] text-[#2C1A14] px-2 py-0.5 font-bold uppercase tracking-wider">
                          Size: {item.selectedSize}
                        </span>
                      )}

                      <div className="flex items-baseline space-x-2 pt-0.5">
                        <span className="text-xs font-bold text-[#C59B27]">
                          ${item.product.price} USD
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-[#2C1A14]/40 line-through">
                            ${item.product.originalPrice} USD
                          </span>
                        )}
                      </div>

                      {hasDiscount && (
                        <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 inline-block rounded">
                          Saved ${itemSavings} USD
                        </div>
                      )}

                      {/* Quantity Adjustment Controls */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#ECE3D4] bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                            className="px-2.5 py-0.5 text-xs font-bold hover:bg-[#ECE3D4]"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                            className="px-2.5 py-0.5 text-xs font-bold hover:bg-[#ECE3D4]"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                          className="text-xs text-red-700 hover:text-red-900 flex items-center space-x-1"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}

            {/* Promo Code Input Box */}
            {cartItems.length > 0 && (
              <div className="bg-[#FAF5EE] p-3.5 border border-[#ECE3D4] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#2C1A14]">
                  <span className="flex items-center space-x-1">
                    <Tag size={13} className="text-[#C59B27]" />
                    <span>Apply Price Coupon</span>
                  </span>
                  <div className="flex space-x-1 text-[9px] text-[#C59B27]">
                    <button onClick={() => { setPromoCode('HABESHA10'); setAppliedPromo({ code: 'HABESHA10', percent: 10 }); }} className="underline hover:text-[#1A0F0B]">
                      HABESHA10 (-10%)
                    </button>
                    <span>|</span>
                    <button onClick={() => { setPromoCode('TIBEB20'); setAppliedPromo({ code: 'TIBEB20', percent: 20 }); }} className="underline hover:text-[#1A0F0B]">
                      TIBEB20 (-20%)
                    </button>
                  </div>
                </div>

                <form onSubmit={handleApplyPromo} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. HABESHA10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-white border border-[#ECE3D4] px-2.5 py-1 text-xs font-bold uppercase focus:outline-none focus:border-[#C59B27]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#2C1A14] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0F0B] text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {promoError && (
                  <p className="text-[10px] text-red-600 font-medium">{promoError}</p>
                )}

                {appliedPromo && (
                  <div className="flex items-center justify-between text-[11px] bg-emerald-100 text-emerald-900 px-2 py-1 rounded font-semibold">
                    <span className="flex items-center space-x-1">
                      <Check size={12} className="text-emerald-700" />
                      <span>Coupon <strong>{appliedPromo.code}</strong> Applied!</span>
                    </span>
                    <button
                      onClick={() => setAppliedPromo(null)}
                      className="text-red-700 hover:underline text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Footer Subtotal & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#ECE3D4] bg-[#FAF5EE] space-y-4">
              <div className="space-y-1.5 text-xs">
                {catalogSavings > 0 && (
                  <div className="flex items-center justify-between text-[#2C1A14]/60">
                    <span>Original Price Total</span>
                    <span className="line-through">${totalOriginal.toFixed(2)} USD</span>
                  </div>
                )}

                {catalogSavings > 0 && (
                  <div className="flex items-center justify-between text-emerald-800 font-medium">
                    <span>Heritage Catalog Discount</span>
                    <span>-${catalogSavings.toFixed(2)} USD</span>
                  </div>
                )}

                {appliedPromo && promoSavings > 0 && (
                  <div className="flex items-center justify-between text-emerald-800 font-medium">
                    <span>Coupon ({appliedPromo.code}) Savings</span>
                    <span>-${promoSavings.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[#2C1A14] pt-1 border-t border-[#ECE3D4]">
                  <span className="font-bold text-sm">Total Payable</span>
                  <span className="font-bold text-base font-serif-heading text-[#2C1A14]">
                    ${finalTotal.toFixed(2)} USD
                  </span>
                </div>

                {(catalogSavings > 0 || promoSavings > 0) && (
                  <div className="bg-emerald-900 text-emerald-100 text-[10px] font-bold py-1 px-2.5 rounded text-center mt-1">
                    🎉 Total Savings: ${(catalogSavings + promoSavings).toFixed(2)} USD
                  </div>
                )}

                <div className="flex items-center justify-between text-[#2C1A14]/60 pt-1">
                  <span>Worldwide Shipping</span>
                  <span className="text-emerald-800 font-semibold">Complimentary DHL Insured</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 bg-[#2C1A14] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#1A0F0B] font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#2C1A14]/60 pt-1">
                <ShieldCheck size={14} className="text-[#C59B27]" />
                <span>Encrypted 256-bit Checkout Security</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
