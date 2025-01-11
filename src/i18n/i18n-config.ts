// src/i18n/i18n-config.ts
export const languages = {
    en: 'English',
    pl: 'Polski'
  } as const;
  
  export const defaultLang = 'en';
  export const showDefaultLang = false;
  
  export type SupportedLanguages = keyof typeof languages;