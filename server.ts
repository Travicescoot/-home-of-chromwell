import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default settings
const defaultSettings = {
  storeName: 'HOME OF CHROMEWELL',
  tagline: 'Premier Women’s Luxury Boutique',
  contactPerson: 'Olivia ❤️',
  location: 'Dodoma, Tanzania',
  landmark: 'Near CBE College (College of Business Education)',
  city: 'Dodoma',
  whatsappNumber: '255754973156',
  phoneDisplay: '+255 754 973 156',
  mpesaTillNumber: '5829104',
  mpesaTillName: 'HOME OF CHROMEWELL LTD',
  airtelMoneyNumber: '+255 754 973 156',
  tigoPesaNumber: '+255 754 973 156',
  deliveryRates: [
    {
      zone: 'CBE Campus Pickup (Dodoma)',
      fee: 0,
      description: 'Free pickup at Home of Chromwell boutique near CBE College gate',
    },
    {
      zone: 'Dodoma CBD & Surrounds',
      fee: 3000,
      description: 'Area C, Area D, Kisasa, Miyuji, Makulu, Mailimbili (1-2 Hours)',
    },
    {
      zone: 'UDOM & Outskirts (Dodoma)',
      fee: 5000,
      description: 'University of Dodoma, Chamwino, Nzuguni, Ilazo',
    },
    {
      zone: 'Upcountry Tanzania (Bus Parcel / Courier)',
      fee: 8000,
      description: 'Dar es Salaam, Arusha, Mwanza, Morogoro, Mbeya, etc.',
    },
  ],
};

