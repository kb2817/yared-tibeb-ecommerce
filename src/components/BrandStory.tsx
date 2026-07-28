import React from 'react';
import { Eye, Target, Instagram, Facebook, Phone, Share2 } from 'lucide-react';

// Vite asset resolution for the About Us hero image preview.
const brandStoryImage = new URL('../assets/images/ethiopian_portrait_craft_1784988380745.jpg', import.meta.url).href;

interface BrandStoryProps {
  imageUrl?: string;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ imageUrl }) => {
  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@yared_tibeb',
      href: 'https://www.instagram.com/yared_tibeb?igsh=MW5hNXI5NXQyd3Q4NA==',
      color: 'hover:text-[#E4405F] hover:border-[#E4405F]',
      icon: <Instagram size={18} />
    },
    {
      name: 'Facebook',
      handle: 'Yared Tibeb',
      href: 'https://www.facebook.com/share/1FvXdXCEnC/',
      color: 'hover:text-[#1877F2] hover:border-[#1877F2]',
      icon: <Facebook size={18} />
    },
    {
      name: 'TikTok',
      handle: '@yared_tibeb_',
      href: 'https://tiktok.com/@yared_tibeb_',
      color: 'hover:text-[#00F2FE] hover:border-[#00F2FE]',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.872 2.897 2.897 0 0 1-2.893-2.893 2.895 2.895 0 0 1 2.893-2.892c.32 0 .633.056.928.164V9.382a6.388 6.388 0 0 0-.928-.068 6.338 6.338 0 0 0-6.333 6.333 6.338 6.338 0 0 0 6.333 6.333 6.338 6.338 0 0 0 6.333-6.333V9.167a8.212 8.212 0 0 0 4.788 1.517V7.24a4.832 4.832 0 0 1-1.002-.554z"/>
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      handle: '+251 92 309 5380',
      href: 'https://wa.me/251923095380',
      color: 'hover:text-[#25D366] hover:border-[#25D366]',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      )
    },
    {
      name: 'Telegram',
      handle: 'Direct Channel',
      href: 'https://t.me/+251923095380',
      color: 'hover:text-[#0088CC] hover:border-[#0088CC]',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.87 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.128.831.942z"/>
        </svg>
      )
    },
    {
      name: 'Call Us',
      handle: '+251 92 309 5380',
      href: 'tel:+251923095380',
      color: 'hover:text-[#D4AF37] hover:border-[#D4AF37]',
      icon: <Phone size={18} />
    }
  ];

  return (
    <section id="brand-story" className="py-24 bg-[#1A0F0B] text-[#FAF6F0] relative overflow-hidden">
      
      {/* Background Decorative Texture Overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Where Ethiopian Heritage Meets Modern Fashion
          </p>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FAF6F0]">
            About Us — Yared Tibeb
          </h2>
          <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/5] bg-[#2C1A14] border border-[#D4AF37]/30 shadow-2xl overflow-hidden group rounded-sm">
              <img
                src={imageUrl || brandStoryImage}
                alt="Traditional Ethiopian Fine Woven Craftsmanship & Habesha Kemis"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0B] via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#1A0F0B]/90 border-l-2 border-[#D4AF37] text-xs">
                <p className="font-serif-heading text-sm font-semibold text-[#D4AF37]">
                  Master Detail & Precision Stitching
                </p>
                <p className="text-[#FAF6F0]/70 mt-0.5">
                  Fine woven fabrics (menen), premium threads (fetil), and intricate hand embroidery.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Copy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <h3 className="font-serif-heading text-2xl sm:text-3xl text-[#D4AF37] font-normal leading-snug">
                Welcome to Yared Tibeb!
              </h3>
              <p className="text-base sm:text-lg text-[#FAF6F0]/90 leading-relaxed font-sans-ui">
                We bring the timeless beauty of traditional Ethiopian artistry into the modern wardrobe.
              </p>
              <p className="text-sm sm:text-base text-[#FAF6F0]/80 leading-relaxed font-sans-ui">
                Every Yared Tibeb garment is a masterclass in detail—crafted from fine woven fabrics (menen), premium threads (fetil), and brought to life through intricate hand embroidery and precision Singer stitching. We create high-quality, statement cultural attire that lets you celebrate your heritage with elegance, no matter where you are in the world.
              </p>
            </div>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#D4AF37]/20">
              
              <div className="space-y-3 p-5 bg-[#25150F] border border-[#D4AF37]/20 rounded-sm">
                <div className="flex items-center space-x-2 text-[#D4AF37]">
                  <Eye size={20} />
                  <h4 className="font-serif-heading font-bold text-base text-[#FAF6F0]">
                    Our Vision
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/80 leading-relaxed">
                  To redefine Ethiopian fashion on the global stage through superior quality, modern aesthetics, and master craftsmanship.
                </p>
              </div>

              <div className="space-y-3 p-5 bg-[#25150F] border border-[#D4AF37]/20 rounded-sm">
                <div className="flex items-center space-x-2 text-[#D4AF37]">
                  <Target size={20} />
                  <h4 className="font-serif-heading font-bold text-base text-[#FAF6F0]">
                    Our Mission
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/80 leading-relaxed">
                  To keep Ethiopia’s rich textile legacy alive by blending age-old hand-embroidery traditions with modern design techniques for generations to come.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Follow Us On Social Media Section */}
        <div className="pt-10 border-t border-[#D4AF37]/30">
          <div className="bg-[#1A0F0B] border-2 border-[#D4AF37]/50 p-6 sm:p-8 rounded-lg shadow-2xl space-y-6 relative overflow-hidden">
            {/* Subtle Gold Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[#D4AF37]">
                  <Share2 size={20} className="animate-pulse" />
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#FAF6F0]">
                    Follow Us On Social Media
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/85">
                  Stay connected with Yared Tibeb for new collections, live runway showcases, and custom tailoring consultations.
                </p>
              </div>
              <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold bg-[#D4AF37]/15 px-3.5 py-1.5 border border-[#D4AF37]/50 rounded-full shrink-0 shadow-sm">
                @yared_tibeb
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 relative z-10">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-3.5 bg-[#25150F] hover:bg-[#2C1A14] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all duration-300 rounded-md flex flex-col items-center justify-center text-center space-y-2 hover:-translate-y-1 hover:shadow-xl ${social.color}`}
                >
                  <div className="p-2.5 bg-[#1A0F0B] text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#1A0F0B] transition-colors rounded-full shadow-inner border border-[#D4AF37]/30">
                    {social.icon}
                  </div>
                  <span className="text-xs font-semibold text-[#FAF6F0] group-hover:text-[#D4AF37] transition-colors">
                    {social.name}
                  </span>
                  <span className="text-[10px] text-[#FAF6F0]/70 truncate max-w-full">
                    {social.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};


