// src/i18n/utils.ts
import { ui, defaultLang, languages } from './ui';

export function getLocaleFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function getLocalizedURL(currentPath: string, locale: string, defaultLocale: string) {
  // Remove the current locale from the path if it exists
  const pathWithoutLocale = currentPath.replace(/^\/[^/]+/, '');

  // Don't add locale prefix for default language
  if (locale === defaultLocale) {
    return pathWithoutLocale || '/';
  }

  // Add the new locale prefix
  return `/${locale}${pathWithoutLocale}`;
}

export function getTranslatedContent(collection: any[], locale: string) {
  return collection.find((entry) => entry.id.startsWith(locale))?.data
    ?? collection.find((entry) => entry.id.startsWith('en'))?.data;
}