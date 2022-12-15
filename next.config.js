/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // env: {
  //   NEXT_PUBLIC_API_URL: "http://localhost:1337",
  //   NEXT_PUBLIC_CLIENT_URL: "http://localhost:3000",
  // },
  images: {
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
