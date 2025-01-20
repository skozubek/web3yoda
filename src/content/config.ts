// src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { type SupportedLanguages, languages } from '../i18n/i18n-config';


// Create enum values from languages object keys
const languageValues = Object.keys(languages) as [SupportedLanguages, ...SupportedLanguages[]];

// UI collection schema with dynamic language support
const uiSchema = z.object({
  id: z.enum(languageValues),
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
    description: z.string(),
    website: z.string(),
    key_features: z.string(),
    last_updated: z.string(),
    categories: z.record(z.string()),
    ecosystems: z.record(z.string()),
    status: z.record(z.string()),
    filters: z.record(z.string()),
    pricing: z.record(z.string()),
    metrics: z.object({
      sectionTitle: z.string(),
      description: z.string(),
      followers: z.string(),
      monthly: z.object({
        tweets: z.string(),
        engagement: z.string(),
        growth: z.string()
      }),
      weekly: z.object({
        tweets: z.string(),
        growth: z.string()
      }),
      lastUpdate: z.string(),
      lastTweet: z.string()
    })
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

/**
 * X/Twitter Metrics Schema
 * Focuses on recent activity and engagement
 */
const xMetricsSchema = z.object({
  handle: z.string(),
  // Current follower count
  followers: z.number(),

  // Last 30 days activity
  monthlyStats: z.object({
    tweets: z.number(),          // tweets in last 30 days
    avgLikes: z.number(),        // average likes per tweet
    avgRetweets: z.number(),     // average retweets per tweet
    avgQuotes: z.number(),       // average quotes per tweet
    followersGrowth: z.number(), // percentage growth
  }),

  // Last 7 days for more immediate trends
  weeklyStats: z.object({
    tweets: z.number(),          // tweets in last 7 days
    followersGrowth: z.number(), // percentage growth
  }),

  lastTweetDate: z.date(),
  lastMetricsUpdate: z.date(),
}).optional();

/**
 * Core categories for Web3 tools
 */
const categorySchema = z.enum([
  'wallets',         // Crypto wallets, key management
  'marketplaces',    // NFT and token marketplaces
  'defi',           // DeFi protocols and tools
  'infrastructure', // RPCs, nodes, indexers
  'security',       // Security tools, audit tools
  'analytics',      // Data analytics, market tracking
  'other'          // Catch-all for edge cases
]);

/**
 * Tool status indicators
 */
const statusSchema = z.enum([
  'active',     // Tool is actively maintained
  'beta',       // Tool is in testing phase
  'deprecated'  // Tool is no longer maintained
]);

/**
 * Supported blockchain ecosystems
 */
const ecosystemSchema = z.array(z.enum([
  'bitcoin',    // BTC, Ordinals, Lightning
  'ethereum',   // ETH, EVM chains
  'solana',     // SOL ecosystem
  'multichain', // Cross-chain solutions
  'other'       // Other blockchains
])).min(1);

/**
 * Schema for multilingual tool content
 */
const toolTranslationsSchema = z.record(
  z.custom<SupportedLanguages>(),
  z.object({
    title: z.string(),
    description: z.string(),
    features: z.array(z.string()),
    sections: z.array(z.object({
      title: z.string(),
      content: z.string()
    })),
    keyFeatures: z.array(z.object({
      title: z.string(),
      items: z.array(z.string())
    }))
  })
);

/**
 * Main tool schema
 * Combines metadata with translations and X metrics
 */
const toolSchema = z.object({
  id: z.string(),
  logo: z.string().optional(),
  screenshot: z.string().optional(),
  website: z.string().url(),
  github: z.string().url().optional(),
  social: z.object({
    x: z.string().url().optional(),
    discord: z.string().url().optional(),
    telegram: z.string().url().optional(),
  }).optional(),
  category: categorySchema,
  ecosystems: ecosystemSchema,
  status: statusSchema,
  lastUpdated: z.date(),
  xMetrics: xMetricsSchema,
  i18n: toolTranslationsSchema,
  metadata: z.object({
    tags: z.array(z.string()),
    pricing: z.enum(['free', 'paid', 'hybrid'])
  }).optional()
});

// Collections Configuration
const tools = defineCollection({
  schema: ({ image }) => z.object({
    id: z.string(),
    logo: image(),
    cscreenshot: z.string().optional(),
    website: z.string().url(),
    github: z.string().url().optional(),
    social: z.object({
      x: z.string().url().optional(),
      discord: z.string().url().optional(),
      telegram: z.string().url().optional(),
    }).optional(),
    category: categorySchema,
    ecosystems: ecosystemSchema,
    status: statusSchema,
    lastUpdated: z.date(),
    xMetrics: xMetricsSchema,
    i18n: toolTranslationsSchema,
    metadata: z.object({
      tags: z.array(z.string()),
      pricing: z.enum(['free', 'paid', 'hybrid'])
    }).optional()
  }),

  loader: glob({
    pattern: "tools/**/**.mdx",
    base: "./src/content"
  })
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
export const collections = { tools, home, ui };

// Export type helpers
export type Tool = z.infer<typeof toolSchema>;
export type XMetrics = z.infer<typeof xMetricsSchema>;
export type ToolCategory = z.infer<typeof categorySchema>;
export type ToolStatus = z.infer<typeof statusSchema>;
export type ToolEcosystem = z.infer<typeof ecosystemSchema>[number];