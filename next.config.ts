import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['flags', '@flags-sdk/vercel'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
        port: '',
        pathname: '/apod/image/**',
      },
    ],
  },
};

export default nextConfig;
