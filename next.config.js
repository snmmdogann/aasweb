/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker (multi-stage) deployment için minimal standalone çıktı.
  output: 'standalone',
  reactStrictMode: true,
};

module.exports = nextConfig;
