/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.5.107",
        port: "8000",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
