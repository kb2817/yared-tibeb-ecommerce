import React, { useState, useEffect } from 'react';
import { User, Order } from '../types';
import { User as UserIcon, Package, Award, MapPin, Phone, Mail, CheckCircle2, Clock, Truck, ShieldAlert, Edit2 } from 'lucide-react';

interface CustomerDashboardProps {
  currentUser: User | null;
  onUpdateUser: (updated: Partial<User>) => void;
  onLogout: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onUpdateUser,
  onLogout
}) => {
  if (!currentUser) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'loyalty'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Edit state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [address, setAddress] = useState(currentUser.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentUser.id]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Fetch customer orders error:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('yt_token');
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || ''
        },
        body: JSON.stringify({ name, phone, address })
      });

      if (res.ok) {
        onUpdateUser({ name, phone, address });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-[#FAF6F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Customer Header Card */}
        <div className="bg-[#2C1A14] text-[#FAF6F0] p-6 sm:p-8 border-b-4 border-[#D4AF37] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#D4AF37] text-[#1A0F0B] font-serif-heading font-bold text-2xl rounded-full flex items-center justify-center shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold">
                  {currentUser.name}
                </h1>
                <span className="bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                  {currentUser.membershipTier || 'Gold Habesha'} Member
                </span>
              </div>
              <p className="text-xs text-[#FAF6F0]/70 flex items-center">
                <Mail size={12} className="mr-1 text-[#D4AF37]" /> {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-[#FAF6F0]/60">
                Heritage Points
              </p>
              <p className="font-serif-heading text-2xl font-bold text-[#D4AF37]">
                {currentUser.loyaltyPoints || 680} pts
              </p>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-red-900 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="flex border-b border-[#ECE3D4] space-x-8 text-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'orders'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-[#2C1A14]/70 hover:text-[#2C1A14]'
            }`}
          >
            <Package size={18} />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'profile'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-[#2C1A14]/70 hover:text-[#2C1A14]'
            }`}
          >
            <UserIcon size={18} />
            <span>Profile & Address</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`pb-3 font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'loyalty'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-[#2C1A14]/70 hover:text-[#2C1A14]'
            }`}
          >
            <Award size={18} />
            <span>Loyalty Rewards</span>
          </button>
        </div>

        {/* TAB 1: ORDERS HISTORY & STATUS PROGRESS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loadingOrders ? (
              <div className="text-center py-12 text-xs font-semibold text-[#2C1A14]/70">
                Loading order history...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#FAF5EE] border border-[#ECE3D4] p-12 text-center space-y-3">
                <Package size={36} className="mx-auto text-[#C59B27]" />
                <h3 className="font-serif-heading text-xl font-medium text-[#2C1A14]">
                  No Previous Purchases
                </h3>
                <p className="text-xs text-[#2C1A14]/70">
                  When you acquire bespoke Ethiopian garments, your order progress will be tracked here.
                </p>
              </div>
            ) : (
              orders.map((order) => {
                const currentStep = getStatusStep(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-[#FAF5EE] border border-[#ECE3D4] shadow-md p-6 space-y-6"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE3D4] pb-4">
                      <div>
                        <span className="font-serif-heading font-bold text-lg text-[#2C1A14]">
                          Order #{order.id}
                        </span>
                        <p className="text-xs text-[#2C1A14]/60">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="font-serif-heading text-xl font-bold text-[#2C1A14]">
                          ${order.totalPrice} USD
                        </span>
                        <p className="text-xs text-emerald-800 font-semibold">
                          Status: {order.status}
                        </p>
                      </div>
                    </div>

                    {/* Tracking Progress Bar */}
                    <div className="space-y-2 py-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
                        Tracking Progress • Ref: {order.trackingNumber || 'DHL-PENDING'}
                      </p>

                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase">
                        {['1. Received', '2. Weaving', '3. Dispatched', '4. Delivered'].map((stepName, i) => {
                          const stepNum = i + 1;
                          const isActive = currentStep >= stepNum;

                          return (
                            <div key={stepName} className="space-y-1">
                              <div
                                className={`h-2 transition-all ${
                                  isActive ? 'bg-[#D4AF37]' : 'bg-[#ECE3D4]'
                                }`}
                              />
                              <span className={isActive ? 'text-[#2C1A14]' : 'text-[#2C1A14]/40'}>
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3 pt-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4 bg-white p-3 border border-[#ECE3D4]">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-12 h-16 object-cover border shrink-0"
                          />
                          <div className="flex-1 text-xs">
                            <p className="font-bold text-[#2C1A14]">{item.productName}</p>
                            <p className="text-[#2C1A14]/60">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-serif-heading font-bold text-sm text-[#2C1A14]">
                            ${item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & ADDRESS UPDATE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="bg-[#FAF5EE] border border-[#ECE3D4] p-6 sm:p-8 space-y-6 max-w-2xl">
            <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14] border-b border-[#ECE3D4] pb-3">
              Personal Credentials & Address Book
            </h3>

            {savedSuccess && (
              <div className="bg-emerald-900 text-emerald-100 p-3 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 size={16} />
                <span>Profile information updated successfully!</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2C1A14] uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#ECE3D4] px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2C1A14] uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-[#ECE3D4] px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                  placeholder="+1 (202) 555-0192"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2C1A14] uppercase mb-1">
                  Default Shipping Address
                </label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-[#ECE3D4] p-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Street, Apartment, City, Country"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#2C1A14] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#1A0F0B] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Save Information
            </button>
          </form>
        )}

        {/* TAB 3: LOYALTY SYSTEM & REWARDS */}
        {activeTab === 'loyalty' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FAF5EE] border border-[#ECE3D4] p-6 space-y-4">
              <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14] border-b border-[#ECE3D4] pb-2">
                Membership Status
              </h3>
              <div className="p-4 bg-[#2C1A14] text-[#D4AF37] space-y-2 border-l-4 border-[#D4AF37]">
                <p className="text-xs uppercase tracking-widest font-semibold text-white/70">
                  Current Tier
                </p>
                <h4 className="font-serif-heading text-2xl font-bold text-[#D4AF37]">
                  {currentUser.membershipTier || 'Gold Habesha'}
                </h4>
                <p className="text-[11px] text-[#FAF6F0]/80">
                  Earn 1 Heritage Point for every $10 spent on authentic garments.
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#2C1A14]">
                <div className="flex justify-between font-semibold">
                  <span>Progress to Royal Axumite Tier:</span>
                  <span>{currentUser.loyaltyPoints || 680} / 1,000 pts</span>
                </div>
                <div className="w-full h-2 bg-[#ECE3D4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37]"
                    style={{ width: `${Math.min(100, ((currentUser.loyaltyPoints || 680) / 1000) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#FAF5EE] border border-[#ECE3D4] p-6 space-y-4">
              <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14] border-b border-[#ECE3D4] pb-2">
                Unlocked Privileges
              </h3>
              <ul className="space-y-3 text-xs text-[#2C1A14]/80">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-[#C59B27] shrink-0" />
                  <span>Complimentary Bespoke Tailoring Consultation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-[#C59B27] shrink-0" />
                  <span>Priority DHL Insured International Shipping</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-[#C59B27] shrink-0" />
                  <span>Exclusive Pre-access to Enkutatash New Year Collection</span>
                </li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
