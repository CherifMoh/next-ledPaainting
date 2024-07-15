/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.drawlys.com',
        port: '8444',
        pathname: '/images/**',
      },
      
    ],
  },
}

module.exports = nextConfig