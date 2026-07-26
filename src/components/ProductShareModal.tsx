import React, { useState } from 'react';
import { Product } from '../types';
import { X, Copy, Check, Instagram, Facebook, Twitter, Pin, MessageCircle, Share2 } from 'lucide-react';

interface ProductShareModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductShareModal: React.FC<ProductShareModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/#product-${product.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`Discover this handcrafted Ethiopian fashion piece: ${product.name} at YARED TIBEB`);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      ),
      url: `https://api.whatsapp.com/send?phone=251923095380&text=${encodedText}%20${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-sky-500">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.87 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.128.831.942z"/>
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook size={20} className="text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'X / Twitter',
      icon: <Twitter size={20} className="text-sky-500" />,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      name: 'Pinterest',
      icon: <Pin size={20} className="text-red-600" />,
      url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(product.image)}&description=${encodedText}`,
    },
    {
      name: 'Instagram',
      icon: <Instagram size={20} className="text-pink-600" />,
      url: `https://www.instagram.com/yared_tibeb?igsh=MW5hNXI5NXQyd3Q4NA==`,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF6F0] border border-[#ECE3D4] shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ECE3D4]">
          <div className="flex items-center space-x-2">
            <Share2 size={20} className="text-[#C59B27]" />
            <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14]">
              Share Heritage Piece
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#2C1A14] hover:text-[#D4AF37] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Share Preview Card */}
        <div className="flex items-center space-x-4 bg-[#FAF5EE] p-3 border border-[#ECE3D4]">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-20 object-cover border border-[#D4AF37]/30 shrink-0"
          />
          <div className="space-y-1">
            <p className="font-serif-heading text-sm font-semibold text-[#2C1A14] line-clamp-1">
              {product.name}
            </p>
            <p className="text-xs text-[#C59B27] font-bold">
              ${product.price} USD
            </p>
            <p className="text-[10px] text-[#2C1A14]/70 uppercase tracking-wider">
              yaredtibeb.com
            </p>
          </div>
        </div>

        {/* Social Platforms Grid */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2C1A14]">
            Share to Socials
          </p>
          <div className="grid grid-cols-2 gap-2">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-white border border-[#ECE3D4] hover:border-[#D4AF37] hover:bg-[#FAF5EE] transition-colors text-xs font-semibold text-[#2C1A14]"
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Copy Product URL Section */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#2C1A14]">
            Copy Product Link
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-white border border-[#ECE3D4] px-3 py-2 text-xs text-[#2C1A14] focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1 shrink-0 ${
                copied
                  ? 'bg-emerald-800 text-emerald-100'
                  : 'bg-[#2C1A14] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0F0B]'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
