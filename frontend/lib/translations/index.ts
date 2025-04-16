import en from './en';

export type TranslationKey = string;

interface Translations {
  [locale: string]: any;
}

const translations: Translations = {
  en,
};

let currentLocale = 'en';

export const setLocale = (locale: string) => {
  if (translations[locale]) {
    currentLocale = locale;
  }
};

export const getLocale = () => currentLocale;

export const t = (key: TranslationKey, params?: Record<string, string>) => {
  const keys = key.split('.');
  let translation: any = translations[currentLocale];
  
  for (const k of keys) {
    if (!translation[k]) {
      return key; // Fallback to key if translation not found
    }
    translation = translation[k];
  }
  
  if (typeof translation === 'string' && params) {
    return Object.entries(params).reduce(
      (result, [param, value]) => result.replace(`{{${param}}}`, value),
      translation
    );
  }
  
  return translation;
}; 