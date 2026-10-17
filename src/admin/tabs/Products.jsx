import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Modal, Field, TextInput, Select, Textarea, Toggle, Badge, SearchInput, Empty, AdminCardGrid, AdminEntityCard, AdminIconButton } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { getBrand, getCategory, catName, brandLabel, sellerLabel, subcategoryLabel } from '../../utils/helpers.js'
import {
  getCategoryFormConfig,
  localizePresetText,
  localizedFabric,
  localizedMeasurements,
  localizedSizes
} from '../../utils/productDetails.js'

const BADGES = ['flashSale', 'featured', 'bestSeller', 'newArrival', 'rare']

const COLOR_PRESETS = ['#111827', '#f8fafc', '#b91c1c', '#1e3a8a', '#c2410c', '#581c87', '#fbcfe8', '#93c5fd', '#854d0e', '#065f46']

const emptyForm = (t) => {
  const cat = 'bags'
  return {
    name: '',
    price: 0,
    originalPrice: 0,
    stock: 100,
    rating: 4.5,
    reviews: 0,
    category: cat,
    subcategory: '',
    brand: 'hermes',
    sellerId: 's1',
    image: '',
    gallery: [],
    badges: [],
    description: '',
    specsText: '',
    colors: ['#111827'],
    sizes: localizedSizes(cat, t),
    fabric: localizedFabric(cat, t),
    measurements: localizedMeasurements(cat, t),
    flashPercent: '',
    sku: '',
    active: true,
    limitedEdition: false,
    freeShipping: false
  }
}

function normalizeInitial(initial, t) {
  if (!initial) return emptyForm(t)
  const cat = initial.category || 'bags'
  const images = Array.isArray(initial.images) ? initial.images : []
  return {
    ...emptyForm(t),
    ...initial,
    subcategory: initial.subcategory || '',
    gallery: images.filter((u) => u && u !== initial.image),
    specsText: Array.isArray(initial.specs) ? initial.specs.join('\n') : (initial.specs || ''),
    colors: Array.isArray(initial.colors) && initial.colors.length ? initial.colors : ['#111827'],
    sizes: Array.isArray(initial.sizes) && initial.sizes.length
      ? initial.sizes.map((s) => localizePresetText(s, t))
      : localizedSizes(cat, t),
    fabric: initial.fabric
      ? localizePresetText(initial.fabric, t)
      : localizedFabric(cat, t, initial.specs),
    measurements: initial.measurements && Object.keys(initial.measurements).length
      ? Object.fromEntries(Object.entries(initial.measurements).map(([k, v]) => [k, localizePresetText(v, t)]))
      : localizedMeasurements(cat, t),
    flashPercent: initial.flashPercent ?? '',
    sku: initial.sku || '',
    limitedEdition: Boolean(initial.limitedEdition || initial.badges?.includes('rare')),
    freeShipping: Boolean(initial.freeShipping),
    badges: Array.isArray(initial.badges) ? [...initial.badges] : []
  }
}

