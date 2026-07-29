import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS } from './src/data/mockData.js';
import crypto from 'crypto';

// ============================================================
// AUTHENTICATION UTILITIES (Phase A: Critical Security Fixes)
// Uses Node.js built-in crypto — no external dependencies needed
// ============================================================

const JWT_SECRET = process.env.JWT_SECRET || 'yared_tibeb_super_secure_jwt_secret_2026_ethiopian_heritage';
const TOKEN_EXPIRY_HOURS = 24 * 7; // 7 days

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (storedHash.startsWith('scrypt:')) {
      const parts = storedHash.split(':');
      if (parts.length !== 3) return false;
      const [, salt, hash] = parts;
      const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(
        Buffer.from(hash, 'hex'),
        Buffer.from(computedHash, 'hex')
      );
    }
    return password === storedHash;
  } catch {
    return false;
  }
}

function createToken(userId: string, role: string): string {
  const payload = {
    userId,
    role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_HOURS * 3600
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadBase64)
    .digest('base64url');
  return `${payloadBase64}.${signature}`;
}

function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const [payloadBase64, signature] = token.split('.');
    if (!payloadBase64 || !signature) return null;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(payloadBase64)
      .digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Not authenticated' });
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid or expired token' });
  req.user = decoded;
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin access required' });
    next();
  });
}

const app = express();
const PORT = 5000;

app.use(express.json({ limit: '10mb' }));

// Ensure the public images folder exists for uploads and generated branding links.
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// In-memory / file-backed persistent database for dev runtime
const DB_FILE = path.join(process.cwd(), 'data_store.json');
const SITE_IMAGES_FILE = path.join(process.cwd(), 'site-images.json');

interface DataStore {
  products: any[];
  orders: any[];
  users: any[];
}

