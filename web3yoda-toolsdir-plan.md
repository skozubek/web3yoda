# Web3 Tools Directory Implementation Plan for web3yoda.xyz

## Phase 1: Content Structure Setup (Days 1-3)

### 1. Content Collections Setup
```bash
src/
  content/
    tools/
      config.ts      # Schema definition
      wallets/       # Organized by category
        unisat.mdx
        xverse.mdx
      marketplaces/
        gamma.mdx
        ordinals.mdx
```

### 2. Schema Definition
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    website: z.string().url(),
    github: z.string().url().optional(),
    category: z.enum(['wallets', 'marketplaces', 'defi']),
    status: z.enum(['active', 'beta', 'deprecated']),
    lastUpdated: z.date(),
    i18n: z.object({
      en: z.object({
        title: z.string(),
        description: z.string(),
        features: z.array(z.string()),
      }),
      pl: z.object({
        title: z.string(),
        description: z.string(),
        features: z.array(z.string()),
      })
    }),
    metadata: z.object({
      tags: z.array(z.string()),
      pricing: z.enum(['free', 'paid', 'hybrid']),
    }).optional()
  })
});

export const collections = { tools };
```

### 3. Add i18n UI Translations
```typescript
// src/i18n/ui.ts - Add new translations
export const ui = {
  en: {
    // ... existing translations ...
    'tools.title': 'Web3 Tools Directory',
    'tools.categories.wallets': 'Wallets',
    'tools.categories.marketplaces': 'Marketplaces',
    'tools.categories.defi': 'DeFi',
    'tools.status.active': 'Active',
    'tools.status.beta': 'Beta',
    'tools.status.deprecated': 'Deprecated',
    'tools.filters.all': 'All Tools',
    'tools.filters.category': 'Category',
    'tools.filters.status': 'Status',
  },
  pl: {
    // ... existing translations ...
    'tools.title': 'Katalog Narzędzi Web3',
    'tools.categories.wallets': 'Portfele',
    'tools.categories.marketplaces': 'Giełdy',
    'tools.categories.defi': 'DeFi',
    'tools.status.active': 'Aktywne',
    'tools.status.beta': 'Beta',
    'tools.status.deprecated': 'Przestarzałe',
    'tools.filters.all': 'Wszystkie Narzędzia',
    'tools.filters.category': 'Kategoria',
    'tools.filters.status': 'Status',
  }
} as const;
```

## Phase 2: Components Development (Days 4-6)

### 1. Tool Card Component
```typescript
// src/components/tools/ToolCard.tsx
import type { CollectionEntry } from 'astro:content';
import { useTranslations } from '../../i18n/utils';

interface Props {
  tool: CollectionEntry<'tools'>;
  lang: 'en' | 'pl';
}

export default function ToolCard({ tool, lang }: Props) {
  const t = useTranslations(lang);
  const localizedData = tool.data.i18n[lang];

  return (
    <div className="tool-card rounded-lg border p-4 hover:shadow-lg transition-all">
      <h3 className="text-xl font-bold">{localizedData.title}</h3>
      <p className="mt-2 text-gray-600">{localizedData.description}</p>
      <div className="mt-4 flex gap-2">
        <span className="badge">{t(`tools.categories.${tool.data.category}`)}</span>
        <span className="badge">{t(`tools.status.${tool.data.status}`)}</span>
      </div>
    </div>
  );
}
```

### 2. Tools Filter Component
```typescript
// src/components/tools/ToolsFilter.tsx
import { useState } from 'react';
import { useTranslations } from '../../i18n/utils';

