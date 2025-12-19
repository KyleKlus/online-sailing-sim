/**
 * @format
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: '/online-sailing-sim',
  output: 'export',
  images: { unoptimized: true, qualities: [100] },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
