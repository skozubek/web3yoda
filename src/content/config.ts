// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const homeCollection = defineCollection({
  type: 'data',
  schema: z.object({
    hero: z.object({
      title: z.string(),
      subtitle: z.string()
    }),
    consultations: z.object({
      title: z.string(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string()
      }))
    }),
    services: z.object({
      title: z.string(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string()
      }))
    }),
    discovery: z.object({
      title: z.string(),
      description: z.string(),
      cta: z.string()
    }),
    benefits: z.object({
      title: z.string(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string()
      }))
    })
  })
});

export const collections = {
  'home': homeCollection
};