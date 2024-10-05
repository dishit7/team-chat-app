/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io'],
  },
  experimental: {
    serverSourceMaps: true,
  },
};

export default nextConfig;