const pwaConfig = {
  dest: "public",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ["picsum.photos", "i.imgur.com", "firebasestorage.googleapis.com"],
  },
};

const withPWA = require("next-pwa")(pwaConfig);
module.exports = withPWA(nextConfig);