// Initial default products
const defaultProducts = [
  {
    id: 'hoc-off-01',
    name: 'Executive Double-Breasted Ivory Blazer & Trouser Set',
    category: 'Official Wear',
    price: 135000,
    originalPrice: 155000,
    description: 'Crisp tailored power suit designed for corporate executives, conferences, and formal boardrooms. Features structured padded shoulders, gold metallic crested buttons, and high-waisted cigarette trousers.',
    images: [
      'https://images.unsplash.com/photo-1548624313-039e22f2541a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S (UK 8)', 'M (UK 10)', 'L (UK 12)', 'XL (UK 14)'],
    colors: ['Ivory Cream', 'Midnight Black', 'Camel'],
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    isNewArrival: true,
    badge: 'Bestseller',
  },
  {
    id: 'hoc-off-02',
    name: 'Presidential Belted Tweed Dress',
    category: 'Official Wear',
    price: 95000,
    originalPrice: 110000,
    description: 'Refined tweed sheath dress featuring gold fringe trims and a matching waist-cinching gold hardware belt. Perfect for business meetings in Dodoma or formal events.',
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy Houndstooth', 'Black Gold', 'Monochrome'],
    inStock: true,
    stockCount: 12,
    isFeatured: false,
    isNewArrival: true,
  },
  {
    id: 'hoc-off-03',
    name: 'Satin Bow-Neck Executive Silk Blouse',
    category: 'Official Wear',
    price: 55000,
    description: 'Chic pussy-bow neck silk satin blouse with bishop sleeves and mother-of-pearl button cuffs. Elevates any official skirt or trouser combination.',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Champagne Gold', 'Pristine White', 'Deep Emerald'],
    inStock: true,
    stockCount: 15,
  },
  {
    id: 'hoc-clt-01',
    name: 'Golden Hour Satin Maxi Evening Gown',
    category: 'Clothes',
    price: 115000,
    originalPrice: 130000,
    description: 'Floor-length liquid satin dress with cowl neckline and elegant side slit. Turns heads at luxury dinners, gala nights, and exclusive parties.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Gold Champagne', 'Emerald Green', 'Burgundy Wine'],
    inStock: true,
    stockCount: 6,
    isFeatured: true,
    badge: 'Exclusive',
  },
  {
    id: 'hoc-clt-02',
    name: 'Ruched Velvet Asymmetrical Cocktail Dress',
    category: 'Clothes',
    price: 85000,
    description: 'Ultra-luxurious stretch velvet dress featuring one-shoulder silhouette and figure-flattering diagonal ruching.',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Onyx Black', 'Ruby Red'],
    inStock: true,
    stockCount: 10,
    isNewArrival: true,
  },
  {
    id: 'hoc-clt-03',
    name: 'Monochrome Ribbed Bodycon Midi Dress',
    category: 'Clothes',
    price: 65000,
    description: 'Premium heavyweight ribbed knit midi dress. Comfortable yet sculpted elegance for smart-casual outings or dinner with friends.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black & White Stripe', 'Beige Melange'],
    inStock: true,
    stockCount: 14,
  },
  {
    id: 'hoc-sho-01',
    name: 'Crystal Ankle-Strap Stiletto Pumps (10cm)',
    category: 'Shoes',
    price: 125000,
    originalPrice: 145000,
    description: 'Handcrafted pointed-toe stiletto pumps with shimmering crystal embellishments wrapping gently around the ankle. Signature red carpet allure.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['37', '38', '39', '40', '41'],
    colors: ['Metallic Gold', 'Onyx Black', 'Silver Glitter'],
    inStock: true,
    stockCount: 9,
    isFeatured: true,
    badge: 'Popular',
  },
  {
    id: 'hoc-sho-02',
    name: 'Chromewell Sculptural Heel Leather Mules',
    category: 'Shoes',
    price: 95000,
    description: 'Italian-style square-toe slip-on mules featuring an architectural gold geometric heel. Effortless high fashion for Dodoma workdays and weekends.',
    images: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['Nude Bisque', 'Rich Chocolate', 'Matte Black'],
    inStock: true,
    stockCount: 11,
  },
  {
    id: 'hoc-sho-03',
    name: 'Strappy Metallic Gold Party Block Heels',
    category: 'Shoes',
    price: 78000,
    description: 'Chic block heel with delicate crossover straps. Ultra-comfortable for all-day weddings, church, and outdoor celebrations.',
    images: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['37', '38', '39', '40'],
    colors: ['Champagne Gold', 'Rose Gold'],
    inStock: true,
    stockCount: 7,
  },
  {
    id: 'hoc-rng-01',
    name: '18K Gold Plated Emerald Cut Solitaire Ring',
    category: 'Rings',
    price: 45000,
    originalPrice: 55000,
    description: 'Stunning emerald-cut cubic zirconia centerpiece on a triple-polished 18K gold plated hypoallergenic stainless steel band. Tarnish-free and water resistant.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['6 (Small)', '7 (Medium)', '8 (Standard)', '9 (Large)'],
    colors: ['18K Yellow Gold', 'White Gold'],
    inStock: true,
    stockCount: 20,
    isFeatured: true,
    badge: 'Tarnish-Free',
  },
  {
    id: 'hoc-rng-02',
    name: 'Stackable Pavé Wave Ring Set (3 Pieces)',
    category: 'Rings',
    price: 48000,
    description: 'Set of 3 delicate undulating wave bands encrusted with micro-pavé zircons. Wear stacked together or distributed across multiple fingers.',
    images: [
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['6', '7', '8'],
    colors: ['Gold Trio'],
    inStock: true,
    stockCount: 16,
  },
  {
    id: 'hoc-chn-01',
    name: 'Dual Layered Herringbone & Paperclip Gold Chain',
    category: 'Chains',
    price: 58000,
    originalPrice: 70000,
    description: 'The iconic modern layering duo. Seamlessly pairs a sleek 3mm snake herringbone chain with a modern paperclip link chain. 18K vacuum gold plated.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['40cm + 5cm extender'],
    colors: ['Luxury Yellow Gold'],
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    badge: 'Hot Seller',
  },
  {
    id: 'hoc-chn-02',
    name: 'Vintage Roman Coin Medallion Necklace',
    category: 'Chains',
    price: 49000,
    description: 'Etched Roman imperial coin pendant suspended from an artisanal twisted rope chain. An essential staple for low neckline outfits.',
    images: [
      'https://images.unsplash.com/photo-1611591475816-72433e506669?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['45cm chain'],
    colors: ['Antiqued Gold'],
    inStock: true,
    stockCount: 12,
  },
  {
    id: 'hoc-prf-01',
    name: 'Chromewell Velvet Oud & Damask Rose EDP (100ml)',
    category: 'Perfumes',
    price: 145000,
    originalPrice: 165000,
    description: 'Our signature bespoke boutique fragrance. Deep intoxicating notes of rare Cambodian Agarwood, velvety Turkish rose, ambergris, and sweet Bourbon vanilla. Unmatched projection and 24-hour longevity.',
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['100ml EDP', '50ml Travel Edition'],
    colors: ['Amber Flacon'],
    inStock: true,
    stockCount: 14,
    isFeatured: true,
    badge: 'Signature Scent',
  },
  {
    id: 'hoc-prf-02',
    name: 'Soleil Blanc Jasmine & Warm Cashmere (80ml)',
    category: 'Perfumes',
    price: 110000,
    description: 'Airy, luxurious, and magnetic. White floral petals infused with sunlit bergamot, creamy coconut cream, and comforting cashmere wood.',
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['80ml EDP'],
    inStock: true,
    stockCount: 8,
  },
  {
    id: 'hoc-acc-01',
    name: 'The Chromewell Crocodile Embossed Top-Handle Handbag',
    category: 'Accessories',
    price: 130000,
    originalPrice: 150000,
    description: 'Crafted from structured croc-embossed vegan leather with polished gold hardware lock and detachable cross-body strap. Fits your phone, compact makeup, and essentials with royal poise.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['Standard Medium (26cm x 18cm)'],
    colors: ['Glossy Black', 'Caramel Tan', 'Ivory White'],
    inStock: true,
    stockCount: 7,
    isFeatured: true,
    badge: 'Luxury',
  },
  {
    id: 'hoc-acc-02',
    name: 'Italian Silk Printed Square Scarf (90x90cm)',
    category: 'Accessories',
    price: 38000,
    description: 'Multifunctional 100% pure Mulberry silk feeling scarf with baroque chains and equestrian motif. Can be worn around the neck, hair headband, or tied onto your handbag handle.',
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['90cm x 90cm'],
    colors: ['Gold & Emerald Chain', 'Black & Gold Equestrian'],
    inStock: true,
    stockCount: 22,
  },
  {
    id: 'hoc-acc-03',
    name: 'Oversized Cat-Eye Gold Frame Sunglasses',
    category: 'Accessories',
    price: 42000,
    description: 'UV400 protective polarized lenses in gradient smoke, framed by ultra-slender gold metal temples. High glam statement piece.',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['One Size'],
    colors: ['Gradient Smoke / Gold', 'Warm Sepia / Gold'],
    inStock: true,
    stockCount: 15,
  },
];

// Initial default sample order
const defaultOrders = [
  {
    id: 'HOC-4921',
    customerName: 'Fatma Mwakipesile',
    customerPhone: '+255 754 112 390',
    deliveryAddress: 'CBE Main Campus, Hostel Block B, Dodoma',
    deliveryZone: 'CBE Campus Pickup (Dodoma)',
    deliveryFee: 0,
    notes: 'Please package nicely with the signature Chromwell black gift bag.',
    items: [
      {
        productId: 'hoc-off-01',
        name: 'Executive Double-Breasted Ivory Blazer & Trouser Set',
        price: 135000,
        quantity: 1,
        selectedSize: 'M (UK 10)',
        selectedColor: 'Ivory Cream',
        image: 'https://images.unsplash.com/photo-1548624313-039e22f2541a?auto=format&fit=crop&w=1000&q=80',
      },
      {
        productId: 'hoc-rng-01',
        name: '18K Gold Plated Emerald Cut Solitaire Ring',
        price: 45000,
        quantity: 1,
        selectedSize: '7 (Medium)',
        selectedColor: '18K Yellow Gold',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    subtotal: 180000,
    total: 180000,
    paymentMethod: 'mpesa',
    paymentReference: 'QL8392109X',
    status: 'Delivered',
    checkoutType: 'website',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'HOC-8314',
    customerName: 'Amina Salum',
    customerPhone: '+255 768 990 412',
    deliveryAddress: 'Area D, Near St. Gasper Hotel, Dodoma',
    deliveryZone: 'Dodoma CBD & Surrounds',
    deliveryFee: 3000,
    notes: 'Call before dispatch.',
    items: [
      {
        productId: 'hoc-prf-01',
        name: 'Chromwell Velvet Oud & Damask Rose EDP (100ml)',
        price: 145000,
        quantity: 1,
        selectedSize: '100ml EDP',
        selectedColor: 'Amber Flacon',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    subtotal: 145000,
    total: 148000,
    paymentMethod: 'whatsapp',
    status: 'Dispatched',
    checkoutType: 'whatsapp',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'HOC-9102',
    customerName: 'Neema Joseph',
    customerPhone: '+255 713 445 221',
    deliveryAddress: 'Kisasa Heights, House 45, Dodoma',
    deliveryZone: 'Dodoma CBD & Surrounds',
    deliveryFee: 3000,
    notes: 'Ring size is standard size 7.',
    items: [
      {
        productId: 'hoc-chn-01',
        name: 'Dual Layered Herringbone & Paperclip Gold Chain',
        price: 58000,
        quantity: 1,
        selectedSize: '40cm + 5cm extender',
        selectedColor: 'Luxury Yellow Gold',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
      },
      {
        productId: 'hoc-sho-01',
        name: 'Crystal Ankle-Strap Stiletto Pumps (10cm)',
        price: 125000,
        quantity: 1,
        selectedSize: '39',
        selectedColor: 'Metallic Gold',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      },
    ],
    subtotal: 183000,
    total: 186000,
    paymentMethod: 'mpesa',
    paymentReference: 'RH9921443Y',
    status: 'Pending',
    checkoutType: 'website',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Helper to load DB
function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      products: defaultProducts,
      orders: defaultOrders,
      settings: defaultSettings,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      products: parsed.products || defaultProducts,
      orders: parsed.orders || defaultOrders,
      settings: parsed.settings || defaultSettings,
    };
  } catch (err) {
    console.error('Error reading db.json, returning fallback defaults:', err);
    return {
      products: defaultProducts,
      orders: defaultOrders,
      settings: defaultSettings,
    };
  }
}

// Helper to save DB
function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
}

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Admin Auth Token constant / verification
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'chromwell_dodoma_cbe_2025';
const ADMIN_DEFAULT_PASS = process.env.ADMIN_PASSWORD || 'chromwell2025';

function verifyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid admin token' });
  }
  next();
}

// ==================== API ROUTES ====================

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Username can be 'admin' or 'admin@chromwell.co.tz' or any admin handle
  if (password === ADMIN_DEFAULT_PASS) {
    return res.json({
      success: true,
      token: ADMIN_SECRET_KEY,
      admin: {
        username: username || 'admin',
        name: 'Chromwell Store Admin',
        role: 'Administrator',
      },
    });
  }
  return res.status(401).json({ success: false, error: 'Incorrect administrator password.' });
});

