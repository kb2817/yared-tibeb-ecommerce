import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#2C1A14] via-[#1A0F0B] to-[#2C1A14] text-[#FAF6F0] relative overflow-hidden">
      
      {/* Background Gold Shimmer Texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest">
          <Sparkles size={14} />
          <span>Privé Heritage Circle</span>
        </div>

        <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FAF6F0]">
          Subscribe to YARED TIBEB
        </h2>

        <p className="text-xs sm:text-sm text-[#FAF6F0]/80 max-w-xl mx-auto font-sans-ui leading-relaxed">
          Be first to receive private invitations to our new seasonal Habesha couture releases, bespoke tailoring trunk shows in North America & Europe, and stories from our Addis Ababa looms.
        </p>

        {subscribed ? (
          <div className="bg-[#D4AF37]/20 border border-[#D4AF37] p-6 max-w-md mx-auto text-center space-y-2 animate-fadeIn">
            <CheckCircle2 size={32} className="text-[#D4AF37] mx-auto" />
            <h4 className="font-serif-heading font-bold text-lg text-[#FAF6F0]">
              Welcome to the Privé Heritage Circle
            </h4>
            <p className="text-xs text-[#FAF6F0]/80">
              A private confirmation has been dispatched to <strong>{email}</strong>. Check your inbox for your 10% welcome privilege token.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto pt-2">
            <div className="relative w-full">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A0F0B] border border-[#D4AF37]/40 text-[#FAF6F0] pl-11 pr-4 py-3.5 text-xs focus:outline-none focus:border-[#D4AF37] placeholder-[#FAF6F0]/40"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] text-[#1A0F0B] hover:bg-white font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shrink-0 shadow-lg"
            >
              Join Circle
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
