# SubHub247 web client

This is the Next.js frontend for the VTU project. Setup instructions, backend services, and live-provider integration notes are in the repository-root `README.md`.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Requires Node.js 20.9 or later. The app proxies `/api/*` through `API_PROXY_TARGET`; do not make browser code call a localhost API directly.
