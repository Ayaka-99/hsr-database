import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/hsr-database',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/hsr-database',
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
    ],
  },
};

export default nextConfig;