interface SiteImages {
  heroBanner: string;
  secondaryBanner: string;
  aboutImage: string;
  studioImages: string[];
  collectionBanner: string;
  logo: string;
  footerImage: string;
  backgroundImages: string[];
  promoBanners: string[];
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
      password: hashPassword('adminpassword123'),
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
      password: hashPassword('customerpassword123'),
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

function loadSiteImages(): SiteImages {
  try {
    if (fs.existsSync(SITE_IMAGES_FILE)) {
      const content = fs.readFileSync(SITE_IMAGES_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading site images file:', err);
  }

  const defaultSiteImages: SiteImages = {
    heroBanner: '/images/ethiopian_habesha_kemis_1784988107480.jpg',
    secondaryBanner: '/images/ethiopian_portrait_craft_1784988380745.jpg',
    aboutImage: '/images/ethiopian_portrait_craft_1784988380745.jpg',
    studioImages: [
      '/images/habesha_royal_kemis_1784988585842.jpg',
      '/images/ethiopian_men_suit_1784988598365.jpg',
      '/images/enkutatash_gold_dress_1784988610001.jpg'
    ],
    collectionBanner: '/images/tibeb_blazer_modern_1784988621121.jpg',
    logo: '/images/yared_tibeb_logo_1784972279664.jpg',
    footerImage: '/images/family_heritage_set_1784988636375.jpg',
    backgroundImages: ['/images/lalibela_bridal_kemis_1784988649913.jpg'],
    promoBanners: ['/images/semien_evening_gown_1784988673878.jpg']
  };

  fs.writeFileSync(SITE_IMAGES_FILE, JSON.stringify(defaultSiteImages, null, 2), 'utf-8');
  return defaultSiteImages;
}

function saveSiteImages(data: SiteImages) {
  try {
    fs.writeFileSync(SITE_IMAGES_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving site images file:', err);
  }
}

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/yared_tibeb?igsh=MW5hNXI5NXQyd3Q4NA==';

async function fetchInstagramFeedImages(): Promise<string[]> {
  try {
    const res = await fetch(INSTAGRAM_PROFILE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!res.ok) {
      throw new Error(`Instagram fetch failed with ${res.status}`);
    }

    const html = await res.text();
    const sharedDataMatch = html.match(/window\._sharedData = (.+?);<\/script>/s);
    const images: string[] = [];

    if (sharedDataMatch) {
      try {
        const sharedData = JSON.parse(sharedDataMatch[1]);
        const edges = sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user?.edge_owner_to_timeline_media?.edges || [];
        for (const edge of edges) {
          const node = edge?.node;
          if (!node) continue;
          if (node.display_url) images.push(node.display_url);
          else if (node.thumbnail_src) images.push(node.thumbnail_src);
          else if (node?.edge_sidecar_to_children?.edges) {
            for (const childEdge of node.edge_sidecar_to_children.edges) {
              const childNode = childEdge?.node;
              if (childNode?.display_url) images.push(childNode.display_url);
            }
          }
          if (images.length >= 9) break;
        }
      } catch (err) {
        console.error('Instagram sharedData parse error:', err);
      }
    }

    if (images.length === 0) {
      const ogMatches = [...html.matchAll(/property="og:image" content="([^"]+)"/g)];
      ogMatches.slice(0, 9).forEach((match) => {
        if (match[1]) images.push(match[1]);
      });
    }

    return images.slice(0, 9);
  } catch (err) {
    console.error('Instagram feed fetch error:', err);
    return [];
  }
}

let db = loadDataStore();
let siteImages = loadSiteImages();

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
    password: hashPassword(password),
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
  return res.json({ user: userWithoutPass, token: createToken(newUser.id, newUser.role) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(
    (u) => u.email.toLowerCase() === (email || '').toLowerCase()
  );

  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _, ...userWithoutPass } = user;
  return res.json({ user: userWithoutPass, token: createToken(user.id, user.role) });
});

app.get('/api/site-images', (req, res) => {
  return res.json(siteImages);
});

app.put('/api/site-images', (req, res) => {
  const updates = req.body;
  siteImages = {
    ...siteImages,
    ...updates
  };
  saveSiteImages(siteImages);
  return res.json(siteImages);
});

app.post('/api/site-images/upload', (req, res) => {
  const { fileName, fileData } = req.body;
  if (!fileName || !fileData) {
    return res.status(400).json({ error: 'File name and data are required' });
  }

  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(fileData);
  if (!match) {
    return res.status(400).json({ error: 'Invalid file data format' });
  }

  const extension = path.extname(fileName) || `.${match[1].split('/')[1]}`;
  const baseName = path.basename(fileName, path.extname(fileName));
  const safeBaseName = baseName.replace(/[^a-zA-Z0-9._-]/g, '-');
  const destName = `${Date.now()}-${safeBaseName}${extension}`;
  const destPath = path.join(process.cwd(), 'public', 'images', destName);

  try {
    const buffer = Buffer.from(match[2], 'base64');
    fs.writeFileSync(destPath, buffer);
    return res.json({ path: `/images/${destName}` });
  } catch (err) {
    console.error('Upload save error:', err);
    return res.status(500).json({ error: 'Unable to save uploaded image' });
  }
});

app.get('/api/instagram-live-feed', async (req, res) => {
  const images = await fetchInstagramFeedImages();
  return res.json({ images });
});

app.get('/api/auth/me', requireAuth, (req: any, res) => {
  const user = db.users.find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(401).json({ error: 'User session not found' });
  }
  const { password: _, ...userWithoutPass } = user;
  return res.json({ user: userWithoutPass });
});

app.put('/api/auth/me', requireAuth, (req: any, res) => {
  const userIndex = db.users.findIndex((u) => u.id === req.user.userId);
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
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  return res.json(db.orders);
});

app.put('/api/admin/orders/:id', requireAdmin, (req, res) => {
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

app.get('/api/admin/users', requireAdmin, (req, res) => {
  const safeUsers = db.users.map(({ password, ...u }) => u);
  return res.json(safeUsers);
});

app.get('/api/admin/stats', requireAdmin, (req, res) => {
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

app.use(express.static(path.join(process.cwd(), 'public')));
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
