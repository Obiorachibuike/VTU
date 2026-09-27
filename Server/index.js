require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDb } = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const carRoutes = require('./routes/carRoutes');
const walletController = require('./controllers/walletController');
const { getDbMode } = require('./utils/db');

const app = express();
app.set('trust proxy', 1);
app.use(cookieParser());

// --- CORS ---------------------------------------------------------------
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // curl / same-origin / mobile apps
    const bare = origin.replace(/\/$/, '');
    if (
      allowedOrigins.includes(bare) ||
      bare.startsWith('http://localhost') ||
      bare.startsWith('http://127.0.0.1') ||
      bare.endsWith('.e2b.app') // sandbox previews
    ) {
      return callback(null, true);
    }
    callback(null, false);
  },
  methods: 'GET,POST,PUT,DELETE,PATCH',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};
app.use(cors(corsOptions));

// Paystack webhooks need the RAW body for signature verification
app.use('/api/webhooks/paystack', express.raw({ type: '*/*' }));

app.use(express.json());

// --- Health -------------------------------------------------------------
app.get('/health', (req, res) =>
  res.json({ status: 'ok', db: getDbMode(), paystack: Boolean(process.env.PAYSTACK_SECRET_KEY), time: new Date().toISOString() })
);

// --- Routes -------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/webhooks/paystack', (req, res, next) => walletController.paystackWebhook(req, res, next));
app.use('/api/cars', carRoutes);

// 404 for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` }));

// --- Error handler (after routes so it actually catches) -----------------
app.use((err, req, res, next) => {
  console.error('[error]', err.message);
  res.status(500).json({ error: err.message || 'An unexpected error occurred' });
});

// --- Bootstrap -----------------------------------------------------------
const PORT = process.env.PORT || 5000;

const seedDemoUser = async () => {
  try {
    const { getModel } = require('./models');
    const User = getModel('User');
    const email = process.env.DEMO_EMAIL || 'demo@subhub247.com';
    const existing = await User.findOne({ email });
    if (existing) return;
    const user = new User({
      name: 'Demo User',
      email,
      password: process.env.DEMO_PASSWORD || 'demo1234',
      phone: '08000000000',
      isVerified: true,
      wallet: { balance: 50000, currency: 'NGN' },
    });
    await user.save();
    console.log(`[seed] demo account ready — ${email} / ${process.env.DEMO_PASSWORD || 'demo1234'} (₦50,000 balance)`);
  } catch (e) {
    console.warn('[seed] demo user skipped:', e.message);
  }
};

(async () => {
  await connectDb();

  // Only seed the throwaway demo account on the embedded fallback store —
  // never on a real MongoDB instance.
  if (getDbMode() === 'file' && process.env.SEED_DEMO_USER !== 'false') {
    await seedDemoUser();
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} [db: ${getDbMode()}]`);
  });
})();