// 2. Products API
app.get('/api/products', (req, res) => {
  const db = loadDb();
  res.json(db.products);
});

app.post('/api/products', verifyAdmin, (req, res) => {
  const db = loadDb();
  const newProduct = {
    id: 'hoc-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    name: req.body.name,
    category: req.body.category || 'Clothes',
    price: Number(req.body.price) || 0,
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
    description: req.body.description || '',
    images: Array.isArray(req.body.images) && req.body.images.length > 0
      ? req.body.images
      : ['https://images.unsplash.com/photo-1548624313-039e22f2541a?auto=format&fit=crop&w=1000&q=80'],
    sizes: Array.isArray(req.body.sizes) ? req.body.sizes : ['Standard'],
    colors: Array.isArray(req.body.colors) ? req.body.colors : [],
    inStock: req.body.inStock !== false,
    stockCount: Number(req.body.stockCount) || 10,
    isFeatured: Boolean(req.body.isFeatured),
    isNewArrival: Boolean(req.body.isNewArrival),
    badge: req.body.badge || '',
    createdAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  saveDb(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', verifyAdmin, (req, res) => {
  const db = loadDb();
  const index = db.products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    id: req.params.id, // preserve ID
  };
  saveDb(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', verifyAdmin, (req, res) => {
  const db = loadDb();
  const filtered = db.products.filter((p: any) => p.id !== req.params.id);
  if (filtered.length === db.products.length) {
    return res.status(404).json({ error: 'Product not found' });
  }
  db.products = filtered;
  saveDb(db);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// 3. Orders API
app.get('/api/orders', verifyAdmin, (req, res) => {
  const db = loadDb();
  res.json(db.orders);
});

// Customer order tracker query (accessible to user with order ID or phone)
app.get('/api/orders/track', (req, res) => {
  const query = (req.query.q as string || '').trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ error: 'Order ID or phone number required' });
  }

  const db = loadDb();
  const matched = db.orders.filter((order: any) => {
    const idMatch = order.id.toLowerCase() === query;
    const phoneClean = order.customerPhone.replace(/[^0-9]/g, '');
    const queryClean = query.replace(/[^0-9]/g, '');
    const phoneMatch = queryClean.length >= 7 && phoneClean.includes(queryClean);
    return idMatch || phoneMatch;
  });

  res.json(matched);
});

// Create Order (Website checkout or WhatsApp order log)
app.post('/api/orders', (req, res) => {
  const db = loadDb();
  const {
    customerName,
    customerPhone,
    deliveryAddress,
    deliveryZone,
    deliveryFee,
    notes,
    items,
    paymentMethod,
    paymentReference,
    checkoutType,
  } = req.body;

  if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Customer name, phone number, and items are required.' });
  }

  // Generate readable order ID e.g. HOC-7391
  const orderId = 'HOC-' + Math.floor(1000 + Math.random() * 9000);
  const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const fee = Number(deliveryFee) || 0;
  const total = subtotal + fee;

  const newOrder = {
    id: orderId,
    customerName,
    customerPhone,
    deliveryAddress: deliveryAddress || 'Dodoma (CBE Pick-up)',
    deliveryZone: deliveryZone || 'CBE Campus Pickup (Dodoma)',
    deliveryFee: fee,
    notes: notes || '',
    items,
    subtotal,
    total,
    paymentMethod: paymentMethod || 'mpesa',
    paymentReference: paymentReference || '',
    status: 'Pending',
    checkoutType: checkoutType || 'website',
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);

  // Optionally decrease stock count
  items.forEach((orderedItem: any) => {
    const prod = db.products.find((p: any) => p.id === orderedItem.productId);
    if (prod && typeof prod.stockCount === 'number') {
      prod.stockCount = Math.max(0, prod.stockCount - (Number(orderedItem.quantity) || 1));
      if (prod.stockCount === 0) {
        prod.inStock = false;
      }
    }
  });

  saveDb(db);
  res.status(201).json(newOrder);
});

// Update order status (Pending, Dispatched, Delivered, Cancelled)
app.patch('/api/orders/:id/status', verifyAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Dispatched', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  const db = loadDb();
  const order = db.orders.find((o: any) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json(order);
});

// 4. Store Settings API
app.get('/api/settings', (req, res) => {
  const db = loadDb();
  res.json(db.settings);
});

app.put('/api/settings', verifyAdmin, (req, res) => {
  const db = loadDb();
  db.settings = {
    ...db.settings,
    ...req.body,
  };
  saveDb(db);
  res.json(db.settings);
});

// 5. Image Upload / Quick Asset Base
app.post('/api/upload', verifyAdmin, (req, res) => {
  const { dataUrl, filename } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ error: 'Image data is required' });
  }
  // If it's a dataUrl, return as valid image or save to disk
  res.json({
    url: dataUrl,
    name: filename || 'uploaded_image.jpg',
  });
});

// Setup Vite or Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`✨ HOME OF CHROMWELL server is running on http://localhost:${PORT}`);
  });
}

startServer();
