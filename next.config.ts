import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === '1' || process.env.NEXT_PUBLIC_VERCEL === '1';
const basePath = isVercel ? '' : (process.env.NEXT_PUBLIC_BASE_PATH ?? '/hsr-database');

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/Mar-7th/StarRailRes/**',
      },
      {
        protocol: 'https',
        hostname: 'static.nanoka.cc',
        pathname: '/assets/hsr/**',
      },
    ],
  },
};

export default nextConfig;
