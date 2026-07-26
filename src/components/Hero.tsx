import React from 'react';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
const heroImage = '/images/ethiopian_habesha_kemis_1784988107480.jpg';

interface HeroProps {
  onShopClick: () => void;
  onHeritageClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onHeritageClick }) => {
  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#FAF5EE] to-[#F4ECE1]">
      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Portrait Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Decorative Accent Frame */}
              <div className="absolute -inset-4 border border-[#D4AF37]/40 translate-x-3 translate-y-3 pointer-events-none hidden sm:block" />
              
              {/* Main Editorial Image Container */}
              <div className="relative overflow-hidden bg-[#2C1A14] aspect-[4/5] shadow-2xl group">
                <img
                  src={heroImage}
                  alt="YARED TIBEB Royal Habesha Kemis with Traditional Hand-Embroidered Circular Flared Skirt"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0B]/80 via-transparent to-transparent" />
                
                {/* Floating Artisan Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-[#FAF6F0]/95 backdrop-blur-md p-4 border-l-4 border-[#D4AF37] shadow-xl">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="text-[#D4AF37] shrink-0" size={20} />
                    <div>
                      <p className="font-serif-heading font-semibold text-sm text-[#2C1A14]">
                        Master Handwoven Shemma
                      </p>
                      <p className="text-xs text-[#2C1A14]/70 font-medium">
                        Pure Cotton & Metallic Gold Thread • Addis Ababa Weavers
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Golden Seal */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#2C1A14] text-[#D4AF37] border-2 border-[#D4AF37] rounded-full p-2 flex flex-col items-center justify-center text-center shadow-2xl rotate-12 hidden sm:flex">
                <Award size={18} className="mb-0.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider leading-tight">
                  100% Royal Heritage
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy, Brand Statement & Stats */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#1A0F0B]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                Where Ethiopian Heritage Meets Modern Fashion.
              </span>
            </div>

            <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-[#2C1A14]">
              Elegance Woven <br />
              <span className="italic font-serif-heading text-[#C59B27] font-semibold">
                Through Generations
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#2C1A14]/80 leading-relaxed font-sans-ui max-w-xl">
              YARED TIBEB crafts bespoke traditional Habesha dresses, tailored Men’s Tibeb suits, and bridal ensembles. Each piece honors centuries-old looms, transforming pure Ethiopian cotton and gold metallic threads into timeless luxury.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#ECE3D4]">
              <div className="space-y-1">
                <p className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#2C1A14]">
                  100%
                </p>
                <p className="text-xs text-[#2C1A14]/70 uppercase tracking-wider font-medium">
                  Handmade Artisanal
                </p>
              </div>

              <div className="space-y-1 border-l border-[#ECE3D4] pl-4">
                <p className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#2C1A14]">
                  4.8K+
                </p>
                <p className="text-xs text-[#2C1A14]/70 uppercase tracking-wider font-medium">
                  Global Clients
                </p>
              </div>

              <div className="space-y-1 border-l border-[#ECE3D4] pl-4">
                <p className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#2C1A14]">
                  35+ Yrs
                </p>
                <p className="text-xs text-[#2C1A14]/70 uppercase tracking-wider font-medium">
                  Loom Legacy
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={onShopClick}
                className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-[#2C1A14] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#1A0F0B] font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl group"
              >
                <span>Shop Collection</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onHeritageClick}
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 border border-[#2C1A14] text-[#2C1A14] hover:border-[#D4AF37] hover:text-[#D4AF37] font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300"
              >
                <span>Explore Heritage</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
