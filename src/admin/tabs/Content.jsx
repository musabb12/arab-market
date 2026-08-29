import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Field, TextInput, Textarea, Toggle } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

const ICONS = ['truck', 'refresh', 'lock', 'headset', 'sparkle', 'zap', 'gift', 'tag']

export default function Content() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const { content } = siteData
  const [tab, setTab] = useState('hero')

  const setContent = (patch) => updateSite((prev) => ({ ...prev, content: { ...prev.content, ...patch } }))

  const setSlide = (id, patch) => setContent({ heroSlides: content.heroSlides.map((s) => (s.id === id ? { ...s, ...patch } : s)) })

  const addSlide = () => {
    const id = `h${Date.now().toString().slice(-4)}`
    setContent({ heroSlides: [...content.heroSlides, { id, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80', title: 'New slide', subtitle: 'Slide subtitle', enabled: true }] })
    toast(t('admin.common.saved'))
  }

  const removeSlide = (id) => {
    setContent({ heroSlides: content.heroSlides.filter((s) => s.id !== id) })
    toast(t('admin.common.delete'), 'info')
  }

  const tabs = [
    { key: 'hero', label: t('admin.content.heroSlides') },
    { key: 'announcement', label: t('admin.content.announcement') },
    { key: 'promo', label: t('admin.promotions.banner') },
    { key: 'features', label: t('admin.content.features') },
    { key: 'testimonials', label: t('admin.common.customer') }
  ]

  return (
    <div>
      <SectionTitle title={t('admin.content.title')} subtitle={t('admin.content.subtitle')} />

      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((tb) => (
          <button key={tb.key} onClick={() => setTab(tb.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === tb.key ? 'bg-midnight-900 text-white' : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-300'}`}>
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'hero' && (
        <div className="space-y-4">
          {content.heroSlides.map((s, i) => (
            <Card key={s.id} title={`${t('admin.content.heroSlides')} ${i + 1}`} actions={<div className="flex items-center gap-2"><Toggle checked={s.enabled !== false} onChange={(v) => setSlide(s.id, { enabled: v })} /><button onClick={() => removeSlide(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"><Icon name="trash" size={16} /></button></div>}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <img src={s.image} alt="" className="h-28 w-full object-cover rounded-xl" />
                </div>
                <Field label={t('admin.common.imageUrl')} className="md:col-span-2">
                  <TextInput value={s.image} onChange={(e) => setSlide(s.id, { image: e.target.value })} />
                </Field>
                <Field label={t('admin.content.titleLabel')}><TextInput value={s.title} onChange={(e) => setSlide(s.id, { title: e.target.value })} /></Field>
                <Field label={t('admin.content.subtitleLabel')}><TextInput value={s.subtitle} onChange={(e) => setSlide(s.id, { subtitle: e.target.value })} /></Field>
              </div>
            </Card>
          ))}
          <Button variant="outline" onClick={addSlide}><Icon name="plus" size={15} /> {t('admin.content.addSlide')}</Button>
        </div>
      )}

      {tab === 'announcement' && (
        <Card title={t('admin.content.announcement')} subtitle={t('admin.content.subtitle')}>
          <Field label={t('admin.content.announcement')}>
            <TextInput value={content.announcement} onChange={(e) => setContent({ announcement: e.target.value })} />
          </Field>
          <div className="mt-4"><Button onClick={() => { toast(t('admin.common.saved')) }}>{t('admin.common.save')}</Button></div>
        </Card>
      )}

      {tab === 'promo' && (
        <Card title={t('admin.promotions.banner')} subtitle={t('admin.promotions.bannerSub')}>
          <div className="grid md:grid-cols-2 gap-4">
            <img src={content.promo.image} alt="" className="h-32 w-full object-cover rounded-xl md:col-span-2" />
            <Field label={t('admin.common.code')}><TextInput value={content.promo.badge} onChange={(e) => setContent({ promo: { ...content.promo, badge: e.target.value } })} /></Field>
            <Field label={t('admin.common.add')}><TextInput value={content.promo.cta} onChange={(e) => setContent({ promo: { ...content.promo, cta: e.target.value } })} /></Field>
            <Field label={t('admin.content.titleLabel')} className="md:col-span-2"><TextInput value={content.promo.title} onChange={(e) => setContent({ promo: { ...content.promo, title: e.target.value } })} /></Field>
            <Field label={t('admin.content.subtitleLabel')} className="md:col-span-2"><Textarea rows={2} value={content.promo.subtitle} onChange={(e) => setContent({ promo: { ...content.promo, subtitle: e.target.value } })} /></Field>
            <Field label={t('admin.common.imageUrl')} className="md:col-span-2"><TextInput value={content.promo.image} onChange={(e) => setContent({ promo: { ...content.promo, image: e.target.value } })} /></Field>
          </div>
        </Card>
      )}

      {tab === 'features' && (
        <Card title={t('admin.content.features')} subtitle={t('admin.content.subtitle')}>
          <div className="space-y-4">
            {content.features.map((f, i) => (
              <div key={i} className="grid md:grid-cols-[100px_1fr_1fr] gap-3 items-end border border-slate-100 rounded-xl p-4">
                <Field label={t('admin.common.image')}>
                  <select value={f.icon} onChange={(e) => setContent({ features: content.features.map((x, xi) => (xi === i ? { ...x, icon: e.target.value } : x)) })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </Field>
                <Field label={t('admin.content.titleLabel')}><TextInput value={f.title} onChange={(e) => setContent({ features: content.features.map((x, xi) => (xi === i ? { ...x, title: e.target.value } : x)) })} /></Field>
                <Field label={t('admin.content.subtitleLabel')}><TextInput value={f.subtitle} onChange={(e) => setContent({ features: content.features.map((x, xi) => (xi === i ? { ...x, subtitle: e.target.value } : x)) })} /></Field>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'testimonials' && (
        <Card title={t('admin.common.customer')} subtitle={t('admin.content.subtitle')}>
          <div className="space-y-4">
            {content.testimonials.map((tm, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4 grid md:grid-cols-[150px_1fr] gap-3">
                <Field label={t('admin.common.name')}><TextInput value={tm.name} onChange={(e) => setContent({ testimonials: content.testimonials.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)) })} /></Field>
                <Field label={t('admin.reviews.comment')}><TextInput value={tm.text} onChange={(e) => setContent({ testimonials: content.testimonials.map((x, xi) => (xi === i ? { ...x, text: e.target.value } : x)) })} /></Field>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
