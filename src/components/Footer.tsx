import React from 'react';
import { Instagram, Facebook, Video, Pin, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (view: 'home' | 'catalog' | 'heritage' | 'dashboard' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A0F0B] text-[#FAF6F0] pt-16 pb-8 border-t-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#D4AF37]/20">
          
          {/* Brand & Statement */}
          <div className="md:col-span-4 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs text-[#FAF6F0]/70 leading-relaxed font-sans-ui max-w-sm pt-2">
              The premier destination for authentic Ethiopian traditional fashion, luxury Habesha dresses, tailored Tibeb suits, and heirloom bridal ensembles.
            </p>
            <p className="text-[11px] font-bold text-[#D4AF37] tracking-wider uppercase">
              yaredtibeb.com
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-serif-heading text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/80">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-[#D4AF37] transition-colors">
                  Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    const el = document.getElementById('brand-story');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    const el = document.getElementById('instagram-feed');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Live Feed
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif-heading text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              Studio & Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF6F0]/80">
              <li className="flex items-start space-x-2">
                <MapPin size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span>22, Bedria City Mall, Ground Floor, No. 14, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={14} className="text-[#D4AF37] shrink-0" />
                <a href="tel:+251923095380" className="hover:text-[#D4AF37] transition-colors font-semibold">
                  +251 92 309 5380
                </a>
                <span>/</span>
                <a href="tel:+251947656666" className="hover:text-[#D4AF37] transition-colors">
                  +251 94 765 6666
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={14} className="text-[#D4AF37] shrink-0" />
                <a href="mailto:concierge@yaredtibeb.com" className="hover:text-[#D4AF37] transition-colors">
                  concierge@yaredtibeb.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Icons & Newsletter */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif-heading text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
              Social & Contact
            </h4>
            <div className="flex items-center space-x-3">
              {[
                {
                  icon: <Instagram size={18} />,
                  href: 'https://www.instagram.com/yared_tibeb?igsh=MW5hNXI5NXQyd3Q4NA==',
                  name: 'Instagram'
                },
                {
                  icon: <Facebook size={18} />,
                  href: 'https://www.facebook.com/share/1FvXdXCEnC/',
                  name: 'Facebook'
                },
                {
                  icon: (
                    <svg size={18} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.872 2.897 2.897 0 0 1-2.893-2.893 2.895 2.895 0 0 1 2.893-2.892c.32 0 .633.056.928.164V9.382a6.388 6.388 0 0 0-.928-.068 6.338 6.338 0 0 0-6.333 6.333 6.338 6.338 0 0 0 6.333 6.333 6.338 6.338 0 0 0 6.333-6.333V9.167a8.212 8.212 0 0 0 4.788 1.517V7.24a4.832 4.832 0 0 1-1.002-.554z"/>
                    </svg>
                  ),
                  href: 'https://tiktok.com/@yared_tibeb_',
                  name: 'TikTok'
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                  ),
                  href: 'https://wa.me/251923095380',
                  name: 'WhatsApp (+251 92 309 5380)'
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.87 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.128.831.942z"/>
                    </svg>
                  ),
                  href: 'https://t.me/+251923095380',
                  name: 'Telegram (+251 92 309 5380)'
                },
                {
                  icon: <Phone size={18} />,
                  href: 'tel:+251923095380',
                  name: 'Call +251 92 309 5380'
                }
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#2C1A14] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0F0B] transition-colors rounded-full"
                  title={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <p className="text-[11px] text-[#FAF6F0]/60">
              Direct worldwide insured shipping via DHL Express.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FAF6F0]/60 gap-4">
          <p>© {new Date().getFullYear()} YARED TIBEB (yaredtibeb.com). All Rights Reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 text-[#D4AF37] hover:text-white transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
};
