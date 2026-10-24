import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Modal, Field, TextInput, Textarea, Toggle, SearchInput, Badge, AdminCardGrid, AdminEntityCard, AdminIconButton } from '../ui.jsx'
import { catName } from '../../utils/catalog.js'
import Icon from '../../components/Icons.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'

const gradients = ['bg-brand-600', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-midnight-800', 'bg-sky-500', 'bg-stone-700', 'bg-indigo-600']

const EMPTY = { name: '', nameAr: '', image: '', gradient: gradients[0], subcategories: '', description: '', active: true }

export default function Categories() {
  const { t } = useTranslation()
  const { siteData, updateSite, products, toast } = useStore()
  const categories = siteData.categories || []
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const list = categories.filter((c) => catName(c, t).toLowerCase().includes(q.toLowerCase()))

  const setCategories = (next) => updateSite((prev) => ({ ...prev, categories: next }))

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true) }
  const openEdit = (c) => {
    setEditing(c)
    setForm({
      name: c.name || '',
      nameAr: c.nameAr || '',
      image: c.image || '',
      gradient: c.gradient || gradients[0],
      subcategories: (c.subcategories || []).join(', '),
      description: c.description || '',
      active: c.active !== false
    })
    setOpen(true)
  }

  const save = (e) => {
    e.preventDefault()
    const payload = {
      name: form.name.trim() || undefined,
      nameAr: form.nameAr.trim() || undefined,
      image: form.image,
      gradient: form.gradient,
      subcategories: form.subcategories.split(',').map((s) => s.trim()).filter(Boolean),
      description: form.description.trim(),
      active: form.active !== false
    }
    if (editing) {
      setCategories(categories.map((c) => (c.id === editing.id ? { ...c, ...payload, nameKey: c.nameKey || `categories.${c.id}` } : c)))
    } else {
      const id = `c${Date.now().toString(36)}`
      setCategories([...categories, { id, nameKey: `categories.${id}`, ...payload }])
    }
    toast(t('admin.common.saved'))
    setOpen(false)
  }

  const remove = (id) => {
    setCategories(categories.filter((c) => c.id !== id))
    toast(t('admin.common.delete'), 'info')
  }

  const move = (id, dir) => {
    const i = categories.findIndex((c) => c.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= categories.length) return
    const next = [...categories]
    ;[next[i], next[j]] = [next[j], next[i]]
    setCategories(next)
  }

  const toggleActive = (id) =>
    setCategories(categories.map((c) => (c.id === id ? { ...c, active: c.active === false } : c)))

  const countFor = (id) => products.filter((p) => p.category === id).length

  return (
    <div>
      <SectionTitle
        title={t('admin.categories.title')}
        subtitle={t('admin.categories.subtitle', { count: categories.length })}
        actions={<Button onClick={openNew}><Icon name="plus" size={15} /> {t('admin.categories.add')}</Button>}
      />
      <Card className="mb-5"><SearchInput value={q} onChange={setQ} placeholder={t('admin.categories.search')} /></Card>

      {list.length === 0 ? (
        <Card>
          <p className="py-12 text-center text-sm text-slate-400">{t('admin.categories.empty')}</p>
        </Card>
      ) : (
        <AdminCardGrid className="sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <AdminEntityCard
              key={c.id}
              image={c.image}
              imageAlt={catName(c, t)}
              gradient={c.gradient}
              title={catName(c, t)}
              subtitle={c.description ? <span className="line-clamp-1">{c.description}</span> : `${countFor(c.id)} ${t('admin.sellers.products').toLowerCase()}`}
              topBadges={[
                { label: c.active !== false ? t('admin.common.active') : t('admin.common.inactive'), tone: c.active !== false ? 'green' : 'gray' },
                { label: `${countFor(c.id)} ${t('admin.common.items')}`, tone: 'blue' }
              ]}
              meta={[
                { label: t('admin.sellers.products'), value: countFor(c.id) },
                { label: t('admin.common.status'), value: c.active !== false ? t('admin.common.active') : t('admin.common.inactive') }
              ]}
              footer={
                <>
                  <div className="flex items-center gap-0.5">
                    <AdminIconButton icon="chevronDown" className="rotate-180" title={t('admin.common.up')} onClick={() => move(c.id, -1)} />
                    <AdminIconButton icon="chevronDown" title={t('admin.common.down')} onClick={() => move(c.id, 1)} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Toggle checked={c.active !== false} onChange={() => toggleActive(c.id)} />
                    <AdminIconButton icon="edit" title={t('admin.common.edit')} onClick={() => openEdit(c)} />
                    <AdminIconButton icon="trash" title={t('admin.common.delete')} variant="danger" onClick={() => remove(c.id)} />
                  </div>
                </>
              }
            >
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(c.subcategories || []).slice(0, 4).map((sub) => (
                  <Badge key={sub} tone="gray" className="text-[10px]">{sub}</Badge>
                ))}
                {(c.subcategories || []).length > 4 && (
                  <Badge tone="gray" className="text-[10px]">+{(c.subcategories || []).length - 4}</Badge>
                )}
              </div>
            </AdminEntityCard>
          ))}
        </AdminCardGrid>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t('admin.categories.edit') : t('admin.categories.add')}>
        <form onSubmit={save} className="space-y-4">
          {editing && editing.nameKey && (
            <p className="text-xs text-slate-400 -mb-1">
              {t('admin.categories.currentName')}: <span className="font-semibold text-midnight-900">{catName(editing, t)}</span>
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.categories.nameEn')}>
              <TextInput dir="ltr" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required={!editing} placeholder={editing ? catName(editing, t) : ''} />
            </Field>
            <Field label={t('admin.categories.nameAr')}>
              <TextInput value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
            </Field>
          </div>
          <ImageUploader label={t('admin.common.image')} value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          <Field label={t('admin.categories.subcategories')} hint={t('admin.categories.subcategoriesHint')}>
            <Textarea rows={2} value={form.subcategories} onChange={(e) => setForm({ ...form, subcategories: e.target.value })} />
          </Field>
          <Field label={t('admin.common.description')}>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label={t('admin.categories.fallbackColor')} hint={t('admin.categories.fallbackColorHint')}>
            <div className="flex flex-wrap gap-2">
              {gradients.map((g) => (
                <button type="button" key={g} onClick={() => setForm({ ...form, gradient: g })} className={`h-9 w-14 rounded-xl ${g} ${form.gradient === g ? 'ring-2 ring-midnight-900 ring-offset-2' : 'opacity-70'}`} />
              ))}
            </div>
          </Field>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <Toggle checked={form.active !== false} onChange={(v) => setForm({ ...form, active: v })} />
              <span className="text-sm font-medium text-slate-600">{t('admin.categories.visible')}</span>
            </div>
            <Button type="submit">{editing ? t('admin.common.save') : t('admin.common.create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
