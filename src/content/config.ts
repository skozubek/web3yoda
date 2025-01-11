// src/content/config.ts
import { defineCollection, reference, z } from 'astro:content';

// UI collection schema
const uiSchema = z.object({
  id: z.enum(['en', 'pl']),
  meta: z.object({
    description: z.string(),
  }),
  nav: z.object({
    schedule: z.string(),
    twitter: z.string(),
  }),
  newsletter: z.object({
    title: z.string(),
    description: z.string(),
    placeholder: z.string(),
    button: z.string(),
    toast: z.object({
      success: z.string(),
      error: z.object({
        invalid: z.string(),
        failed: z.string(),
        server: z.string(),
        general: z.string(),
      }),
    }),
  }),
  tools: z.object({
    title: z.string(),
    categories: z.record(z.string()),
    ecosystems: z.record(z.string()),
    status: z.record(z.string()),
    filters: z.record(z.string()),
    pricing: z.record(z.string()),
  }),
  footer: z.object({
    description: z.string(),
  }),
  copyright: z.string(),
});

// Home collection schema
const homeSchema = z.object({
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
});

// Tool category schema
const categorySchema = z.enum([
  'wallets',           // Cryptocurrency & NFT wallets
  'marketplaces',      // NFT & token marketplaces
  'defi',             // DeFi protocols & tools
  'analytics',        // Market analysis & tracking
  'security',         // Security & audit tools
  'infrastructure',   // Node providers, RPCs, indexers
  'development',      // Dev tools, SDKs, frameworks
  'identity',         // DIDs, authentication, verification
  'governance',       // DAOs, voting, delegation
  'social',           // Web3 social platforms
  'storage',          // Decentralized storage solutions
  'gaming',           // Web3 gaming platforms & tools
  'oracles',          // Price feeds, data oracles, VRF
  'bridges',          // Cross-chain bridges & liquidity networks
  'data',             // On-chain data, indexing, APIs
  'other'             // Miscellaneous tools
]);

// Tool status schema
const statusSchema = z.enum(['active', 'beta', 'deprecated']);

// Tool pricing schema
const pricingSchema = z.enum(['free', 'paid', 'hybrid', 'contact']);

// Blockchain ecosystem schema
const ecosystemSchema = z.array(z.enum([
  'bitcoin',    // BTC, Ordinals, Lightning, etc.
  'ethereum',   // ETH, EVM chains
  'solana',     // SOL ecosystem
  'cardano',    // ADA ecosystem
  'polkadot',   // DOT ecosystem
  'cosmos',     // ATOM, IBC chains
  'multichain', // Cross-chain solutions
  'other'       // Other blockchains
])).min(1);

// Schema for multilingual tool descriptions
// Defines how each tool's content should be structured in different languages
const toolTranslationsSchema = z.record(z.enum(['en', 'pl']), z.object({
  title: z.string(),       // Tool name in given language
  description: z.string(), // Tool description in given language
  features: z.array(z.string()), // List of tool features in given language
}));

// Tool collection schema
const toolsSchema = z.object({
  id: z.string(),
  ecosystems: ecosystemSchema,
  website: z.string().url(),
  github: z.string().url().optional(),
  category: categorySchema,
  status: statusSchema,
  lastUpdated: z.date(),
  i18n: toolTranslationsSchema, // Multilingual content for this tool
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

const home = defineCollection({
  type: 'data',
  schema: homeSchema,
});

const ui = defineCollection({
  type: 'data',
  schema: uiSchema,
});

// Export the collections
export const collections = {
  tools,
  home,
  ui,
};

// Export type helpers
export type ToolFrontmatter = z.infer<typeof toolsSchema>;
export type ToolCategory = z.infer<typeof categorySchema>;
export type ToolStatus = z.infer<typeof statusSchema>;
export type ToolPricing = z.infer<typeof pricingSchema>;
export type ToolTranslations = z.infer<typeof toolTranslationsSchema>;