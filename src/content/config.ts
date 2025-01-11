// src/content/config.ts
import { defineCollection, reference, z } from 'astro:content';
import { languages } from '../i18n/ui';

// Define type for supported languages
type Lang = keyof typeof languages;

// Tool category schema
const categorySchema = z.enum(['wallets', 'marketplaces', 'defi', 'analytics', 'security']);

// Status schema
const statusSchema = z.enum(['active', 'beta', 'deprecated']);

// Pricing schema
const pricingSchema = z.enum(['free', 'paid', 'hybrid', 'contact']);

// Base localized content schema
const localizedContentSchema = z.record(z.enum(['en', 'pl']), z.object({
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
}));

// Tool collection schema
const toolsSchema = z.object({
  id: z.string(),
  website: z.string().url(),
  github: z.string().url().optional(),
  category: categorySchema,
  status: statusSchema,
  lastUpdated: z.date(),
  // Using record type for i18n to ensure all languages are covered
  i18n: localizedContentSchema,
  metadata: z.object({
    tags: z.array(z.string()),
    pricing: pricingSchema,
    relatedTools: z.array(reference('tools')).optional(),
  }).optional(),
});

// Define the collections
const tools = defineCollection({
  type: 'content',
  schema: toolsSchema,
});

// Export the collections
export const collections = {
  tools,
};

// Export type helpers
export type ToolFrontmatter = z.infer<typeof toolsSchema>;
export type ToolCategory = z.infer<typeof categorySchema>;
export type ToolStatus = z.infer<typeof statusSchema>;
export type ToolPricing = z.infer<typeof pricingSchema>;
export type LocalizedContent = z.infer<typeof localizedContentSchema>;