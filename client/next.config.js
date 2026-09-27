/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API calls to the backend so the browser always talks to its own
  // origin (no CORS, works in any deployment). Override the target with the
  // SERVER_URL env var when the API runs on another host.
  async rewrites() {
    const target = process.env.SERVER_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
