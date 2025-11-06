/** @type {import('next').NextConfig} */
// const withPlugins = require("next-compose-plugins");
// const withSvgr = require("next-plugin-svgr");

const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyBWo_tQ4rjQkZz1kN5WXfnemHCaF0gQ8BU',
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000/api/v1',
    NEXT_PUBLIC_TRACKING_BASE_URL: 'https://africatelematics.com/api',
    NEXT_PUBLIC_TRACKING_LANG: 'en',
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