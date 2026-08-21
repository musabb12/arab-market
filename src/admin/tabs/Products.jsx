import React, { useMemo, useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Modal, Field, TextInput, Select, Textarea, Toggle, Badge, StatusBadge, SearchInput, Table, Empty } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import { getBrand, getCategory, catName } from '../../utils/helpers.js'

const BADGES = ['flashSale', 'featured', 'bestSeller', 'newArrival']

const emptyForm = {
  name: '', price: 0, originalPrice: 0, stock: 100, rating: 4.5, reviews: 0,
  category: 'electronics', brand: 'nova', sellerId: 's1', image: '', badges: [],
  description: '', specs: [], colors: [], active: true
}

export default function Products() {
  const { siteData, updateSite, toast, refreshCatalog } = useStore()
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
        toast('Product updated')
      } else {
        const { product } = await api.adminCreateProduct(form)
        updateSite((prev) => ({ ...prev, products: [{ ...product, stockBase: form.stock }, ...prev.products] }))
        toast('Product created')
      }
      setOpen(false)
      await refreshCatalog()
    } catch (err) {
      toast(err.message || 'Save failed', 'error')
    }
  }

  const remove = async (id) => {
    try {
      const { api } = await import('../../api/client.js')
      await api.adminDeleteProduct(id)
      updateSite((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }))
      toast('Product removed', 'info')
      await refreshCatalog()
    } catch (err) {
      toast(err.message || 'Delete failed', 'error')
    }
  }

  const toggleActive = async (p) => {
    try {
      const { api } = await import('../../api/client.js')
      const active = p.active === false
      const { product } = await api.adminUpdateProduct(p.id, { active })
      updateSite((prev) => ({ ...prev, products: prev.products.map((x) => (x.id === p.id ? { ...x, ...product } : x)) }))
    } catch (err) {
      toast(err.message || 'Update failed', 'error')
    }
  }

  return (
    <div>
      <SectionTitle
        title="Products"
        subtitle={`${list.length} of ${products.length} products`}
        actions={<Button onClick={() => { setEditing(null); setOpen(true) }}><Icon name="plus" size={15} /> Add product</Button>}
      />

      <Card className="mb-5">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <SearchInput value={q} onChange={setQ} placeholder="Search by name or ID..." />
          </div>
          <Select value={cat} onChange={(e) => setCat(e.target.value)} options={[{ value: 'all', label: 'All categories' }, ...categories.map((c) => ({ value: c.id, label: catName(c) }))]} />
          <div className="flex items-center gap-3 px-2">
            <Toggle checked={onlyActive} onChange={setOnlyActive} />
            <span className="text-sm font-medium text-slate-600">Active only</span>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <Empty icon="box" title="No products found" subtitle="Try adjusting your filters or add a new product." />
        ) : (
          <Table head={['Product', 'Category', 'Brand', 'Price', 'Stock', 'Status', 'Actions']}>
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-11 w-11 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-midnight-900 truncate max-w-[220px]">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{catName(getCategory(p.category))}</td>
                <td className="px-4 py-3 text-slate-600">{getBrand(p.brand).name}</td>
                <td className="px-4 py-3 font-semibold text-midnight-900">
                  ${p.price}
                  {p.originalPrice && <span className="text-xs text-slate-400 line-through ms-1.5">${p.originalPrice}</span>}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={p.stock <= 0 ? 'red' : p.stock < 50 ? 'amber' : 'green'}>{p.stock} in stock</Badge>
                </td>
                <td className="px-4 py-3"><StatusBadge status={p.active !== false ? 'active' : 'draft'} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleActive(p)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors" title="Toggle active">
                      <Icon name={p.active !== false ? 'eye' : 'lock'} size={16} />
                    </button>
                    <button onClick={() => { setEditing(p); setOpen(true) }} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition-colors">
                      <Icon name="edit" size={16} />
                    </button>
                    <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors">
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${editing.name}` : 'Add product'} width="max-w-3xl">
        <ProductForm key={editing?.id || 'new'} initial={editing} categories={categories} brands={brands} sellers={sellers} onSave={save} />
      </Modal>
    </div>
  )
}

function ProductForm({ initial, categories, brands, sellers, onSave }) {
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
        <Field label="Name" className="sm:col-span-2">
          <TextInput value={form.name} onChange={set('name')} required placeholder="Product name" />
        </Field>
        <Field label="Image URL" className="sm:col-span-2">
          <TextInput value={form.image} onChange={set('image')} placeholder="https://images.unsplash.com/..." />
        </Field>
        <Field label="Price (USD)">
          <TextInput type="number" step="0.01" value={form.price} onChange={set('price')} required />
        </Field>
        <Field label="Original price">
          <TextInput type="number" step="0.01" value={form.originalPrice} onChange={set('originalPrice')} />
        </Field>
        <Field label="Category">
          <Select value={form.category} onChange={set('category')} options={categories.map((c) => ({ value: c.id, label: catName(c) }))} />
        </Field>
        <Field label="Brand">
          <Select value={form.brand} onChange={set('brand')} options={brands.map((b) => ({ value: b.id, label: b.name }))} />
        </Field>
        <Field label="Seller">
          <Select value={form.sellerId} onChange={set('sellerId')} options={sellers.map((s) => ({ value: s.id, label: s.name }))} />
        </Field>
        <Field label="Stock">
          <TextInput type="number" value={form.stock} onChange={set('stock')} />
        </Field>
        <Field label="Rating">
          <TextInput type="number" step="0.1" min="0" max="5" value={form.rating} onChange={set('rating')} />
        </Field>
        <Field label="Review count">
          <TextInput type="number" value={form.reviews} onChange={set('reviews')} />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <Textarea rows={3} value={form.description} onChange={set('description')} />
        </Field>
        <Field label="Specifications (comma separated)" className="sm:col-span-2">
          <TextInput value={form.specs.join(', ')} onChange={set('specs')} />
        </Field>
        <Field label="Colors (hex, comma separated)" className="sm:col-span-2">
          <TextInput value={form.colors.join(', ')} onChange={set('colors')} />
        </Field>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2">Badges</p>
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
          <span className="text-sm font-medium text-slate-600">Product active</span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit">{initial ? 'Save changes' : 'Create product'}</Button>
        </div>
      </div>
    </form>
  )
}
