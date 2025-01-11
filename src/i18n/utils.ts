// src/i18n/utils.ts
import { getCollection } from 'astro:content';
import { languages, defaultLang, showDefaultLang, type SupportedLanguages } from './i18n-config';

let cachedUI: Record<string, any> | null = null;

export async function getUI(lang: SupportedLanguages = defaultLang) {
  if (!cachedUI) {
    const uiCollection = await getCollection('ui');
    cachedUI = Object.fromEntries(
      uiCollection.map(entry => [entry.id, entry.data])
    );
  }
  return cachedUI[lang] || cachedUI[defaultLang];
}

export function getLocaleFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as SupportedLanguages;
  return defaultLang;
}

export async function useTranslations(lang: SupportedLanguages) {
  const ui = await getUI(lang);
  return function t(key: string) {
    return key.split('.').reduce((obj, key) => obj?.[key], ui) || '';
  }
}

export function getLocalizedURL(currentPath: string, locale: string, defaultLang: string) {
  // Remove the current locale from the path if it exists
  const pathWithoutLocale = currentPath.replace(/^\/[^/]+\/?/, '');

  // Don't add locale prefix for default language
  if (locale === defaultLang) {
    return pathWithoutLocale || '/';
  }

  // Add the new locale prefix
  return `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`;
}

export { languages, defaultLang, showDefaultLang };