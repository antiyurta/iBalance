/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [process.env.NEXT_PUBLIC_HOST],
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_HOST,
        port: "8000",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
