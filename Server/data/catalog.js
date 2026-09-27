/**
 * Service catalogue.
 *
 * Prices are in Naira (NGN). Swap this module for a live provider feed
 * (VTU provider / Amadeus / etc.) without touching the controllers.
 */

/* ------------------------------------------------------------- Networks */
const NETWORKS = [
  { id: 'mtn', name: 'MTN', image: '/image/mtn.jpg', color: '#ffcc00' },
  { id: 'glo', name: 'Glo', image: '/image/glo.jpg', color: '#43b02a' },
  { id: 'airtel', name: 'Airtel', image: '/image/airtel.jpg', color: '#e40000' },
  { id: '9mobile', name: '9mobile', image: '/image/9mobile.jpg', color: '#00694b' },
];

/* ------------------------------------------------------------ Data plans */
const DATA_PLANS = [
  // MTN
  { id: 'mtn-500mb', network: 'mtn', label: '500MB', size: '500MB', validity: '30 days', price: 345, provider: 'SME' },
  { id: 'mtn-1gb', network: 'mtn', label: '1GB', size: '1GB', validity: '30 days', price: 490, provider: 'SME' },
  { id: 'mtn-2gb', network: 'mtn', label: '2GB', size: '2GB', validity: '30 days', price: 980, provider: 'SME' },
  { id: 'mtn-3gb', network: 'mtn', label: '3GB', size: '3GB', validity: '30 days', price: 1470, provider: 'SME' },
  { id: 'mtn-5gb', network: 'mtn', label: '5GB', size: '5GB', validity: '30 days', price: 2450, provider: 'SME' },
  { id: 'mtn-10gb', network: 'mtn', label: '10GB', size: '10GB', validity: '30 days', price: 4400, provider: 'SME' },
  { id: 'mtn-15gb', network: 'mtn', label: '15GB', size: '15GB', validity: '30 days', price: 7500, provider: 'SME' },
  // Airtel
  { id: 'airtel-500mb', network: 'airtel', label: '500MB', size: '500MB', validity: '30 days', price: 340, provider: 'SME' },
  { id: 'airtel-1gb', network: 'airtel', label: '1GB', size: '1GB', validity: '30 days', price: 480, provider: 'SME' },
  { id: 'airtel-2gb', network: 'airtel', label: '2GB', size: '2GB', validity: '30 days', price: 960, provider: 'SME' },
  { id: 'airtel-5gb', network: 'airtel', label: '5GB', size: '5GB', validity: '30 days', price: 2400, provider: 'SME' },
  { id: 'airtel-10gb', network: 'airtel', label: '10GB', size: '10GB', validity: '30 days', price: 4300, provider: 'SME' },
  { id: 'airtel-15gb', network: 'airtel', label: '15GB', size: '15GB', validity: '30 days', price: 7500, provider: 'SME' },
  // Glo
  { id: 'glo-500mb', network: 'glo', label: '500MB', size: '500MB', validity: '30 days', price: 330, provider: 'SME' },
  { id: 'glo-1gb', network: 'glo', label: '1GB', size: '1GB', validity: '30 days', price: 450, provider: 'SME' },
  { id: 'glo-2gb', network: 'glo', label: '2GB', size: '2GB', validity: '30 days', price: 900, provider: 'SME' },
  { id: 'glo-5gb', network: 'glo', label: '5GB', size: '5GB', validity: '30 days', price: 2250, provider: 'SME' },
  { id: 'glo-10gb', network: 'glo', label: '10GB', size: '10GB', validity: '30 days', price: 4200, provider: 'SME' },
  // 9mobile
  { id: '9mobile-500mb', network: '9mobile', label: '500MB', size: '500MB', validity: '30 days', price: 340, provider: 'SME' },
  { id: '9mobile-1gb', network: '9mobile', label: '1GB', size: '1GB', validity: '30 days', price: 460, provider: 'SME' },
  { id: '9mobile-2gb', network: '9mobile', label: '2GB', size: '2GB', validity: '30 days', price: 920, provider: 'SME' },
  { id: '9mobile-5gb', network: '9mobile', label: '5GB', size: '5GB', validity: '30 days', price: 2300, provider: 'SME' },
  { id: '9mobile-10gb', network: '9mobile', label: '10GB', size: '10GB', validity: '30 days', price: 4350, provider: 'SME' },
];

/* --------------------------------------------------------------- Airtime */
const AIRTIME_NETWORKS = NETWORKS;
const AIRTIME_MIN = 50;
const AIRTIME_MAX = 20000;

