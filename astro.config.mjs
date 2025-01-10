import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  site: 'https://web3yoda.xyz',
  integrations: [react(), tailwind()],
  adapter: node({
    mode: 'standalone'
  }),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pl'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 0,
        limitOutputPixels: 0,
        maximum: 30000,
      }
    }
  },
  vite: {
    envPrefix: [
      'PUBLIC_',
      'BEEHIIV_'
    ]
  },
  ssr: {
      noExternal: ['react', 'react-dom']
    },
    optimizeDeps: {
      include: ['react', 'react-dom']
    }
});