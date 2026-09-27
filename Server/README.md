# SubHub247 API

Express + MongoDB API for account authentication, wallet deposits/withdrawal requests, service orders, and flight requests. See the root `README.md` for setup and integration details.

```bash
cp .env.example .env
npm install
npm run dev
```

The development defaults are explicit simulations only. Real deposits require Paystack server credentials; live service delivery, automatic payouts, and ticket issuance need provider-specific integrations. Public registration cannot create administrators; provision one using `node scripts/createAdmin.js ...`.
