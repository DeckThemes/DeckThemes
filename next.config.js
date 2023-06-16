/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer");

const nextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    runtime: "experimental-edge",
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/HsU72Kfnpf",
        permanent: false,
      },
      {
        source: "/docs",
        destination: "https://docs.deckthemes.com",
        permanent: false,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "https",
        hostname: "**.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "**.discord.com",
      },
      {
        protocol: "https",
        hostname: "**.discord.gg",
      },
    ],
  },
};

// module.exports = withBundleAnalyzer(nextConfig);
module.exports = nextConfig;
