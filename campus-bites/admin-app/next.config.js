/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'locknload-532f9.firebasestorage.app'],
  },
}

module.exports = nextConfig
