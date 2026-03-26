/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Solo aplicamos esta optimización al código que se envía al navegador (cliente)
    if (!isServer) {
      config.optimization.splitChunks = {
        // Mantenemos cualquier configuración previa que Next.js necesite
        ...(config.optimization.splitChunks || {}),

        // Aumenta el tamaño mínimo para generar un archivo separado (ej. 100KB)
        minSize: 102400,

        // Fuerzan a Webpack a agrupar el código en menos archivos limitando las peticiones
        maxInitialRequests: 3,
        maxAsyncRequests: 3
      };
    }

    return config;
  }
};

export default nextConfig;
