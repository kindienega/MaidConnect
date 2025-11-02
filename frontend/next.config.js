/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ngrok-free.app",
        port: "",
        pathname: "/images/properties/**",
      },
      {
        protocol: "https",
        hostname: "*.ngrok-free.app",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4001",
        pathname: "/images/properties/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4001",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3334",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tetertechs.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