/* ------------------------------------------------------------- TV (DStv…) */
const TV_PROVIDERS = [
  {
    id: 'dstv',
    name: 'DStv',
    image: '/image/DSTV.jpg',
    plans: [
      { id: 'dstv-padi', label: 'Padi', price: 4400, months: 1 },
      { id: 'dstv-yanga', label: 'Yanga', price: 6000, months: 1 },
      { id: 'dstv-confam', label: 'Confam', price: 11000, months: 1 },
      { id: 'dstv-compact', label: 'Compact', price: 19000, months: 1 },
      { id: 'dstv-compact-plus', label: 'Compact Plus', price: 30000, months: 1 },
      { id: 'dstv-premium', label: 'Premium', price: 44500, months: 1 },
    ],
  },
  {
    id: 'gotv',
    name: 'GOtv',
    image: '/image/GoTV.jpg',
    plans: [
      { id: 'gotv-smallie', label: 'Smallie', price: 1900, months: 1 },
      { id: 'gotv-jinja', label: 'Jinja', price: 3900, months: 1 },
      { id: 'gotv-jolli', label: 'Jolli', price: 5800, months: 1 },
      { id: 'gotv-max', label: 'Max', price: 8500, months: 1 },
      { id: 'gotv-supa', label: 'Supa', price: 11400, months: 1 },
    ],
  },
  {
    id: 'startimes',
    name: 'Startimes',
    image: '/image/Startimes.jpg',
    plans: [
      { id: 'startimes-nova', label: 'Nova', price: 1900, months: 1 },
      { id: 'startimes-basic', label: 'Basic', price: 3350, months: 1 },
      { id: 'startimes-smart', label: 'Smart', price: 4800, months: 1 },
      { id: 'startimes-classic', label: 'Classic', price: 5500, months: 1 },
      { id: 'startimes-super', label: 'Super', price: 8250, months: 1 },
    ],
  },
  {
    id: 'showmax',
    name: 'Showmax',
    image: '/image/Kwese.jpg',
    plans: [
      { id: 'showmax-mobile', label: 'Mobile', price: 3200, months: 1 },
      { id: 'showmax-standard', label: 'Standard', price: 6300, months: 1 },
    ],
  },
];

/* ----------------------------------------------------- Electricity (Discos) */
const DISCOS = [
  { id: 'ikedc', name: 'Ikeja Electric (IKEDC)', image: '/image/AEDC.jpg' },
  { id: 'ekedc', name: 'Eko Electric (EKEDC)', image: '/image/AEDC.jpg' },
  { id: 'aedc', name: 'Abuja Electric (AEDC)', image: '/image/AEDC.jpg' },
  { id: 'eedc', name: 'Enugu Electric (EEDC)', image: '/image/EEDC.jpg' },
  { id: 'ibedc', name: 'Ibadan Electric (IBEDC)', image: '/image/Kano Electric.jpg' },
  { id: 'jed', name: 'Jos Electric (JED)', image: '/image/Kano Electric.jpg' },
  { id: 'kaedco', name: 'Kaduna Electric (KAEDCO)', image: '/image/Kano Electric.jpg' },
  { id: 'kedco', name: 'Kano Electric (KEDCO)', image: '/image/Kano Electric.jpg' },
  { id: 'phed', name: 'Port Harcourt Electric (PHED)', image: '/image/AEDC.jpg' },
];
const METER_TYPES = [
  { id: 'prepaid', label: 'Prepaid' },
  { id: 'postpaid', label: 'Postpaid' },
];
const ELECTRICITY_MIN = 500;
const ELECTRICITY_MAX = 50000;

