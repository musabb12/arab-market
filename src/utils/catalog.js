import { brands as defaultBrands, categories as defaultCategories } from '../data/categories.js'
import { sellers as defaultSellers } from '../data/products.js'

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

export function catName(c) {
  if (!c) return ''
  if (c.name) return c.name
  return (c.nameKey || '').replace('categories.', '').replace(/\./g, ' ')
}
