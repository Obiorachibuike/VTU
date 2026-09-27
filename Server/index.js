const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const db = require('./utils/db.js');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const walletRoutes = require('./routes/walletRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const flightRoutes = require('./routes/flightRoutes');
const { paystackWebhook } = require('./controllers/walletController');
require('dotenv').config();

const app = express();
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === (process.env.FRONTEND_URL || 'http://localhost:3000') || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) || /^https:\/\/[a-zA-Z0-9-]+\.e2b\.app$/.test(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '32kb', verify: (req, res, buffer) => { req.rawBody = Buffer.from(buffer); } }));
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'development-only-session-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' },
}));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'SubHub247 API' }));
app.post('/api/payments/paystack/webhook', paystackWebhook);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes); // Legacy/demo catalog API retained for compatibility.
app.use('/api/wallet', walletRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/flights', flightRoutes);

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((err, req, res, next) => {
  console.error('Unhandled API error:', err.message);
  res.status(err.status || 500).json({ error: err.status && err.status < 500 ? err.message : 'An unexpected server error occurred.' });
});

const PORT = process.env.PORT || 5000;
async function start() {
  if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || !process.env.SESSION_SECRET)) {
    throw new Error('JWT_SECRET and SESSION_SECRET must be configured before production startup.');
  }
  await db.connection();
  app.listen(PORT, '0.0.0.0', () => console.log(`SubHub247 API listening on port ${PORT}`));
}

if (require.main === module) {
  start().catch(error => {
    console.error('API startup failed:', error.message);
    process.exit(1);
  });
}

module.exports = app;
