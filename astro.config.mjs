// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  trailingSlash: 'never',
  site: 'https://web3yoda.xyz',
  integrations: [
    react(),
    tailwind(),
    mdx(),
    sitemap({
    filter: (page) => {
      // Exclude debug-related routes from the sitemap
      return !page.includes('/debug-routes') && !page.endsWith('/debug');
    }
  })],
  adapter: vercel({
    analytics: true, // Enable Vercel Analytics
    imageService: true,
    excludeFiles: ['**/debug-routes/**'],
    devMode: false
  }),

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pl'],
    routes: {
      pl: {
        prefix: 'pl'
      }
    },
    routing: {
      prefixDefaultLocale: false
    }
  },
  compilerOptions: {
    "types": ["astro/client"]
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
    },
  domains: [],
  remotePatterns: []
});