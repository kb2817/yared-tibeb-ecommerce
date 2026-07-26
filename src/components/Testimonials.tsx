import React from 'react';
import { INITIAL_REVIEWS } from '../data/mockData';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF6F0] border-t border-[#ECE3D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59B27]">
            Global Customer Acclaim
          </p>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-normal text-[#2C1A14]">
            Voices of Heritage
          </h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto" />
        </div>

        {/* 3 Review Cards Grid with Gold Top Border */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INITIAL_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF5EE] border-t-4 border-[#D4AF37] border-x border-b border-[#ECE3D4] p-8 shadow-md flex flex-col justify-between space-y-6 relative group hover:shadow-xl transition-shadow"
            >
              <div className="space-y-4">
                
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 text-[#D4AF37]">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#2C1A14]/80 italic font-sans-ui leading-relaxed">
                  "{rev.comment}"
                </p>

              </div>

              {/* Customer Info */}
              <div className="pt-4 border-t border-[#ECE3D4] flex items-center justify-between text-xs">
                <div>
                  <p className="font-serif-heading font-bold text-[#2C1A14]">
                    {rev.customerName}
                  </p>
                  {rev.productTitle && (
                    <p className="text-[11px] text-[#C59B27] font-medium mt-0.5">
                      Verified Purchase: {rev.productTitle}
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-[#2C1A14]/50">{rev.date}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
