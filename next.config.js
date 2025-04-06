/** @type {import('next').NextConfig} */
// const withPlugins = require("next-compose-plugins");
// const withSvgr = require("next-plugin-svgr");

const nextConfig = {
    compiler: {
        // ssr and displayName are configured by default
        styledComponents: true,
      },
}

module.exports = nextConfig
