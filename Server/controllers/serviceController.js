/**
 * Services controller — airtime, data, TV subscriptions, electricity bills,
 * flight booking, plus the shared transactions/notifications endpoints.
 */
const {
  NETWORKS,
  DATA_PLANS,
  TV_PROVIDERS,
  DISCOS,
  METER_TYPES,
  ELECTRICITY_MIN,
  ELECTRICITY_MAX,
  AIRTIME_MIN,
  AIRTIME_MAX,
  BANKS,
  AIRPORTS,
  FLIGHTS,
  CABIN_MULTIPLIER,
} = require('../data/catalog');
const { getModel } = require('../models');
const {
  genRef,
  isValidPhone,
  normalisePhone,
  adjustBalance,
  recordTransaction,
  publicTransaction,
} = require('../utils/helpers');
const { fulfillOrder } = require('../services/fulfillment');

/* ------------------------------------------------------------- catalogue */
const getCatalog = async (req, res) => {
  res.json({
    networks: NETWORKS,
    dataPlans: DATA_PLANS,
    tvProviders: TV_PROVIDERS,
    discos: DISCOS,
    meterTypes: METER_TYPES,
    airtime: { min: AIRTIME_MIN, max: AIRTIME_MAX },
    electricity: { min: ELECTRICITY_MIN, max: ELECTRICITY_MAX },
  });
};

/* --------------------------------------------------- shared purchase flow */
const purchase = async (req, res, { category, amount, description, metadata, successDescription }) => {
  const value = Number(amount);

  // 1) atomic debit (guard: sufficient balance)
  const balance = await adjustBalance(req.user._id, -value);
  if (balance === null) {
    return res.status(400).json({ error: 'Insufficient wallet balance. Fund your wallet and try again.' });
  }

  // 2) fulfil the order with the provider (demo: instant success)
  const reference = genRef(category.slice(0, 3).toUpperCase());
  const fulfilment = await fulfillOrder({
    category,
    reference,
    payload: { ...metadata, amount: value, userId: String(req.user._id) },
  });

  if (!fulfilment.success) {
    // 3a) refund and record failure
    const refunded = await adjustBalance(req.user._id, value);
    await recordTransaction({
      userId: req.user._id,
      reference,
      category,
      type: 'debit',
      amount: value,
      status: 'failed',
      description,
      mode: 'wallet',
      balanceBefore: balance + value,
      balanceAfter: refunded,
      metadata: { ...metadata, reason: fulfilment.message || 'Provider error' },
    });
    return res.status(502).json({ error: fulfilment.message || 'Service temporarily unavailable. You have been refunded.' });
  }

  // 3b) record the completed purchase
  const txn = await recordTransaction({
    userId: req.user._id,
    reference,
    category,
    type: 'debit',
    amount: value,
    status: 'completed',
    description: successDescription || description,
    mode: 'wallet',
    balanceBefore: balance + value,
    balanceAfter: balance,
    metadata: { ...metadata, providerRef: fulfilment.providerRef, provider: fulfilment.provider },
  });

  res.status(201).json({
    transaction: publicTransaction(txn),
    balance,
    receipt: {
      reference,
      providerRef: fulfilment.providerRef,
      amount: value,
      category,
      description: successDescription || description,
    },
  });
};

/* ---------------------------------------------------------------- airtime */
const buyAirtime = async (req, res) => {
  try {
    const { network, phone, amount } = req.body;
    const value = Number(amount);
    const net = NETWORKS.find((n) => n.id === network);
    if (!net) return res.status(400).json({ error: 'Select a valid network' });

    const msisdn = normalisePhone(phone);
    if (!isValidPhone(msisdn)) return res.status(400).json({ error: 'Enter a valid Nigerian phone number' });
    if (!value || Number.isNaN(value) || value < AIRTIME_MIN || value > AIRTIME_MAX) {
      return res.status(400).json({ error: `Airtime amount must be between ₦${AIRTIME_MIN} and ₦${AIRTIME_MAX}` });
    }

    await purchase(req, res, {
      category: 'airtime',
      amount: value,
      description: `${net.name} airtime for ${msisdn}`,
      metadata: { network: net.id, networkName: net.name, phone: msisdn },
    });
  } catch (error) {
    console.error('buyAirtime:', error);
    res.status(500).json({ error: 'Airtime purchase failed' });
  }
};

