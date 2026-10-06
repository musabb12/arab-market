import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Modal, Field, TextInput, Select, Textarea, Toggle, Badge, SearchInput, Empty, AdminCardGrid, AdminEntityCard, AdminIconButton } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { getBrand, getCategory, catName } from '../../utils/helpers.js'

const BADGES = ['flashSale', 'featured', 'bestSeller', 'newArrival']

const emptyForm = {
  name: '', price: 0, originalPrice: 0, stock: 100, rating: 4.5, reviews: 0,
  category: 'bags', brand: 'hermes', sellerId: 's1', image: '', badges: [],
  description: '', specs: [], colors: [], active: true
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
          <Select value={cat} onChange={(e) => setCat(e.target.value)} options={[{ value: 'all', label: t('admin.common.all') }, ...categories.map((c) => ({ value: c.id, label: catName(c) }))]} />
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
                { label: t('admin.common.category'), value: catName(getCategory(p.category)) },
                { label: t('admin.common.brand'), value: getBrand(p.brand).name }
              ]}
              footer={
                <>
                  <div className="flex flex-wrap gap-1">
                    {(p.badges || []).slice(0, 2).map((b) => (
                      <Badge key={b} tone="purple" className="text-[10px]">{b}</Badge>
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t('admin.products.edit', { name: editing.name }) : t('admin.products.add')} width="max-w-3xl">
        <ProductForm key={editing?.id || 'new'} initial={editing} categories={categories} brands={brands} sellers={sellers} onSave={save} />
      </Modal>
    </div>
  )
}

function ProductForm({ initial, categories, brands, sellers, onSave }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ ...emptyForm, ...initial })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggleBadge = (b) => setForm((f) => ({ ...f, badges: f.badges.includes(b) ? f.badges.filter((x) => x !== b) : [...f.badges, b] }))

  const submit = (e) => {
    e.preventDefault()
    const price = Number(form.price)
    const clean = {
      ...form,
      price,
      originalPrice: Number(form.originalPrice) || 0,
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      specs: form.specs.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean)
    }
    onSave(clean)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t('admin.common.name')} className="sm:col-span-2">
          <TextInput value={form.name} onChange={set('name')} required placeholder={t('admin.products.productName')} />
        </Field>
        <Field label={t('admin.common.imageUrl')} className="sm:col-span-2">
          <TextInput value={form.image} onChange={set('image')} placeholder="https://images.unsplash.com/..." />
        </Field>
        <Field label={t('admin.common.price')}>
          <TextInput type="number" step="0.01" value={form.price} onChange={set('price')} required />
        </Field>
        <Field label={t('admin.products.originalPrice')}>
          <TextInput type="number" step="0.01" value={form.originalPrice} onChange={set('originalPrice')} />
        </Field>
        <Field label={t('admin.common.category')}>
          <Select value={form.category} onChange={set('category')} options={categories.map((c) => ({ value: c.id, label: catName(c) }))} />
        </Field>
        <Field label={t('admin.common.brand')}>
          <Select value={form.brand} onChange={set('brand')} options={brands.map((b) => ({ value: b.id, label: b.name }))} />
        </Field>
        <Field label={t('admin.products.sellerId')}>
          <Select value={form.sellerId} onChange={set('sellerId')} options={sellers.map((s) => ({ value: s.id, label: s.name }))} />
        </Field>
        <Field label={t('admin.common.stock')}>
          <TextInput type="number" value={form.stock} onChange={set('stock')} />
        </Field>
        <Field label={t('admin.reviews.rating')}>
          <TextInput type="number" step="0.1" min="0" max="5" value={form.rating} onChange={set('rating')} />
        </Field>
        <Field label={t('admin.common.value')}>
          <TextInput type="number" value={form.reviews} onChange={set('reviews')} />
        </Field>
        <Field label={t('admin.common.description')} className="sm:col-span-2">
          <Textarea rows={3} value={form.description} onChange={set('description')} />
        </Field>
        <Field label={t('admin.common.description')} className="sm:col-span-2">
          <TextInput value={form.specs.join(', ')} onChange={set('specs')} />
        </Field>
        <Field label={t('admin.common.image')} className="sm:col-span-2">
          <TextInput value={form.colors.join(', ')} onChange={set('colors')} />
        </Field>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">{t('admin.products.badges')}</p>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <button
              type="button"
              key={b}
              onClick={() => toggleBadge(b)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${form.badges.includes(b) ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 text-slate-500 hover:border-brand-400'}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <Toggle checked={form.active !== false} onChange={(v) => setForm((f) => ({ ...f, active: v }))} />
          <span className="text-sm font-medium text-slate-600">{t('admin.products.productActive')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit">{initial ? t('admin.common.save') : t('admin.common.create')}</Button>
        </div>
      </div>
    </form>
  )
}
