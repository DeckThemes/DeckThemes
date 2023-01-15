/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/HsU72Kfnpf",
      },
      {
        source: "/docs",
        destination: "https://docs.deckthemes.com",
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

module.exports = nextConfig;
