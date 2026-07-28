import React from 'react';

// Use the public image path with Vite base URL so the logo loads correctly in preview
// and WordPress deployment environments. The actual logo asset remains managed
// as a branding image only, with no WooCommerce product changes.
const logoSvg = `${import.meta.env.BASE_URL}images/yared_tibeb_logo.svg`;

interface LogoProps {
  src?: string;
  variant?: 'light' | 'dark' | 'header';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  directOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  src,
  variant = 'header',
  showText = true,
  size = 'md',
  className = '',
  directOnly = false
}) => {
  const logoSrcToUse = src || logoSvg;

  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28'
  };

  const textClasses = {
    header: 'text-[#2C1A14]',
    light: 'text-[#FAF6F0]',
    dark: 'text-[#1A0F0B]'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Exact Reference Gold Emblem Graphic */}
      <div className={`relative ${sizeMap[size]} shrink-0 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}>
        <img
          src={logoSrcToUse}
          alt="YARED TIBEB Gold Emblem Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain filter drop-shadow-sm"
        />
      </div>

      {/* Optional Side Typography */}
      {showText && !directOnly && (
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5">
            <span className={`font-serif-heading font-bold tracking-widest leading-none ${size === 'lg' || size === 'xl' ? 'text-2xl sm:text-3xl' : size === 'sm' ? 'text-lg' : 'text-xl sm:text-2xl'} ${textClasses[variant]}`}>
              YARED <span className="text-[#D4AF37] mx-0.5">❖</span> TIBEB
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#C59B27] font-semibold mt-1">
            Addis Ababa • Luxury Heritage
          </span>
        </div>
      )}
    </div>
  );
};


