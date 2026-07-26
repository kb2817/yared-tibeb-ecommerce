import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS } from './src/data/mockData.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory / file-backed persistent database for dev runtime
const DB_FILE = path.join(process.cwd(), 'data_store.json');

interface DataStore {
  products: any[];
  orders: any[];
  users: any[];
}

function loadDataStore(): DataStore {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading data store:', err);
  }
  
  // Default seed state
  const defaultUsers = [
    {
      id: 'usr-admin',
      name: 'Yared Administrator',
      email: 'admin@yaredtibeb.com',
      password: 'adminpassword123',
      role: 'Admin',
      phone: '+251 91 123 4567',
      address: 'Bole Road, Imperial Building #402, Addis Ababa, Ethiopia',
      loyaltyPoints: 1250,
      membershipTier: 'Royal Axumite',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-cust-1',
      name: 'Bethlehem Tassew',
      email: 'customer@yaredtibeb.com',
      password: 'customerpassword123',
      role: 'Customer',
      phone: '+1 202 555 0192',
      address: '1428 NW Peacock Ave, Washington, DC 20001, USA',
      loyaltyPoints: 680,
      membershipTier: 'Gold Habesha',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    }
  ];

  const defaultOrders = [
    {
      id: 'ORD-84920',
      userId: 'usr-cust-1',
      customerName: 'Bethlehem Tassew',
      customerEmail: 'customer@yaredtibeb.com',
      items: [
        {
          productId: 'yt-001',
          productName: 'Royal Axumite Zuria Kemis',
          productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
          quantity: 1,
          price: 680
        }
      ],
      status: 'Delivered',
      totalPrice: 680,
      shippingAddress: '1428 NW Peacock Ave, Washington, DC 20001, USA',
      trackingNumber: 'YT-ETH-884920-US',
      paymentMethod: 'Credit Card (Visa ending in 4242)',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    {
      id: 'ORD-91024',
      userId: 'usr-cust-1',
      customerName: 'Bethlehem Tassew',
      customerEmail: 'customer@yaredtibeb.com',
      items: [
        {
          productId: 'yt-003',
          productName: 'Enkutatash Gold Heritage Dress',
          productImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
          quantity: 1,
          price: 450
        }
      ],
      status: 'Shipped',
      totalPrice: 450,
      shippingAddress: '1428 NW Peacock Ave, Washington, DC 20001, USA',
      trackingNumber: 'YT-ETH-910242-US',
      paymentMethod: 'Credit Card (Visa ending in 4242)',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ];

  const seed = {
    products: INITIAL_PRODUCTS,
    orders: defaultOrders,
    users: defaultUsers
  };
  saveDataStore(seed);
  return seed;
}

function saveDataStore(data: DataStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data store:', err);
  }
}

let db = loadDataStore();

// API ROUTES

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Account with this email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    password,
    role: 'Customer',
    phone: phone || '',
    address: address || '',
    loyaltyPoints: 100, // Welcome points
    membershipTier: 'Silver Habesha',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDataStore(db);

  const { password: _, ...userWithoutPass } = newUser;
  return res.json({ user: userWithoutPass, token: `mock-jwt-token-${newUser.id}` });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(
    (u) => u.email.toLowerCase() === (email || '').toLowerCase()
  );

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPass } = user;
  return res.json({ user: userWithoutPass, token: `mock-jwt-token-${user.id}` });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userId = authHeader.replace('Bearer mock-jwt-token-', '');
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'User session not found' });
  }
  const { password: _, ...userWithoutPass } = user;
  return res.json({ user: userWithoutPass });
});

app.put('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userId = authHeader.replace('Bearer mock-jwt-token-', '');
  const userIndex = db.users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, phone, address } = req.body;
  if (name) db.users[userIndex].name = name;
  if (phone !== undefined) db.users[userIndex].phone = phone;
  if (address !== undefined) db.users[userIndex].address = address;

  saveDataStore(db);
  const { password: _, ...updatedWithoutPass } = db.users[userIndex];
  return res.json({ user: updatedWithoutPass });
});

