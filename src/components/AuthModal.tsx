import React, { useState } from 'react';
import { User } from '../types';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister ? { name, email, password, phone } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Authentication failed');
      } else {
        localStorage.setItem('yt_token', data.token);
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Access Handler
  const handleQuickDemo = async (role: 'Customer' | 'Admin') => {
    setErrorMsg('');
    setLoading(true);
    const demoEmail = role === 'Admin' ? 'admin@yaredtibeb.com' : 'customer@yaredtibeb.com';
    const demoPassword = role === 'Admin' ? 'adminpassword123' : 'customerpassword123';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('yt_token', data.token);
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch (err) {
      console.error('Demo auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF6F0] border border-[#ECE3D4] p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#2C1A14] hover:text-[#D4AF37] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Logo variant="header" size="md" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#C59B27] font-medium">
            Studio Privé Account Access
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#ECE3D4] text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
            }}
            className={`flex-1 pb-2 transition-colors ${
              !isRegister ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#2C1A14]/50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
            }}
            className={`flex-1 pb-2 transition-colors ${
              isRegister ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]' : 'text-[#2C1A14]/50'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="bg-[#FAF5EE] p-3 border border-[#ECE3D4] text-center space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27] flex items-center justify-center">
            <ShieldCheck size={14} className="mr-1" /> Quick Demo One-Click Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('Customer')}
              className="py-1.5 bg-[#2C1A14] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0F0B] text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('Admin')}
              className="py-1.5 bg-[#D4AF37] text-[#1A0F0B] hover:bg-[#2C1A14] hover:text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              Demo Admin Panel
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-900/10 border border-red-900 text-red-900 p-2.5 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-bold uppercase text-[#2C1A14] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#ECE3D4] px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Bethlehem Tassew"
              />
            </div>
          )}

          <div>
            <label className="block font-bold uppercase text-[#2C1A14] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#ECE3D4] px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              placeholder="name@yaredtibeb.com"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-[#2C1A14] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#ECE3D4] px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
              placeholder="••••••••"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block font-bold uppercase text-[#2C1A14] mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-[#ECE3D4] px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                placeholder="+1 (202) 555-0192"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#2C1A14] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#1A0F0B] font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
};