export default function Products() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast, refreshCatalog, formatPrice } = useStore()
  const { products, categories, brands, sellers } = siteData
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [onlyActive, setOnlyActive] = useState(false)
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)

  const list = useMemo(() => {
    let l = [...products]
    if (cat !== 'all') l = l.filter((p) => p.category === cat)
    if (q) l = l.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase()))
    if (onlyActive) l = l.filter((p) => p.active !== false)
    return l
  }, [products, q, cat, onlyActive])

  const save = async (form) => {
    try {
      const { api } = await import('../../api/client.js')
      if (editing) {
        const { product } = await api.adminUpdateProduct(editing.id, form)
        updateSite((prev) => ({
          ...prev,
          products: prev.products.map((p) => (p.id === editing.id ? { ...p, ...product, ...form } : p))
        }))
        toast(t('admin.common.saved'))
      } else {
        const { product } = await api.adminCreateProduct(form)
        updateSite((prev) => ({ ...prev, products: [{ ...product, stockBase: form.stock }, ...prev.products] }))
        toast(t('admin.common.saved'))
      }
      setOpen(false)
      await refreshCatalog()
    } catch (err) {
      toast(err.message || t('admin.common.save'), 'error')
    }
  }

  const remove = async (id) => {
    try {
      const { api } = await import('../../api/client.js')
      await api.adminDeleteProduct(id)
      updateSite((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }))
      toast(t('admin.common.delete'), 'info')
      await refreshCatalog()
    } catch (err) {
      toast(err.message || t('admin.common.delete'), 'error')
    }
  }

  const toggleActive = async (p) => {
    try {
      const { api } = await import('../../api/client.js')
      const active = p.active === false
      const { product } = await api.adminUpdateProduct(p.id, { active })
      updateSite((prev) => ({ ...prev, products: prev.products.map((x) => (x.id === p.id ? { ...x, ...product } : x)) }))
    } catch (err) {
      toast(err.message || t('admin.common.save'), 'error')
    }
  }

  return (
    <div>
      <SectionTitle
        title={t('admin.products.title')}
        subtitle={t('admin.products.subtitle', { shown: list.length, total: products.length })}
        actions={<Button onClick={() => { setEditing(null); setOpen(true) }}><Icon name="plus" size={15} /> {t('admin.products.add')}</Button>}
      />

      <Card className="mb-5">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <SearchInput value={q} onChange={setQ} placeholder={t('admin.products.search')} />
          </div>
          <Select value={cat} onChange={(e) => setCat(e.target.value)} options={[{ value: 'all', label: t('admin.common.all') }, ...categories.map((c) => ({ value: c.id, label: catName(c, t) }))]} />
          <div className="flex items-center gap-3 px-2">
            <Toggle checked={onlyActive} onChange={setOnlyActive} />
            <span className="text-sm font-medium text-slate-600">{t('admin.products.activeOnly')}</span>
          </div>
        </div>
      </Card>

      {list.length === 0 ? (
        <Card>
          <Empty icon="box" title={t('admin.products.empty')} subtitle={t('admin.products.emptySub')} />
        </Card>
      ) : (
        <AdminCardGrid>
          {list.map((p) => (
            <AdminEntityCard
              key={p.id}
              image={p.image}
              imageAlt={p.name}
              title={p.name}
              subtitle={p.id}
              topBadges={[
                { label: p.active !== false ? t('admin.common.active') : t('admin.common.inactive'), tone: p.active !== false ? 'green' : 'gray' },
                { label: p.stock <= 0 ? '0' : String(p.stock), tone: p.stock <= 0 ? 'red' : p.stock < 50 ? 'amber' : 'blue' }
              ]}
              meta={[
                { label: t('admin.common.price'), value: formatPrice(p.price) },
                { label: t('admin.common.stock'), value: p.stock },
                { label: t('admin.common.category'), value: catName(getCategory(p.category), t) },
                { label: t('admin.common.brand'), value: brandLabel(p.brand, t) }
              ]}
              footer={
                <>
                  <div className="flex flex-wrap gap-1">
                    {(p.badges || []).slice(0, 2).map((b) => (
                      <Badge key={b} tone="purple" className="text-[10px]">{t(`admin.products.badgeLabels.${b}`, { defaultValue: b })}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <AdminIconButton icon={p.active !== false ? 'eye' : 'lock'} title={t('admin.products.toggleActive')} onClick={() => toggleActive(p)} />
                    <AdminIconButton icon="edit" title={t('admin.common.edit')} onClick={() => { setEditing(p); setOpen(true) }} />
                    <AdminIconButton icon="trash" title={t('admin.common.delete')} variant="danger" onClick={() => remove(p.id)} />
                  </div>
                </>
              }
            />
          ))}
        </AdminCardGrid>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? t('admin.products.edit', { name: editing.name }) : t('admin.products.add')}
        width="max-w-5xl"
      >
        <ProductForm
          key={editing?.id || 'new'}
          initial={editing}
          categories={categories}
          brands={brands}
          sellers={sellers}
          onSave={save}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </div>
  )
}

function Section({ icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-midnight-900 text-white">
          <Icon name={icon} size={18} />
        </span>
        <div>
          <h4 className="font-display text-sm font-bold text-midnight-900">{title}</h4>
          {subtitle && <p className="text-xs font-medium text-slate-600 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
        active
          ? 'bg-midnight-900 border-midnight-900 text-white shadow-sm'
          : 'bg-white border-slate-200 text-slate-600 hover:border-midnight-900/40'
      }`}
    >
      {children}
    </button>
  )
}

function ProductForm({ initial, categories, brands, sellers, onSave, onCancel }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(() => normalizeInitial(initial, t))
  const [customSize, setCustomSize] = useState('')
  const [customColor, setCustomColor] = useState('#e04418')

  const categoryMeta = categories.find((c) => c.id === form.category)
  const config = useMemo(() => getCategoryFormConfig(form.category), [form.category])
  const subOptions = categoryMeta?.subcategories || []
  const sizeChoices = useMemo(
    () => [...new Set([...localizedSizes(form.category, t), ...form.sizes])],
    [form.category, form.sizes, t]
  )

  const patch = (partial) => setForm((f) => ({ ...f, ...partial }))

  const applyCategoryDefaults = (categoryId, keepCustom = false) => {
    const nextConfig = getCategoryFormConfig(categoryId)
    setForm((f) => ({
      ...f,
      category: categoryId,
      subcategory: keepCustom && (categories.find((c) => c.id === categoryId)?.subcategories || []).includes(f.subcategory)
        ? f.subcategory
        : '',
      sizes: keepCustom && f.sizes?.length ? f.sizes : localizedSizes(categoryId, t),
      fabric: keepCustom && f.fabric ? f.fabric : localizedFabric(categoryId, t),
      measurements: keepCustom && f.measurements && Object.keys(f.measurements).length
        ? f.measurements
        : localizedMeasurements(categoryId, t),
      colors: nextConfig.showColors ? (f.colors?.length ? f.colors : ['#111827']) : []
    }))
  }

  useEffect(() => {
    if (!initial && subOptions[0] && !form.subcategory) {
      patch({ subcategory: subOptions[0] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.category])

  const toggleBadge = (b) => setForm((f) => ({
    ...f,
    badges: f.badges.includes(b) ? f.badges.filter((x) => x !== b) : [...f.badges, b]
  }))

  const toggleSize = (size) => setForm((f) => ({
    ...f,
    sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size]
  }))

  const toggleColor = (hex) => setForm((f) => ({
    ...f,
    colors: f.colors.includes(hex) ? f.colors.filter((c) => c !== hex) : [...f.colors, hex]
  }))

  const submit = (e) => {
    e.preventDefault()
    const gallery = Array.isArray(form.gallery) ? form.gallery.filter(Boolean) : []
    const images = [form.image, ...gallery].filter(Boolean)
    const uniqueImages = [...new Set(images)]
    const specs = form.specsText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (form.subcategory && !specs.includes(form.subcategory)) specs.unshift(form.subcategory)
    if (form.sku) specs.push(`${t('admin.products.sku')}: ${form.sku}`)
    if (form.freeShipping) specs.push(t('admin.products.freeShipping'))

    let badges = [...form.badges]
    if (form.limitedEdition && !badges.includes('rare')) badges.push('rare')
    if (!form.limitedEdition) badges = badges.filter((b) => b !== 'rare')

    const swatches = config.showColors ? form.colors : []
    const colorVariants = swatches.map((hex, i) => ({
      id: `c${i}`,
      name: hex,
      hex,
      images: uniqueImages
    }))

    const payload = {
      name: form.name,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || 0,
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      category: form.category,
      subcategory: form.subcategory || '',
      brand: form.brand,
      sellerId: form.sellerId,
      image: form.image || uniqueImages[0] || '',
      images: uniqueImages,
      badges,
      description: form.description,
      specs,
      sizes: form.sizes,
      fabric: config.showFabric ? form.fabric : '',
      measurements: form.measurements,
      colors: swatches,
      colorVariants,
      colorsMeta: {
        swatches,
        variants: colorVariants,
        sizes: form.sizes,
        fabric: config.showFabric ? form.fabric : '',
        measurements: form.measurements,
        subcategory: form.subcategory || ''
      },
      flashPercent: form.flashPercent === '' || form.flashPercent == null ? null : Number(form.flashPercent),
      active: form.active !== false,
      freeShipping: form.freeShipping,
      limitedEdition: form.limitedEdition
    }
    onSave(payload)
  }

  const previewImg = form.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Preview hero */}
      <div className="relative overflow-hidden rounded-2xl bg-midnight-950 text-white">
        <div className="absolute inset-0 opacity-40">
          <img src={previewImg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-midnight-950 via-midnight-950/85 to-transparent" />
        <div className="relative flex flex-col sm:flex-row gap-4 p-5 md:p-6">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/20 bg-white/10">
            <img src={previewImg} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-amber-300 mb-1">
              {catName(categoryMeta, t) || form.category}
              {form.subcategory ? ` · ${subcategoryLabel(t, form.subcategory)}` : ''}
            </p>
            <h3 className="font-display text-xl md:text-2xl font-bold truncate">
              {form.name || t('admin.products.productName')}
            </h3>
            <p className="mt-2 text-sm text-white/70 line-clamp-2">{form.description || t('admin.products.formHint')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">${Number(form.price) || 0}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{t('admin.common.stock')}: {form.stock}</span>
              {form.active !== false ? (
                <span className="rounded-full bg-emerald-500/20 text-emerald-200 px-3 py-1 text-xs font-semibold">{t('admin.common.active')}</span>
              ) : (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{t('admin.common.inactive')}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Section icon="edit" title={t('admin.products.sectionBasics')} subtitle={t('admin.products.sectionBasicsSub')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('admin.common.name')} className="sm:col-span-2">
            <TextInput value={form.name} onChange={(e) => patch({ name: e.target.value })} required placeholder={t('admin.products.productName')} />
          </Field>
          <div className="sm:col-span-2">
            <ImageUploader
              label={t('admin.common.image')}
              value={form.image}
              onChange={(url) => patch({ image: url })}
              hint={t('admin.products.mainImageHint')}
            />
          </div>
          <div className="sm:col-span-2">
            <ImageUploader
              multiple
              label={t('admin.products.gallery')}
              values={form.gallery}
              onChangeValues={(gallery) => patch({ gallery })}
              hint={t('admin.products.galleryHint')}
            />
          </div>
          <Field label={t('admin.common.price')}>
            <TextInput type="number" step="0.01" value={form.price} onChange={(e) => patch({ price: e.target.value })} required />
          </Field>
          <Field label={t('admin.products.originalPrice')}>
            <TextInput type="number" step="0.01" value={form.originalPrice} onChange={(e) => patch({ originalPrice: e.target.value })} />
          </Field>
          <Field label={t('admin.common.stock')}>
            <TextInput type="number" value={form.stock} onChange={(e) => patch({ stock: e.target.value })} />
          </Field>
          <Field label={t('admin.products.sku')}>
            <TextInput value={form.sku} onChange={(e) => patch({ sku: e.target.value })} placeholder="CV-BAG-001" />
          </Field>
          <Field label={t('admin.common.description')} className="sm:col-span-2">
            <Textarea rows={3} value={form.description} onChange={(e) => patch({ description: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section icon="layoutGrid" title={t('admin.products.sectionCategory')} subtitle={t('admin.products.sectionCategorySub')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('admin.common.category')}>
            <Select
              value={form.category}
              onChange={(e) => applyCategoryDefaults(e.target.value, Boolean(initial))}
              options={categories.map((c) => ({ value: c.id, label: catName(c, t) }))}
            />
          </Field>
          <Field label={t('admin.products.subcategory')}>
            <Select
              value={form.subcategory}
              onChange={(e) => patch({ subcategory: e.target.value })}
              options={[
                { value: '', label: t('admin.products.subcategoryNone') },
                ...subOptions.map((s) => ({ value: s, label: subcategoryLabel(t, s) }))
              ]}
            />
          </Field>
          <Field label={t('admin.common.brand')}>
            <Select value={form.brand} onChange={(e) => patch({ brand: e.target.value })} options={brands.map((b) => ({ value: b.id, label: brandLabel(b, t) }))} />
          </Field>
          <Field label={t('admin.products.sellerId')}>
            <Select value={form.sellerId} onChange={(e) => patch({ sellerId: e.target.value })} options={sellers.map((s) => ({ value: s.id, label: sellerLabel(s, t) }))} />
          </Field>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <p className="text-xs font-bold text-midnight-900">{t('admin.products.categoryPreset')}</p>
            <button
              type="button"
              onClick={() => applyCategoryDefaults(form.category, false)}
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              {t('admin.products.applyPreset')}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">{t('admin.products.sizes')}</p>
              <div className="flex flex-wrap gap-2">
                {sizeChoices.map((size) => (
                  <Chip key={size} active={form.sizes.includes(size)} onClick={() => toggleSize(size)}>
                    {localizePresetText(size, t)}
                  </Chip>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <TextInput
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder={t('admin.products.addSize')}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const s = customSize.trim()
                    if (!s) return
                    if (!form.sizes.includes(s)) patch({ sizes: [...form.sizes, s] })
                    setCustomSize('')
                  }}
                >
                  <Icon name="plus" size={14} />
                </Button>
              </div>
            </div>

            {config.showFabric && (
              <Field label={t('admin.products.fabric')} hint={localizedFabric(form.category, t)}>
                <TextInput value={form.fabric} onChange={(e) => patch({ fabric: e.target.value })} />
              </Field>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">{t('admin.products.measurements')}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {config.measureKeys.map((key) => (
                  <Field key={key} label={t(`admin.products.measure.${key}`, { defaultValue: key })}>
                    <TextInput
                      value={form.measurements?.[key] || ''}
                      onChange={(e) => patch({ measurements: { ...form.measurements, [key]: e.target.value } })}
                    />
                  </Field>
                ))}
              </div>
            </div>

            {config.showColors && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-2">{t('admin.products.colors')}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {COLOR_PRESETS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => toggleColor(hex)}
                      title={hex}
                      className={`h-8 w-8 rounded-full border-2 transition-transform ${
                        form.colors.includes(hex) ? 'border-midnight-900 scale-110' : 'border-white shadow ring-1 ring-slate-200'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!form.colors.includes(customColor)) patch({ colors: [...form.colors, customColor] })
                    }}
                  >
                    {t('admin.products.addColor')}
                  </Button>
                  <div className="flex flex-wrap gap-1.5 ms-auto">
                    {form.colors.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => toggleColor(hex)}
                        className="h-6 w-6 rounded-full ring-2 ring-offset-1 ring-slate-200"
                        style={{ backgroundColor: hex }}
                        title={t('admin.products.removeColor')}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section icon="sparkle" title={t('admin.products.sectionDetails')} subtitle={t('admin.products.sectionDetailsSub')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t('admin.reviews.rating')}>
            <TextInput type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => patch({ rating: e.target.value })} />
          </Field>
          <Field label={t('admin.products.reviewsCount')}>
            <TextInput type="number" value={form.reviews} onChange={(e) => patch({ reviews: e.target.value })} />
          </Field>
          <Field label={t('admin.products.flashPercent')} hint={t('admin.products.flashPercentHint')}>
            <TextInput type="number" min="0" max="90" value={form.flashPercent} onChange={(e) => patch({ flashPercent: e.target.value })} placeholder="25" />
          </Field>
          <Field label={t('admin.products.specs')} hint={t('admin.products.specsHint')} className="sm:col-span-2">
            <Textarea rows={3} value={form.specsText} onChange={(e) => patch({ specsText: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section icon="zap" title={t('admin.products.sectionControls')} subtitle={t('admin.products.sectionControlsSub')}>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-sm font-semibold text-midnight-900">{t('admin.products.productActive')}</span>
            <Toggle checked={form.active !== false} onChange={(v) => patch({ active: v })} />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <span className="text-sm font-semibold text-midnight-900">{t('admin.products.limitedEdition')}</span>
            <Toggle checked={form.limitedEdition} onChange={(v) => patch({ limitedEdition: v })} />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:col-span-2">
            <span className="text-sm font-semibold text-midnight-900">{t('admin.products.freeShipping')}</span>
            <Toggle checked={form.freeShipping} onChange={(v) => patch({ freeShipping: v })} />
          </label>
        </div>
        <p className="text-xs font-semibold text-slate-700 mb-2">{t('admin.products.badges')}</p>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <Chip key={b} active={form.badges.includes(b)} onClick={() => toggleBadge(b)}>
              {t(`admin.products.badgeLabels.${b}`, { defaultValue: b })}
            </Chip>
          ))}
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between gap-3 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur rounded-b-3xl">
        <Button type="button" variant="ghost" onClick={onCancel}>{t('admin.common.cancel')}</Button>
        <Button type="submit" variant="dark">
          <Icon name="check" size={15} />
          {initial ? t('admin.common.save') : t('admin.common.create')}
        </Button>
      </div>
    </form>
  )
}
