/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...(config.optimization.splitChunks ?? {}),
        minSize: 102400,
        maxInitialRequests: 3,
        maxAsyncRequests: 3
      };
    }

    return config;
  }
};

export default nextConfig;
