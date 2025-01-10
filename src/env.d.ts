/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare module 'astro:content' {
  interface ContentCollectionConfig {
    home: {
      type: 'data';
      schema: z.ZodObject<{
        hero: z.ZodObject<{
          title: z.ZodString;
          subtitle: z.ZodString;
        }>;
        services: z.ZodArray<z.ZodObject<{
          title: z.ZodString;
          description: z.ZodString;
        }>>;
        benefits: z.ZodArray<z.ZodObject<{
          title: z.ZodString;
          description: z.ZodString;
        }>>;
      }>;
    };
  }
}
interface ImportMetaEnv {
    readonly BEEHIIV_API_KEY: string;
    readonly BEEHIIV_PUBLICATION_ID: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }