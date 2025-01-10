import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://web3yoda.xyz', // Production domain
  integrations: [react(), tailwind()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pl'],
    // No prefix for default locale, prefix for others
    routing: {
      prefixDefaultLocale: false
    }
  },
  image: {
    // New image service configuration
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 0,
        limitOutputPixels: 0,
        maximum: 30000,
      }
    }
  }
});