/* ------------------------------------------------------------------- data */
const buyData = async (req, res) => {
  try {
    const { network, planId, phone } = req.body;
    const plan = DATA_PLANS.find((p) => p.id === planId);
    if (!plan) return res.status(400).json({ error: 'Select a valid data plan' });
    if (plan.network !== network) return res.status(400).json({ error: 'Plan does not match network' });

    const msisdn = normalisePhone(phone);
    if (!isValidPhone(msisdn)) return res.status(400).json({ error: 'Enter a valid Nigerian phone number' });

    await purchase(req, res, {
      category: 'data',
      amount: plan.price,
      description: `${plan.size} ${plan.network.toUpperCase()} data for ${msisdn}`,
      metadata: {
        network: plan.network,
        planId: plan.id,
        planLabel: `${plan.size} — ${plan.validity}`,
        phone: msisdn,
      },
    });
  } catch (error) {
    console.error('buyData:', error);
    res.status(500).json({ error: 'Data purchase failed' });
  }
};

/* --------------------------------------------------------------------- TV */
const buyTv = async (req, res) => {
  try {
    const { provider, planId, smartcard, months = 1 } = req.body;
    const tv = TV_PROVIDERS.find((p) => p.id === provider);
    if (!tv) return res.status(400).json({ error: 'Select a valid TV provider' });

    const plan = tv.plans.find((p) => p.id === planId);
    if (!plan) return res.status(400).json({ error: 'Select a valid subscription plan' });

    const card = String(smartcard || '').trim();
    if (!/^\d{8,15}$/.test(card)) {
      return res.status(400).json({ error: 'Enter a valid smartcard/IUC number (8–15 digits)' });
    }

    const monthsPaid = Math.min(Math.max(Number(months) || 1, 1), 12);
    const value = plan.price * monthsPaid;

    await purchase(req, res, {
      category: 'tv',
      amount: value,
      description: `${tv.name} ${plan.label} (${monthsPaid} month${monthsPaid > 1 ? 's' : ''}) for IUC ${card}`,
      metadata: {
        provider: tv.id,
        providerName: tv.name,
        planId: plan.id,
        planLabel: plan.label,
        smartcard: card,
        months: monthsPaid,
      },
    });
  } catch (error) {
    console.error('buyTv:', error);
    res.status(500).json({ error: 'Subscription payment failed' });
  }
};

/* ------------------------------------------------------------ electricity */
const buyElectricity = async (req, res) => {
  try {
    const { disco, meterNumber, meterType = 'prepaid', amount, phone } = req.body;
    const discoInfo = DISCOS.find((d) => d.id === disco);
    if (!discoInfo) return res.status(400).json({ error: 'Select a valid electricity provider' });

    const meter = String(meterNumber || '').trim();
    if (!/^\d{8,13}$/.test(meter)) return res.status(400).json({ error: 'Enter a valid meter number (8–13 digits)' });
    if (!METER_TYPES.find((m) => m.id === meterType)) return res.status(400).json({ error: 'Invalid meter type' });

    const value = Number(amount);
    if (!value || Number.isNaN(value) || value < ELECTRICITY_MIN || value > ELECTRICITY_MAX) {
      return res.status(400).json({
        error: `Amount must be between ₦${ELECTRICITY_MIN.toLocaleString()} and ₦${ELECTRICITY_MAX.toLocaleString()}`,
      });
    }

    const msisdn = phone ? normalisePhone(phone) : null;
    if (msisdn && !isValidPhone(msisdn)) return res.status(400).json({ error: 'Enter a valid phone number' });

    await purchase(req, res, {
      category: 'electricity',
      amount: value,
      description: `${discoInfo.name} — meter ${meter}`,
      metadata: {
        disco: discoInfo.id,
        discoName: discoInfo.name,
        meterNumber: meter,
        meterType,
        phone: msisdn,
      },
    });
  } catch (error) {
    console.error('buyElectricity:', error);
    res.status(500).json({ error: 'Electricity payment failed' });
  }
};

/* ---------------------------------------------------------------- flights */
const getAirports = async (req, res) => res.json({ airports: AIRPORTS });

