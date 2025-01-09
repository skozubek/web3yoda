// src/utils/i18n.ts
export const languages = {
    en: 'English',
    pl: 'Polski',
  } as const;
  
  export type Language = keyof typeof languages;
  export const defaultLanguage: Language = 'en';
  
  export function getLanguageFromPath(pathname: string): Language {
    const [, lang] = pathname.split('/');
    return lang in languages ? (lang as Language) : defaultLanguage;
  }