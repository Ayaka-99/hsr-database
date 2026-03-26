import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/hsr-database',
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
