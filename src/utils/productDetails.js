/** Defaults and normalizers for rich product detail pages (sizes, fabric, colors, measurements). */

const SIZE_PRESETS = {
  women: ['XS', 'S', 'M', 'L', 'XL'],
  men: ['46', '48', '50', '52', '54', '56'],
  shoes: ['36', '37', '38', '39', '40', '41', '42', '43'],
  bags: ['One Size'],
  watches: ['One Size'],
  jewelry: ['One Size'],
  fragrance: ['50 ml', '100 ml', '200 ml'],
  beauty: ['30 ml', '50 ml', '100 ml'],
  accessories: ['One Size'],
  home: ['One Size'],
  tech: ['One Size'],
  leisure: ['S', 'M', 'L', 'XL'],
  supplements: ['250 g', '500 g', '1 kg'],
  art: ['One Size']
}

const FABRIC_HINTS = {
  women: 'Premium couture fabric',
  men: 'Fine wool / silk blend',
  shoes: 'Calf leather',
  bags: 'Full-grain leather',
  watches: 'Sapphire crystal & stainless steel',
  jewelry: '18k gold / certified gemstones',
  fragrance: 'Eau de parfum concentrate',
  beauty: 'Prestige formula',
  accessories: 'Fine leather / precious metal',
  home: 'Designer material',
  tech: 'Aerospace-grade materials',
  leisure: 'Technical performance fabric',
  supplements: 'Clinically tested ingredients',
  art: 'Museum-grade materials'
}

const MEASURE_PRESETS = {
  women: { length: '110–145 cm', bust: 'Made to measure', waist: 'Made to measure', hips: 'Made to measure' },
  men: { length: 'Jacket 72–78 cm', chest: 'Made to measure', waist: 'Made to measure', sleeve: '62–66 cm' },
  shoes: { length: 'Insole 23–28 cm', heel: 'As pictured', width: 'Standard' },
  bags: { length: 'As pictured', width: 'As pictured', depth: 'As pictured', strap: 'Adjustable' },
  watches: { length: 'Case 38–45 mm', thickness: '8–14 mm', strap: '18–22 mm' },
  jewelry: { length: 'As pictured', width: 'As pictured' },
  fragrance: { volume: '50–200 ml' },
  beauty: { volume: '30–100 ml' },
  accessories: { length: 'As pictured' },
  home: { dimensions: 'See specifications' },
  tech: { dimensions: 'See specifications' },
  leisure: { length: 'As pictured' },
  supplements: { netWeight: 'As labeled' },
  art: { dimensions: 'See certificate' }
}

const COLOR_NAMES = {
  '#b91c1c': 'Rouge',
  '#581c87': 'Amethyst',
  '#93c5fd': 'Sky',
  '#fbcfe8': 'Rose',
  '#111827': 'Noir',
  '#f8fafc': 'Ivory',
  '#1e3a8a': 'Navy',
  '#c2410c': 'Orange',
  '#ffffff': 'Blanc',
  '#000000': 'Noir'
}

export function defaultSizes(category) {
  return SIZE_PRESETS[category] || ['One Size']
}

export function defaultFabric(category, specs = []) {
  const fabricSpec = (specs || []).find((s) => /silk|wool|cashmere|leather|cotton|tulle|tweed|velvet|calf|canvas|titanium|gold/i.test(s))
  return fabricSpec || FABRIC_HINTS[category] || 'Premium materials'
}

export function defaultMeasurements(category) {
  return MEASURE_PRESETS[category] || { dimensions: 'See specifications' }
}

export function normalizeColorVariants(product) {
  if (Array.isArray(product.colorVariants) && product.colorVariants.length) {
    return product.colorVariants.map((c, i) => ({
      id: c.id || `c${i}`,
      name: c.name || COLOR_NAMES[c.hex] || c.hex || `Color ${i + 1}`,
      hex: c.hex || '#111827',
      images: c.images?.length ? c.images : [product.image, ...(product.images || [])].filter(Boolean)
    }))
  }
  const hexes = product.colors || []
  const baseImages = product.images?.length ? product.images : [product.image].filter(Boolean)
  if (!hexes.length) {
    return [{ id: 'default', name: 'Standard', hex: '#111827', images: baseImages }]
  }
  return hexes.map((hex, i) => ({
    id: `c${i}`,
    name: COLOR_NAMES[hex] || `Color ${i + 1}`,
    hex,
    // First color uses full gallery; others prefer later images when available
    images: i === 0 ? baseImages : [baseImages[Math.min(i, baseImages.length - 1)], ...baseImages.filter((_, idx) => idx !== Math.min(i, baseImages.length - 1))]
  }))
}

export function enrichProductDetails(product) {
  if (!product) return product
  return {
    ...product,
    sizes: product.sizes?.length ? product.sizes : defaultSizes(product.category),
    fabric: product.fabric || defaultFabric(product.category, product.specs),
    measurements: product.measurements || defaultMeasurements(product.category),
    colorVariants: normalizeColorVariants(product)
  }
}

/** Admin form: which controls to show for a category. */
export function getCategoryFormConfig(category) {
  const measureKeys = Object.keys(MEASURE_PRESETS[category] || { dimensions: '' })
  const showFabric = !['fragrance', 'beauty', 'supplements', 'tech', 'art'].includes(category)
  const showColors = !['fragrance', 'supplements'].includes(category)
  return {
    sizes: defaultSizes(category),
    fabricHint: FABRIC_HINTS[category] || 'Premium materials',
    measureKeys,
    showFabric,
    showColors,
    showVolume: ['fragrance', 'beauty', 'supplements'].includes(category)
  }
}

/** Translate known English preset phrases (sizes, fabric, measurements). */
export function localizePresetText(value, t) {
  if (!value || typeof t !== 'function') return value
  return t(`productDetails.phrases.${value}`, { defaultValue: value })
}

export function localizedFabric(category, t, specs) {
  const key = `productDetails.fabric.${category}`
  const translated = typeof t === 'function' ? t(key, { defaultValue: '' }) : ''
  return translated || defaultFabric(category, specs)
}

export function localizedMeasurements(category, t) {
  const base = defaultMeasurements(category)
  const out = {}
  for (const [k, v] of Object.entries(base)) {
    out[k] = localizePresetText(v, t)
  }
  return out
}

export function localizedSizes(category, t) {
  return defaultSizes(category).map((s) => localizePresetText(s, t))
}
