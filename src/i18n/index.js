import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.js'
import ar from './locales/ar.js'
import es from './locales/es.js'
import fr from './locales/fr.js'
import de from './locales/de.js'
import zh from './locales/zh.js'
import ja from './locales/ja.js'
import ru from './locales/ru.js'
import tr from './locales/tr.js'
import hi from './locales/hi.js'
import ms from './locales/ms.js'

export const LANGUAGE_META = {
  en: { name: 'English', flag: 'EN', dir: 'ltr' },
  ar: { name: 'العربية', flag: 'AR', dir: 'rtl' },
  es: { name: 'Español', flag: 'ES', dir: 'ltr' },
  fr: { name: 'Français', flag: 'FR', dir: 'ltr' },
  de: { name: 'Deutsch', flag: 'DE', dir: 'ltr' },
  zh: { name: '中文', flag: 'ZH', dir: 'ltr' },
  ja: { name: '日本語', flag: 'JA', dir: 'ltr' },
  ru: { name: 'Русский', flag: 'RU', dir: 'ltr' },
  tr: { name: 'Türkçe', flag: 'TR', dir: 'ltr' },
  hi: { name: 'हिन्दी', flag: 'HI', dir: 'ltr' },
  ms: { name: 'Bahasa Melayu', flag: 'MS', dir: 'ltr' }
}

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  AED: { symbol: 'AED ', rate: 3.67 },
  SAR: { symbol: 'SAR ', rate: 3.75 },
  CNY: { symbol: '¥', rate: 7.2 },
  JPY: { symbol: '¥', rate: 155 },
  RUB: { symbol: '₽', rate: 92 },
  TRY: { symbol: '₺', rate: 34.5 },
  INR: { symbol: '₹', rate: 83.5 }
}

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  ja: { translation: ja },
  ru: { translation: ru },
  tr: { translation: tr },
  hi: { translation: hi },
  ms: { translation: ms }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: Object.keys(LANGUAGE_META),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'htmlTag'],
      caches: ['localStorage']
    }
  })

export default i18n
