/** @type {import('next').NextConfig} */
// const withPlugins = require("next-compose-plugins");
// const withSvgr = require("next-plugin-svgr");

const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000/api/v1',
  },
  compiler: {
      // ssr and displayName are configured by default
      styledComponents: true,
  },
  typescript: {
      // This will ignore TypeScript errors during the build process
      ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig