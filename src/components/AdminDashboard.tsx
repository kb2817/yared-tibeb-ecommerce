import React, { useState, useEffect } from 'react';
import { Product, Order, User, DashboardStats, OrderStatus } from '../types';
import { Shield, BarChart3, Package, ShoppingBag, Users, Plus, Edit2, Trash2, CheckCircle2, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Logo } from './Logo';

interface AdminDashboardProps {
  onReturnToStorefront: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReturnToStorefront }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'users'>('analytics');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // New/Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<any>('Wedding');
  const [prodPrice, setProdPrice] = useState(450);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | ''>('');
  const [prodStock, setProdStock] = useState(10);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordRes, usrRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/products'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/users')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (usrRes.ok) setUsers(await usrRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('Wedding');
    setProdPrice(450);
    setProdOriginalPrice(550);
    setProdStock(10);
    setProdDesc('');
    setProdImage('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000');
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdOriginalPrice(p.originalPrice || '');
    setProdStock(p.stock);
    setProdDesc(p.description);
    setProdImage(p.image);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      category: prodCategory,
      price: Number(prodPrice),
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : null,
      stock: Number(prodStock),
      description: prodDesc,
      image: prodImage
    };

    try {
      if (editingProductId) {
        await fetch(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setIsProductModalOpen(false);
      loadAdminData();
    } catch (err) {
      console.error('Save product error:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      loadAdminData();
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadAdminData();
    } catch (err) {
      console.error('Update order status error:', err);
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-[#FAF6F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-[#1A0F0B] text-[#FAF6F0] p-6 sm:p-8 border-b-4 border-[#D4AF37] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Logo variant="light" size="lg" />
            <div className="border-l border-[#D4AF37]/40 pl-4 py-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C59B27]">
                Management Panel
              </span>
              <h1 className="font-serif-heading text-xl sm:text-2xl font-bold">
                Studio Administration
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadAdminData}
              className="p-2 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0F0B] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={onReturnToStorefront}
              className="px-4 py-2 bg-[#D4AF37] text-[#1A0F0B] hover:bg-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Back to Storefront
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ECE3D4] space-x-8 text-sm">
          {[
            { key: 'analytics', label: 'Dashboard Analytics', icon: <BarChart3 size={18} /> },
            { key: 'products', label: `Products (${products.length})`, icon: <Package size={18} /> },
            { key: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingBag size={18} /> },
            { key: 'users', label: `Users (${users.length})`, icon: <Users size={18} /> }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                  : 'text-[#2C1A14]/70 hover:text-[#2C1A14]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: DASHBOARD ANALYTICS */}
        {activeTab === 'analytics' && stats && (
          <div className="space-y-8">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#FAF5EE] border-t-4 border-[#D4AF37] border-x border-b border-[#ECE3D4] p-6 shadow">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">Total Revenue</p>
                <p className="font-serif-heading text-3xl font-bold text-[#2C1A14] mt-1">
                  ${stats.totalRevenue.toLocaleString()} USD
                </p>
              </div>

              <div className="bg-[#FAF5EE] border-t-4 border-emerald-700 border-x border-b border-[#ECE3D4] p-6 shadow">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Total Orders</p>
                <p className="font-serif-heading text-3xl font-bold text-[#2C1A14] mt-1">
                  {stats.totalOrders}
                </p>
              </div>

              <div className="bg-[#FAF5EE] border-t-4 border-amber-700 border-x border-b border-[#ECE3D4] p-6 shadow">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Active Customers</p>
                <p className="font-serif-heading text-3xl font-bold text-[#2C1A14] mt-1">
                  {stats.totalCustomers}
                </p>
              </div>

              <div className="bg-[#FAF5EE] border-t-4 border-[#2C1A14] border-x border-b border-[#ECE3D4] p-6 shadow">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A14]/70">Garment Catalog</p>
                <p className="font-serif-heading text-3xl font-bold text-[#2C1A14] mt-1">
                  {stats.activeProducts} Items
                </p>
              </div>
            </div>

            {/* Revenue last 30 Days SVG Chart */}
            <div className="bg-[#FAF5EE] border border-[#ECE3D4] p-6 space-y-4 shadow">
              <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14]">
                Revenue & Sales Performance (Last 30 Days)
              </h3>

              <div className="h-48 w-full flex items-end justify-between gap-1 pt-6 px-2 border-b border-[#ECE3D4]">
                {stats.salesData30Days.map((item, idx) => {
                  const maxRev = Math.max(...stats.salesData30Days.map((s) => s.revenue), 1000);
                  const pct = Math.round((item.revenue / maxRev) * 100);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-[#2C1A14] text-[#D4AF37] text-[10px] p-1.5 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                        {item.date}: ${item.revenue}
                      </div>

                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-[#D4AF37] group-hover:bg-[#2C1A14] transition-colors"
                      />
                      <span className="text-[8px] text-[#2C1A14]/50 rotate-45 mt-2 origin-left hidden sm:inline">
                        {idx % 4 === 0 ? item.date : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Orders By Status Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#FAF5EE] border border-[#ECE3D4] p-6 space-y-3 shadow">
                <h3 className="font-serif-heading text-lg font-bold text-[#2C1A14]">
                  Orders Status Breakdown
                </h3>
                <div className="space-y-2 text-xs">
                  {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center p-2 bg-white border border-[#ECE3D4]">
                      <span className="font-semibold text-[#2C1A14]">{status}</span>
                      <span className="px-2 py-0.5 bg-[#2C1A14] text-[#D4AF37] font-bold rounded-full">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FAF5EE] border border-[#ECE3D4] p-6 space-y-3 shadow">
                <h3 className="font-serif-heading text-lg font-bold text-[#2C1A14]">
                  Top Selling Garments
                </h3>
                <div className="space-y-2 text-xs">
                  {stats.topProducts.map((tp, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-white border border-[#ECE3D4]">
                      <span className="font-semibold text-[#2C1A14] line-clamp-1">{tp.name}</span>
                      <span className="text-[#C59B27] font-bold shrink-0 ml-2">
                        {tp.salesCount} sold (${tp.revenue})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14]">
                Garment Catalog Management
              </h3>
              <button
                onClick={handleOpenNewProduct}
                className="px-4 py-2 bg-[#2C1A14] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#1A0F0B] font-bold text-xs uppercase tracking-wider flex items-center space-x-1 transition-colors"
              >
                <Plus size={16} />
                <span>Add New Garment</span>
              </button>
            </div>

            <div className="bg-[#FAF5EE] border border-[#ECE3D4] overflow-x-auto shadow">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2C1A14] text-[#D4AF37] uppercase tracking-wider">
                    <th className="p-3">Item</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE3D4]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white transition-colors">
                      <td className="p-3 flex items-center space-x-3">
                        <img src={p.image} alt="" className="w-10 h-12 object-cover border" />
                        <div>
                          <p className="font-bold text-[#2C1A14]">{p.name}</p>
                          <p className="text-[10px] text-[#2C1A14]/60">{p.id}</p>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-[#C59B27]">{p.category}</td>
                      <td className="p-3">
                        <div className="font-bold text-[#2C1A14]">${p.price} USD</div>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="flex items-center space-x-1 text-[10px]">
                            <span className="line-through text-[#2C1A14]/50">${p.originalPrice}</span>
                            <span className="bg-red-900 text-amber-200 px-1 py-0.2 font-bold rounded">
                              {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="p-1.5 text-blue-800 hover:bg-blue-100 rounded"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-red-800 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14]">
              Customer Order Fulfillment
            </h3>

            <div className="bg-[#FAF5EE] border border-[#ECE3D4] overflow-x-auto shadow">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2C1A14] text-[#D4AF37] uppercase tracking-wider">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Tracking</th>
                    <th className="p-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE3D4]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white transition-colors">
                      <td className="p-3 font-mono font-bold text-[#2C1A14]">{o.id}</td>
                      <td className="p-3">
                        <p className="font-bold text-[#2C1A14]">{o.customerName}</p>
                        <p className="text-[10px] text-[#2C1A14]/60">{o.customerEmail}</p>
                      </td>
                      <td className="p-3 font-bold">${o.totalPrice} USD</td>
                      <td className="p-3 font-bold text-emerald-800">{o.status}</td>
                      <td className="p-3 font-mono text-[10px]">{o.trackingNumber}</td>
                      <td className="p-3 text-right">
                        <select
                          value={o.status}
                          onChange={(e: any) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="bg-white border border-[#ECE3D4] px-2 py-1 text-xs text-[#2C1A14]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14]">
              Registered Accounts & Roles
            </h3>

            <div className="bg-[#FAF5EE] border border-[#ECE3D4] overflow-x-auto shadow">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#2C1A14] text-[#D4AF37] uppercase tracking-wider">
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Heritage Points</th>
                    <th className="p-3">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE3D4]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white transition-colors">
                      <td className="p-3 font-bold text-[#2C1A14]">{u.name}</td>
                      <td className="p-3 text-[#2C1A14]/70">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'Admin' ? 'bg-[#D4AF37] text-[#1A0F0B]' : 'bg-[#ECE3D4] text-[#2C1A14]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#C59B27]">{u.loyaltyPoints || 100} pts</td>
                      <td className="p-3 text-[10px] text-[#2C1A14]/60">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#FAF6F0] border border-[#ECE3D4] p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-serif-heading text-xl font-bold text-[#2C1A14]">
                  {editingProductId ? 'Edit Product' : 'Add New Garment'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full bg-white border p-2 focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Category *</label>
                    <select
                      value={prodCategory}
                      onChange={(e: any) => setProdCategory(e.target.value)}
                      className="w-full bg-white border p-2 focus:border-[#D4AF37]"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Men's">Men's</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Family">Family</option>
                      <option value="Baby">Baby</option>
                      <option value="Formal">Formal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Sale Price ($ USD) *</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-white border p-2 focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Original Price ($ USD) <span className="text-[10px] text-[#C59B27] font-normal">(Optional for Discount)</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 550"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-white border p-2 focus:border-[#D4AF37]"
                    />
                    {prodOriginalPrice && Number(prodOriginalPrice) > Number(prodPrice) && (
                      <span className="text-[10px] text-emerald-800 font-bold block mt-1">
                        Discount: {Math.round((((Number(prodOriginalPrice) - Number(prodPrice)) / Number(prodOriginalPrice)) * 100))}% OFF (Save ${Number(prodOriginalPrice) - Number(prodPrice)})
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full bg-white border p-2 focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full bg-white border p-2 focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-white border p-2 focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#2C1A14] text-[#FAF6F0] font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#1A0F0B] transition-colors"
                >
                  Save Product
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
