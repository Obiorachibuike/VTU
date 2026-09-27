/** @type {import('next').NextConfig} */
const backend = process.env.API_PROXY_TARGET || 'http://127.0.0.1:5000';
const nextConfig = {
  allowedDevOrigins: ['*.e2b.app'],
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
};

module.exports = nextConfig;