export default function ToolsFilter({ 
  lang,
  onFilterChange 
}: {
  lang: 'en' | 'pl',
  onFilterChange: (filters: any) => void
}) {
  const t = useTranslations(lang);
  const [category, setCategory] = useState('all');
  
  return (
    <div className="filters flex gap-4 mb-8">
      <select 
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          onFilterChange({ category: e.target.value });
        }}
        className="select select-bordered"
      >
        <option value="all">{t('tools.filters.all')}</option>
        <option value="wallets">{t('tools.categories.wallets')}</option>
        <option value="marketplaces">{t('tools.categories.marketplaces')}</option>
        <option value="defi">{t('tools.categories.defi')}</option>
      </select>
    </div>
  );
}
```

## Phase 3: Pages Setup (Days 7-9)

### 1. Tools Directory Page
```astro
---
// src/pages/[lang]/tools/index.astro
import { getCollection } from 'astro:content';
import Layout from '../../../layouts/Layout.astro';
import ToolCard from '../../../components/tools/ToolCard';
import ToolsFilter from '../../../components/tools/ToolsFilter';
import { getLangFromUrl, useTranslations } from '../../../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const tools = await getCollection('tools');
---

<Layout title={t('tools.title')}>
  <h1 class="text-4xl font-bold mb-8">{t('tools.title')}</h1>
  
  <ToolsFilter lang={lang} client:load />
  
  <div class="tools-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {tools.map(tool => (
      <ToolCard tool={tool} lang={lang} />
    ))}
  </div>
</Layout>
```

### 2. Individual Tool Page
```astro
---
// src/pages/[lang]/tools/[...slug].astro
import { getCollection } from 'astro:content';
import Layout from '../../../layouts/Layout.astro';
import { getLangFromUrl, useTranslations } from '../../../i18n/utils';

export async function getStaticPaths() {
  const tools = await getCollection('tools');
  
  return tools.flatMap(tool => {
    return ['en', 'pl'].map(lang => ({
      params: { 
        lang,
        slug: tool.slug 
      },
      props: { tool }
    }));
  });
}

const { tool } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const localizedData = tool.data.i18n[lang];
---

<Layout title={localizedData.title}>
  <article class="tool-page max-w-4xl mx-auto">
    <h1>{localizedData.title}</h1>
    <div class="metadata">
      <!-- Tool metadata -->
    </div>
    <div class="content">
      <slot />
    </div>
  </article>
</Layout>
```

## Phase 4: Content Creation (Days 10-12)

### 1. Sample Tool Entry
```mdx
---
# src/content/tools/wallets/unisat.mdx
id: "unisat-wallet"
website: "https://unisat.io"
github: "https://github.com/unisat-wallet"
category: "wallets"
status: "active"
lastUpdated: 2024-01-11
i18n:
  en:
    title: "UniSat Wallet"
    description: "Browser extension wallet for Bitcoin, Ordinals, and BRC-20 tokens"
    features:
      - "BTC transactions"
      - "Ordinals support"
      - "BRC-20 token management"
  pl:
    title: "Portfel UniSat"
    description: "Portfel w formie rozszerzenia przeglądarki dla Bitcoin, Ordinals i tokenów BRC-20"
    features:
      - "Transakcje BTC"
      - "Wsparcie dla Ordinals"
      - "Zarządzanie tokenami BRC-20"
metadata:
  tags: ["bitcoin", "ordinals", "brc20"]
  pricing: "free"
---

## Overview

UniSat Wallet is a comprehensive Bitcoin wallet solution...
```

## Phase 5: Integration & Testing (Days 13-14)

### 1. Add Navigation
Update your existing navigation to include the tools directory:

```typescript
// src/components/Navigation.tsx
export default function Navigation({ lang }: { lang: 'en' | 'pl' }) {
  const t = useTranslations(lang);
  
  return (
    <nav>
      {/* Existing navigation items */}
      <a href={`/${lang}/tools`}>{t('tools.title')}</a>
    </nav>
  );
}
```

### 2. Testing Checklist
- [ ] Verify all routes work correctly
- [ ] Test language switching
- [ ] Validate content displays correctly
- [ ] Check responsive design
- [ ] Test filters functionality
- [ ] Verify metadata and SEO
- [ ] Test navigation and linking

## Next Steps
1. Implement search functionality
2. Add tool comparison features
3. Setup automated content updates
4. Add tool submission form
5. Implement analytics tracking
6. Add more interactive features

