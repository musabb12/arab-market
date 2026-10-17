import { brands as defaultBrands, categories as defaultCategories, subcategoryImage } from '../data/categories.js'
import { sellers as defaultSellers } from '../data/products.js'

export { subcategoryImage }

let registry = {
  brands: defaultBrands,
  categories: defaultCategories,
  sellers: defaultSellers
}

export function updateCatalog(data) {
  if (data.brands) registry.brands = data.brands
  if (data.categories) registry.categories = data.categories
  if (data.sellers) registry.sellers = data.sellers
}

export function getBrand(id) {
  return registry.brands.find((b) => b.id === id) || registry.brands[0] || defaultBrands[0]
}

export function getCategory(id) {
  return registry.categories.find((c) => c.id === id) || registry.categories[0] || defaultCategories[0]
}

export function getSeller(id) {
  return registry.sellers.find((s) => s.id === id) || registry.sellers[0] || defaultSellers[0]
}

export function getBrands() {
  return registry.brands
}

export function getCategories() {
  return registry.categories
}

export function subcategoryLabel(t, label) {
  return t(`subcategories.${label}`, { defaultValue: label })
}

export function catName(c, t) {
  if (!c) return ''
  if (typeof t === 'function' && c.nameKey) {
    return t(c.nameKey, { defaultValue: c.name || c.id || '' })
  }
  if (c.name && c.name !== c.id) return c.name
  if (c.nameKey) return c.nameKey.split('.').pop() || c.id || ''
  return c.name || c.id || ''
}

export function brandLabel(brandOrId, t) {
  const b = typeof brandOrId === 'string' ? getBrand(brandOrId) : brandOrId
  if (!b) return ''
  if (typeof t === 'function') return t(`brands.${b.id}`, { defaultValue: b.name })
  return b.name
}

export function sellerLabel(sellerOrId, t) {
  const s = typeof sellerOrId === 'string' ? getSeller(sellerOrId) : sellerOrId
  if (!s) return ''
  if (typeof t === 'function') return t(`sellers.${s.id}`, { defaultValue: s.name })
  return s.name
}
