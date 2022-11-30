/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: "http://localhost:5102",
  },
  images: {
    remotePatterns: [
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
