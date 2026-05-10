/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000/api/v1',
    NEXT_PUBLIC_BLOG_API_URL: process.env.NEXT_PUBLIC_BLOG_API_URL || 'http://localhost:4000/api/v1',
    NEXT_PUBLIC_TRACKING_BASE_URL: 'https://africatelematics.com/api',
    NEXT_PUBLIC_TRACKING_LANG: 'en',
  },
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'api.tractrac.co'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compress: true,
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  generateEtags: false,
}

module.exports = withBundleAnalyzer(nextConfig)