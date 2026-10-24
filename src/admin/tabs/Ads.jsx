import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Modal, Field, TextInput, Textarea, Toggle, Select, Badge, AdminCardGrid, AdminEntityCard, AdminIconButton } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { AD_POSITIONS } from '../../data/siteDefaults.js'

const EMPTY_FORM = {
  title: '',
  subtitle: '',
  image: '',
  cta: '',
  link: '/products',
  position: 'homeTop',
  bgColor: '',
  enabled: true
}

export default function Ads() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const ads = siteData.ads || []
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const setAds = (next) => updateSite((prev) => ({ ...prev, ads: next }))

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setOpen(true) }
  const openEdit = (ad) => { setEditing(ad); setForm({ ...EMPTY_FORM, ...ad }); setOpen(true) }

  const save = (e) => {
    e.preventDefault()
    if (editing) {
      setAds(ads.map((a) => (a.id === editing.id ? { ...a, ...form } : a)))
    } else {
      setAds([...ads, { id: `ad${Date.now()}`, ...form }])
    }
    toast(t('admin.common.saved'))
    setOpen(false)
  }

  const remove = (id) => {
    setAds(ads.filter((a) => a.id !== id))
    toast(t('admin.common.delete'), 'info')
  }

  const move = (id, dir) => {
    const i = ads.findIndex((a) => a.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= ads.length) return
    const next = [...ads]
    ;[next[i], next[j]] = [next[j], next[i]]
    setAds(next)
  }

  const toggle = (id) => setAds(ads.map((a) => (a.id === id ? { ...a, enabled: a.enabled === false } : a)))

  const positionTone = { homeTop: 'purple', homeMiddle: 'blue', homeBottom: 'amber', popup: 'red' }

  return (
    <div>
      <SectionTitle
        title={t('admin.ads.title')}
        subtitle={t('admin.ads.subtitle', { count: ads.length })}
        actions={<Button onClick={openNew}><Icon name="plus" size={15} /> {t('admin.ads.add')}</Button>}
      />

      <Card className="mb-5">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {AD_POSITIONS.map((p) => (
            <div key={p} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <Badge tone={positionTone[p]}>{t(`admin.ads.pos_${p}`)}</Badge>
              <p className="text-[11px] text-slate-500 leading-snug">{t(`admin.ads.pos_${p}Hint`)}</p>
            </div>
          ))}
        </div>
      </Card>

      {ads.length === 0 ? (
        <Card>
          <div className="py-14 text-center">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
              <Icon name="megaphone" size={28} />
            </span>
            <p className="font-semibold text-midnight-900">{t('admin.ads.empty')}</p>
            <p className="mt-1 text-sm text-slate-400">{t('admin.ads.emptySub')}</p>
            <Button className="mt-5" onClick={openNew}><Icon name="plus" size={15} /> {t('admin.ads.add')}</Button>
          </div>
        </Card>
      ) : (
        <AdminCardGrid className="sm:grid-cols-2 xl:grid-cols-3">
          {ads.map((ad, i) => (
            <AdminEntityCard
              key={ad.id}
              image={ad.image}
              imageAlt={ad.title}
              gradient="bg-midnight-800"
              title={ad.title || t('admin.ads.untitled')}
              subtitle={ad.subtitle}
              topBadges={[
                { label: t(`admin.ads.pos_${ad.position}`), tone: positionTone[ad.position] || 'gray' },
                { label: ad.enabled !== false ? t('admin.common.active') : t('admin.common.inactive'), tone: ad.enabled !== false ? 'green' : 'gray' }
              ]}
              meta={[
                { label: t('admin.ads.cta'), value: ad.cta || '—' },
                { label: t('admin.ads.link'), value: ad.link || '—' }
              ]}
              footer={
                <>
                  <div className="flex items-center gap-0.5">
                    <AdminIconButton icon="chevronDown" title={t('admin.common.down')} onClick={() => move(ad.id, 1)} />
                    <AdminIconButton icon="chevronDown" title={t('admin.common.up')} className="rotate-180" onClick={() => move(ad.id, -1)} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Toggle checked={ad.enabled !== false} onChange={() => toggle(ad.id)} />
                    <AdminIconButton icon="edit" title={t('admin.common.edit')} onClick={() => openEdit(ad)} />
                    <AdminIconButton icon="trash" title={t('admin.common.delete')} variant="danger" onClick={() => remove(ad.id)} />
                  </div>
                </>
              }
            />
          ))}
        </AdminCardGrid>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t('admin.ads.edit') : t('admin.ads.add')}>
        <form onSubmit={save} className="space-y-4">
          <Field label={t('admin.ads.adTitle')}><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label={t('admin.ads.adSubtitle')}><Textarea rows={2} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></Field>
          <ImageUploader label={t('admin.common.image')} value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.ads.cta')}><TextInput value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} placeholder={t('admin.ads.ctaPlaceholder')} /></Field>
            <Field label={t('admin.ads.link')}><TextInput dir="ltr" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/products" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('admin.ads.position')} hint={t(`admin.ads.pos_${form.position}Hint`)}>
              <Select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                options={AD_POSITIONS.map((p) => ({ value: p, label: t(`admin.ads.pos_${p}`) }))}
              />
            </Field>
            <Field label={t('admin.ads.bgColor')}>
              <div className="flex items-center gap-2">
                <input type="color" value={form.bgColor || '#0f172a'} onChange={(e) => setForm({ ...form, bgColor: e.target.value })} className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer shrink-0" />
                <TextInput dir="ltr" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })} placeholder="#0f172a" />
                {form.bgColor && (
                  <button type="button" onClick={() => setForm({ ...form, bgColor: '' })} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 shrink-0">
                    <Icon name="close" size={14} />
                  </button>
                )}
              </div>
            </Field>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <Toggle checked={form.enabled !== false} onChange={(v) => setForm({ ...form, enabled: v })} />
              <span className="text-sm font-medium text-slate-600">{t('admin.ads.enabledHint')}</span>
            </div>
            <Button type="submit">{editing ? t('admin.common.save') : t('admin.common.create')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
