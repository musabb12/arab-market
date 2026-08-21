export { getBrand, getCategory, getSeller, getBrands, getCategories, catName, updateCatalog } from './catalog.js'

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateLong(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

export function discountPercent(price, originalPrice) {
  if (!originalPrice) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function discountPrice(price, percent) {
  return Math.round(price * (1 - percent / 100))
}

export const LANGUAGES = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'ar', name: 'العربية', short: 'AR' },
  { code: 'es', name: 'Español', short: 'ES' },
  { code: 'fr', name: 'Français', short: 'FR' },
  { code: 'de', name: 'Deutsch', short: 'DE' },
  { code: 'zh', name: '中文', short: 'ZH' },
  { code: 'ja', name: '日本語', short: 'JA' },
  { code: 'ru', name: 'Русский', short: 'RU' },
  { code: 'tr', name: 'Türkçe', short: 'TR' },
  { code: 'hi', name: 'हिन्दी', short: 'HI' }
]

export const COUNTRIES = [
  'United States', 'United Arab Emirates', 'Saudi Arabia', 'United Kingdom', 'Germany',
  'France', 'Spain', 'Italy', 'Japan', 'China', 'India', 'Brazil', 'Turkey', 'Russia',
  'Canada', 'Australia', 'Mexico', 'Egypt', 'Morocco', 'South Korea', 'Singapore'
]
