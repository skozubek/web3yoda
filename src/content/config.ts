// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const i18nCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // Navigation
    nav: z.object({
      home: z.string(),
      schedule: z.string(),
      twitter: z.string(),
    }),
    
    // Hero Section
    hero: z.object({
      title: z.string(),
      description: z.string(),
    }),
    
    // Services Section
    services: z.object({
      title: z.string(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })),
    }),
    
    // Discovery Call Section
    discovery: z.object({
      title: z.string(),
      description: z.string(),
      cta: z.object({
        text: z.string(),
        href: z.string(),
      }),
    }),
    
    // Benefits Section
    benefits: z.object({
      title: z.string(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
      })),
    }),

    // Footer
    footer: z.object({
      newsletter: z.object({
        title: z.string(),
        description: z.string(),
        placeholder: z.string(),
        button: z.string(),
      }),
      copyright: z.string(),
    }),
  }),
});

export const collections = {
  i18n: i18nCollection,
};