const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date, cabin = 'economy' } = req.query;
    let results = FLIGHTS;

    if (origin) results = results.filter((f) => f.from.code === String(origin).toUpperCase());
    if (destination) results = results.filter((f) => f.to.code === String(destination).toUpperCase());

    const mult = CABIN_MULTIPLIER[cabin] || 1;
    const flights = results
      .map((f) => ({
        ...f,
        price: Math.round((f.basePrice * mult) / 100) * 100,
        cabin,
      }))
      .sort((a, b) => a.departTime.localeCompare(b.departTime));

    res.json({ count: flights.length, flights });
  } catch (error) {
    res.status(500).json({ error: 'Flight search failed' });
  }
};

const bookFlight = async (req, res) => {
  try {
    const { flightId, date, passengers = [], contactEmail, cabin = 'economy' } = req.body;

    const flight = FLIGHTS.find((f) => f.id === flightId);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    if (!date || Number.isNaN(new Date(date).getTime())) return res.status(400).json({ error: 'Select a valid departure date' });
    if (new Date(date) < new Date(new Date().toDateString())) {
      return res.status(400).json({ error: 'Departure date cannot be in the past' });
    }
    if (!Array.isArray(passengers) || passengers.length < 1 || passengers.length > 6) {
      return res.status(400).json({ error: 'Between 1 and 6 passengers are required' });
    }
    for (const p of passengers) {
      if (!p.fullName || String(p.fullName).trim().length < 3) {
        return res.status(400).json({ error: 'Every passenger needs a full name' });
      }
    }

    const mult = CABIN_MULTIPLIER[cabin] || 1;
    const perPassenger = Math.round((flight.basePrice * mult) / 100) * 100;
    const value = perPassenger * passengers.length;

    await purchase(req, res, {
      category: 'flight',
      amount: value,
      description: `${flight.from.city} → ${flight.to.city} — ${flight.airline} ${flight.flightNo}`,
      metadata: {
        flight: {
          id: flight.id,
          airline: flight.airline,
          flightNo: flight.flightNo,
          from: flight.from,
          to: flight.to,
          departTime: flight.departTime,
          duration: flight.duration,
          aircraft: flight.aircraft,
          baggage: flight.baggage,
        },
        departDate: new Date(date).toISOString(),
        cabin,
        perPassenger,
        passengers,
        contactEmail: contactEmail || req.user.email,
      },
    });
  } catch (error) {
    console.error('bookFlight:', error);
    res.status(500).json({ error: 'Flight booking failed' });
  }
};

const myBookings = async (req, res) => {
  try {
    const Transaction = getModel('Transaction');
    const bookings = await Transaction.find({ user: String(req.user._id), category: 'flight' })
      .sort({ date: -1 })
      .limit(50)
      .lean();
    res.json({ bookings: bookings.map(publicTransaction) });
  } catch (error) {
    res.status(500).json({ error: 'Could not load bookings' });
  }
};

/* ----------------------------------------------------------- transactions */
const listTransactions = async (req, res) => {
  try {
    const Transaction = getModel('Transaction');
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const filter = { user: String(req.user._id) };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const all = await Transaction.find(filter).sort({ date: -1 }).lean();
    const total = all.length;
    const pages = Math.max(Math.ceil(total / limit), 1);
    const slice = all.slice((page - 1) * limit, page * limit);

    res.json({ transactions: slice.map(publicTransaction), total, page, pages });
  } catch (error) {
    console.error('listTransactions:', error);
    res.status(500).json({ error: 'Could not load transactions' });
  }
};

const getTransaction = async (req, res) => {
  try {
    const Transaction = getModel('Transaction');
    const txn = await Transaction.findOne({ reference: req.params.reference, user: String(req.user._id) });
    if (!txn) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ transaction: publicTransaction(txn) });
  } catch (error) {
    res.status(500).json({ error: 'Could not load transaction' });
  }
};

/* ---------------------------------------------------------- notifications */
const getNotifications = async (req, res) => {
  res.json({ notifications: req.user.notifications || [] });
};

const markNotificationsRead = async (req, res) => {
  const User = getModel('User');
  const user = await User.findById(req.user._id);
  if (user) {
    user.notifications = (user.notifications || []).map((n) => ({ ...n, isRead: true }));
    await user.save();
  }
  res.json({ message: 'All notifications marked as read' });
};

module.exports = {
  getCatalog,
  buyAirtime,
  buyData,
  buyTv,
  buyElectricity,
  getAirports,
  searchFlights,
  bookFlight,
  myBookings,
  listTransactions,
  getTransaction,
  getNotifications,
  markNotificationsRead,
};