// Products endpoints
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let result = db.products;

  if (category && category !== 'All') {
    result = result.filter((p) => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  return res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, description, category, price, originalPrice, stock, image, materials, weavingTimeDays, artisanName } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const newProduct = {
    id: `yt-${Date.now().toString().slice(-4)}`,
    name,
    description: description || '',
    category,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    stock: Number(stock || 10),
    image: image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
    materials: materials || 'Handspun Ethiopian Cotton',
    weavingTimeDays: Number(weavingTimeDays || 14),
    artisanName: artisanName || 'Addis Artisan Collective',
    isFeatured: false,
    rating: 5.0,
    reviewsCount: 1,
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  saveDataStore(db);
  return res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    price: Number(req.body.price ?? db.products[index].price),
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : (req.body.originalPrice === null ? undefined : db.products[index].originalPrice),
    stock: Number(req.body.stock ?? db.products[index].stock)
  };

  saveDataStore(db);
  return res.json(db.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = db.products.splice(index, 1);
  saveDataStore(db);
  return res.json({ message: 'Product deleted', product: deleted[0] });
});

// Orders endpoints
app.post('/api/orders', (req, res) => {
  const { userId, customerName, customerEmail, items, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const newOrder = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    userId: userId || 'guest',
    customerName: customerName || 'Valued Guest',
    customerEmail: customerEmail || 'guest@yaredtibeb.com',
    items,
    status: 'Pending',
    totalPrice: totalPrice || items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
    shippingAddress: shippingAddress || 'Standard Delivery',
    trackingNumber: `YT-ETH-${Math.floor(100000 + Math.random() * 900000)}-INTL`,
    paymentMethod: paymentMethod || 'Credit Card',
    createdAt: new Date().toISOString()
  };

  // Award loyalty points to registered users
  if (userId && userId !== 'guest') {
    const userIndex = db.users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      const earned = Math.floor(newOrder.totalPrice / 10);
      db.users[userIndex].loyaltyPoints = (db.users[userIndex].loyaltyPoints || 0) + earned;
    }
  }

  db.orders.unshift(newOrder);
  saveDataStore(db);
  return res.status(201).json(newOrder);
});

app.get('/api/orders', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userOrders = db.orders.filter((o) => o.userId === userId);
    return res.json(userOrders);
  }
  return res.json(db.orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});

// Admin endpoints
app.get('/api/admin/orders', (req, res) => {
  return res.json(db.orders);
});

app.put('/api/admin/orders/:id', (req, res) => {
  const { status, trackingNumber } = req.body;
  const index = db.orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (status) db.orders[index].status = status;
  if (trackingNumber) db.orders[index].trackingNumber = trackingNumber;

  saveDataStore(db);
  return res.json(db.orders[index]);
});

app.get('/api/admin/users', (req, res) => {
  const safeUsers = db.users.map(({ password, ...u }) => u);
  return res.json(safeUsers);
});

app.get('/api/admin/stats', (req, res) => {
  const totalRevenue = db.orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.totalPrice : 0), 0);
  const totalOrders = db.orders.length;
  const totalCustomers = db.users.length;
  const activeProducts = db.products.length;

  const ordersByStatus = {
    Pending: db.orders.filter((o) => o.status === 'Pending').length,
    Processing: db.orders.filter((o) => o.status === 'Processing').length,
    Shipped: db.orders.filter((o) => o.status === 'Shipped').length,
    Delivered: db.orders.filter((o) => o.status === 'Delivered').length,
    Cancelled: db.orders.filter((o) => o.status === 'Cancelled').length
  };

  // Generate 30 days dummy chart data with actual totals
  const salesData30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const randomBase = 300 + Math.sin(i / 2) * 200 + (i % 5) * 80;
    return {
      date: dayStr,
      revenue: Math.round(randomBase + (i === 29 ? totalRevenue % 500 : 0)),
      orders: Math.floor(randomBase / 150) + 1
    };
  });

  const topProducts = db.products.slice(0, 4).map((p) => ({
    name: p.name,
    salesCount: Math.floor(Math.random() * 20) + 5,
    revenue: p.price * (Math.floor(Math.random() * 20) + 5)
  }));

  return res.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    activeProducts,
    ordersByStatus,
    salesData30Days,
    topProducts
  });
});

app.use('/src/assets', express.static(path.join(process.cwd(), 'src/assets')));

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`YARED TIBEB server running on http://localhost:${PORT}`);
  });
}

startServer();
