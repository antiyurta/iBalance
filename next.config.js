/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
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