/* ----------------------------------------------------------------- Banks */
const BANKS = [
  { code: '044', name: 'Access Bank' },
  { code: '023', name: 'Citibank' },
  { code: '050', name: 'Ecobank' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank' },
  { code: '214', name: 'First City Monument Bank (FCMB)' },
  { code: '058', name: 'Guaranty Trust Bank (GTBank)' },
  { code: '030', name: 'Heritage Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '526', name: 'Moniepoint MFB' },
  { code: '076', name: 'Polaris Bank' },
  { code: '101', name: 'Providus Bank' },
  { code: '077', name: 'Stanbic IBTC Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '100', name: 'SunTrust Bank' },
  { code: '032', name: 'Union Bank' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '090', name: 'Kuda MFB' },
  { code: '090110', name: 'OPay Digital Services' },
  { code: '090267', name: 'Palmpay' },
];

/* --------------------------------------------------------------- Flights */
const AIRPORTS = [
  { code: 'LOS', city: 'Lagos', name: 'Murtala Muhammed Intl' },
  { code: 'ABV', city: 'Abuja', name: 'Nnamdi Azikiwe Intl' },
  { code: 'PHC', city: 'Port Harcourt', name: 'Port Harcourt Intl' },
  { code: 'KAN', city: 'Kano', name: 'Mallam Aminu Kano Intl' },
  { code: 'ENU', city: 'Enugu', name: 'Akanu Ibiam Intl' },
  { code: 'IBA', city: 'Ibadan', name: 'Ibadan Airport' },
  { code: 'BNI', city: 'Benin City', name: 'Benin Airport' },
  { code: 'CBQ', city: 'Calabar', name: 'Margaret Ekpo Intl' },
  { code: 'ACC', city: 'Accra', name: 'Kotoka Intl' },
  { code: 'LHR', city: 'London', name: 'Heathrow' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai Intl' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl' },
];

const AIRLINES = [
  { code: 'AIR', name: 'Air Peace', logo: null },
  { code: 'ARO', name: 'Arik Air', logo: null },
  { code: 'IBR', name: 'Ibom Air', logo: null },
  { code: 'DLH', name: 'Lufthansa', logo: null },
  { code: 'ETY', name: 'Ethiopian Airlines', logo: null },
  { code: 'RAQ', name: 'Qatar Airways', logo: null },
];

const FLIGHT_ROUTES = [
  { from: 'LOS', to: 'ABV', basePrice: 95000, duration: '1h 15m', distance: 'short' },
  { from: 'ABV', to: 'LOS', basePrice: 95000, duration: '1h 15m', distance: 'short' },
  { from: 'LOS', to: 'PHC', basePrice: 72000, duration: '1h 05m', distance: 'short' },
  { from: 'PHC', to: 'LOS', basePrice: 72000, duration: '1h 05m', distance: 'short' },
  { from: 'LOS', to: 'KAN', basePrice: 105000, duration: '1h 35m', distance: 'short' },
  { from: 'ABV', to: 'PHC', basePrice: 88000, duration: '1h 20m', distance: 'short' },
  { from: 'ABV', to: 'ENU', basePrice: 78000, duration: '1h 00m', distance: 'short' },
  { from: 'LOS', to: 'IBA', basePrice: 45000, duration: '45m', distance: 'short' },
  { from: 'LOS', to: 'BNI', basePrice: 68000, duration: '1h 00m', distance: 'short' },
  { from: 'ABV', to: 'CBQ', basePrice: 92000, duration: '1h 25m', distance: 'short' },
  { from: 'LOS', to: 'ACC', basePrice: 210000, duration: '1h 45m', distance: 'regional' },
  { from: 'LOS', to: 'LHR', basePrice: 1250000, duration: '6h 40m', distance: 'intl' },
  { from: 'ABV', to: 'LHR', basePrice: 1220000, duration: '6h 30m', distance: 'intl' },
  { from: 'LOS', to: 'DXB', basePrice: 980000, duration: '7h 15m', distance: 'intl' },
  { from: 'ABV', to: 'DXB', basePrice: 960000, duration: '6h 55m', distance: 'intl' },
  { from: 'LOS', to: 'JFK', basePrice: 1650000, duration: '12h 30m', distance: 'intl' },
];

/**
 * Deterministically expand routes into bookable flights (3 per route).
 * Prices vary mildly by weekday so different dates give different results.
 */
const buildFlights = () => {
  const flights = [];
  for (const route of FLIGHT_ROUTES) {
    const from = AIRPORTS.find((a) => a.code === route.from);
    const to = AIRPORTS.find((a) => a.code === route.to);
    const airlinePick = AIRLINES[(route.from.charCodeAt(0) + route.to.charCodeAt(1)) % AIRLINES.length];
    ['morning', 'afternoon', 'evening'].forEach((slot, i) => {
      const depart = ['07:30', '13:45', '18:20'][i];
      const flightId = `${route.from}-${route.to}-${slot}`;
      const variance = [1, 1.12, 0.94][i];
      flights.push({
        id: flightId,
        airline: airlinePick.name,
        airlineCode: airlinePick.code,
        flightNo: `${airlinePick.code}${100 + (flights.length * 7) % 800}`,
        from,
        to,
        departTime: depart,
        duration: route.duration,
        basePrice: Math.round((route.basePrice * variance) / 100) * 100,
        cabin: 'Economy',
        aircraft: route.distance === 'intl' ? 'Boeing 787-9' : 'Boeing 737-800',
        baggage: route.distance === 'intl' ? '2 x 23kg' : '1 x 23kg',
        seatsLeft: 6 + ((flights.length * 5) % 30),
      });
    });
  }
  return flights;
};

const FLIGHTS = buildFlights();

const CABIN_MULTIPLIER = { economy: 1, premium: 1.6, business: 2.4 };

module.exports = {
  NETWORKS,
  DATA_PLANS,
  AIRTIME_NETWORKS,
  AIRTIME_MIN,
  AIRTIME_MAX,
  TV_PROVIDERS,
  DISCOS,
  METER_TYPES,
  ELECTRICITY_MIN,
  ELECTRICITY_MAX,
  BANKS,
  AIRPORTS,
  AIRLINES,
  FLIGHTS,
  CABIN_MULTIPLIER,
};
