import React, { useState } from 'react'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Button, Field, TextInput, Textarea, Toggle, Badge } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

const ICONS = ['truck', 'refresh', 'lock', 'headset', 'sparkle', 'zap', 'gift', 'tag']

export default function Content() {
  const { siteData, updateSite, toast } = useStore()
  const { content } = siteData
  const [tab, setTab] = useState('hero')

  const setContent = (patch) => updateSite((prev) => ({ ...prev, content: { ...prev.content, ...patch } }))

  const setSlide = (id, patch) => setContent({ heroSlides: content.heroSlides.map((s) => (s.id === id ? { ...s, ...patch } : s)) })

  const addSlide = () => {
    const id = `h${Date.now().toString().slice(-4)}`
    setContent({ heroSlides: [...content.heroSlides, { id, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80', title: 'New slide', subtitle: 'Slide subtitle', enabled: true }] })
    toast('Slide added')
  }

  const removeSlide = (id) => {
    setContent({ heroSlides: content.heroSlides.filter((s) => s.id !== id) })
    toast('Slide removed', 'info')
  }

  const tabs = [
    { key: 'hero', label: 'Hero Slides' },
    { key: 'announcement', label: 'Announcement' },
    { key: 'promo', label: 'Promo Banner' },
    { key: 'features', label: 'Features' },
    { key: 'testimonials', label: 'Testimonials' }
  ]

  return (
    <div>
      <SectionTitle title="Content & Pages" subtitle="Manage homepage content, banners and customer testimonials" />

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
            <Card key={s.id} title={`Slide ${i + 1}`} actions={<div className="flex items-center gap-2"><Toggle checked={s.enabled !== false} onChange={(v) => setSlide(s.id, { enabled: v })} /><button onClick={() => removeSlide(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"><Icon name="trash" size={16} /></button></div>}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <img src={s.image} alt="" className="h-28 w-full object-cover rounded-xl" />
                </div>
                <Field label="Background image URL" className="md:col-span-2">
                  <TextInput value={s.image} onChange={(e) => setSlide(s.id, { image: e.target.value })} />
                </Field>
                <Field label="Title"><TextInput value={s.title} onChange={(e) => setSlide(s.id, { title: e.target.value })} /></Field>
                <Field label="Subtitle"><TextInput value={s.subtitle} onChange={(e) => setSlide(s.id, { subtitle: e.target.value })} /></Field>
              </div>
            </Card>
          ))}
          <Button variant="outline" onClick={addSlide}><Icon name="plus" size={15} /> Add slide</Button>
        </div>
      )}

      {tab === 'announcement' && (
        <Card title="Announcement bar" subtitle="Shown in the top bar across the store">
          <Field label="Announcement text">
            <TextInput value={content.announcement} onChange={(e) => setContent({ announcement: e.target.value })} />
          </Field>
          <div className="mt-4"><Button onClick={() => { toast('Announcement saved') }}>Save</Button></div>
        </Card>
      )}

      {tab === 'promo' && (
        <Card title="Promo banner" subtitle="Displayed in the promotions section of the homepage">
          <div className="grid md:grid-cols-2 gap-4">
            <img src={content.promo.image} alt="" className="h-32 w-full object-cover rounded-xl md:col-span-2" />
            <Field label="Badge"><TextInput value={content.promo.badge} onChange={(e) => setContent({ promo: { ...content.promo, badge: e.target.value } })} /></Field>
            <Field label="CTA button text"><TextInput value={content.promo.cta} onChange={(e) => setContent({ promo: { ...content.promo, cta: e.target.value } })} /></Field>
            <Field label="Title" className="md:col-span-2"><TextInput value={content.promo.title} onChange={(e) => setContent({ promo: { ...content.promo, title: e.target.value } })} /></Field>
            <Field label="Subtitle" className="md:col-span-2"><Textarea rows={2} value={content.promo.subtitle} onChange={(e) => setContent({ promo: { ...content.promo, subtitle: e.target.value } })} /></Field>
            <Field label="Background image URL" className="md:col-span-2"><TextInput value={content.promo.image} onChange={(e) => setContent({ promo: { ...content.promo, image: e.target.value } })} /></Field>
          </div>
        </Card>
      )}

      {tab === 'features' && (
        <Card title="Feature highlights" subtitle="Four icons shown in the storefront feature bar">
          <div className="space-y-4">
            {content.features.map((f, i) => (
              <div key={i} className="grid md:grid-cols-[100px_1fr_1fr] gap-3 items-end border border-slate-100 rounded-xl p-4">
                <Field label="Icon">
                  <select value={f.icon} onChange={(e) => setContent({ features: content.features.map((x, xi) => (xi === i ? { ...x, icon: e.target.value } : x)) })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </Field>
                <Field label="Title"><TextInput value={f.title} onChange={(e) => setContent({ features: content.features.map((x, xi) => (xi === i ? { ...x, title: e.target.value } : x)) })} /></Field>
                <Field label="Subtitle"><TextInput value={f.subtitle} onChange={(e) => setContent({ features: content.features.map((x, xi) => (xi === i ? { ...x, subtitle: e.target.value } : x)) })} /></Field>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'testimonials' && (
        <Card title="Testimonials" subtitle="Customer quotes shown on the homepage">
          <div className="space-y-4">
            {content.testimonials.map((tm, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4 grid md:grid-cols-[150px_1fr] gap-3">
                <Field label="Name"><TextInput value={tm.name} onChange={(e) => setContent({ testimonials: content.testimonials.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)) })} /></Field>
                <Field label="Quote"><TextInput value={tm.text} onChange={(e) => setContent({ testimonials: content.testimonials.map((x, xi) => (xi === i ? { ...x, text: e.target.value } : x)) })} /></Field>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
