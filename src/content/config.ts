// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const home = defineCollection({
  type: 'data',
  schema: z.object({
    hero: z.object({
      title: z.string(),
      subtitle: z.string()
    }),
    services: z.array(z.object({
      title: z.string(),
      description: z.string()
    })),
    benefits: z.array(z.object({
      title: z.string(),
      description: z.string()
    }))
  })
});

export const collections = {
  home
};