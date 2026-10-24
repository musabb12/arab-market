import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Button, Toggle } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { HEADER_FONTS } from '../../data/siteDefaults.js'

const HEADER_TOGGLES = [
  { key: 'topBarEnabled', icon: 'megaphone' },
  { key: 'showSearch', icon: 'search' },
  { key: 'showNavStrip', icon: 'menu' },
  { key: 'showCategoriesMenu', icon: 'layoutGrid' },
  { key: 'showTrackOrder', icon: 'truck' },
  { key: 'showThemeToggle', icon: 'moon' }
]

function ColorField({ label, value, onChange, clearLabel }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded-lg border border-slate-200 cursor-pointer shrink-0"
        />
        <TextInput dir="ltr" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="#ffffff" />
        {value ? (
          <button onClick={() => onChange('')} title={clearLabel} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 shrink-0">
            <Icon name="close" size={14} />
          </button>
        ) : null}
      </div>
    </Field>
  )
}

export default function Header() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const header = siteData.header || {}
  const { settings } = siteData

  const setHeader = (patch) => updateSite((prev) => ({ ...prev, header: { ...prev.header, ...patch } }))
  const setSetting = (k, v) => updateSite((prev) => ({ ...prev, settings: { ...prev.settings, [k]: v } }))

  const messages = header.topBarMessages || []
  const customLinks = header.customLinks || []
  const [newMsg, setNewMsg] = useState('')
  const [newLink, setNewLink] = useState({ label: '', to: '/' })

  const addMessage = () => {
    if (!newMsg.trim()) return
    setHeader({ topBarMessages: [...messages, newMsg.trim()] })
    setNewMsg('')
  }

  const addLink = () => {
    if (!newLink.label.trim() || !newLink.to.trim()) return
    const to = newLink.to.startsWith('/') ? newLink.to : `/${newLink.to}`
    setHeader({ customLinks: [...customLinks, { id: `cl${Date.now()}`, label: newLink.label.trim(), to }] })
    setNewLink({ label: '', to: '/' })
  }

  const font = HEADER_FONTS.find((f) => f.id === header.logoFont) || HEADER_FONTS[0]

  const barSlides = [header.barBgImage, ...(header.barBgImages || [])].filter(Boolean)
  const setBarSlides = (arr) => setHeader({ barBgImage: arr[0] || '', barBgImages: arr.slice(1) })

  const heroSlides = siteData.content?.heroSlides || []
  const setHeroSlides = (arr) => updateSite((prev) => ({ ...prev, content: { ...prev.content, heroSlides: arr } }))
  const moveHero = (i, dir) => {
    const a = [...heroSlides]
    const j = i + dir
    if (j < 0 || j >= a.length) return
    ;[a[i], a[j]] = [a[j], a[i]]
    setHeroSlides(a)
  }
  const toggleHero = (id) => setHeroSlides(heroSlides.map((s) => (s.id === id ? { ...s, enabled: s.enabled === false } : s)))
  const removeHero = (id) => setHeroSlides(heroSlides.filter((s) => s.id !== id))
  const moveSlide = (i, dir) => {
    const a = [...barSlides]
    const j = i + dir
    if (j < 0 || j >= a.length) return
    ;[a[i], a[j]] = [a[j], a[i]]
    setBarSlides(a)
  }
  const removeSlide = (i) => setBarSlides(barSlides.filter((_, x) => x !== i))
  const makePrimary = (i) => setBarSlides([barSlides[i], ...barSlides.filter((_, x) => x !== i)])

  return (
    <div>
      <SectionTitle title={t('admin.header.title')} subtitle={t('admin.header.subtitle')} />

      <Card title={t('admin.header.gallery')} subtitle={t('admin.header.galleryHint')} className="mb-6">
        {/* Hero slideshow images — currently shown at the top of the store */}
        {heroSlides.length > 0 && (
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-700">{t('admin.header.heroImages')}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t('admin.header.heroImagesHint')}</p>
              </div>
              <Link to="/admin/content" className="text-xs font-semibold text-brand-600 hover:underline shrink-0">
                {t('admin.header.manageInContent')}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {heroSlides.map((s, i) => (
                <div key={s.id} className={`group relative rounded-xl overflow-hidden border ${s.enabled !== false ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60'}`}>
                  <img src={s.image} alt="" className="h-24 w-full object-cover" />
                  <span className="absolute top-1.5 start-1.5 rounded-md bg-midnight-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {t('admin.header.heroSlide', { n: i + 1 })}
                  </span>
                  {s.enabled === false && (
                    <span className="absolute top-1.5 end-1.5 rounded-md bg-slate-700/85 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      {t('admin.common.disabled')}
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-0.5 bg-gradient-to-t from-midnight-900/85 to-transparent px-1.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-0.5">
                      <button onClick={() => moveHero(i, -1)} disabled={i === 0} className="flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-midnight-900 disabled:opacity-30" title={t('admin.common.up')}>
                        <Icon name="chevronDown" size={12} className="rotate-180" />
                      </button>
                      <button onClick={() => moveHero(i, 1)} disabled={i === heroSlides.length - 1} className="flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-midnight-900 disabled:opacity-30" title={t('admin.common.down')}>
                        <Icon name="chevronDown" size={12} />
                      </button>
                    </div>
                    <div className="flex gap-0.5">
                      <button onClick={() => toggleHero(s.id)} className="flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-midnight-900" title={s.enabled !== false ? t('admin.common.disabled') : t('admin.common.enabled')}>
                        <Icon name="eye" size={12} />
                      </button>
                      <button onClick={() => removeHero(s.id)} className="flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-red-600 hover:bg-red-600 hover:text-white" title={t('admin.common.delete')}>
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold text-slate-700 mb-2">{t('admin.header.slidesOrder')}</p>
            {barSlides.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center">
                <Icon name="upload" size={22} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">{t('admin.header.noSlides')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {barSlides.map((src, i) => (
                  <div key={`${i}-${String(src).slice(-24)}`} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2">
                    <span className="w-5 text-center text-[10px] font-bold text-slate-400">{i + 1}</span>
                    <img src={src} alt="" className="h-12 w-20 rounded-lg object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${i === 0 ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>
                        {i === 0 ? t('admin.header.role_main') : `${t('admin.header.role_slide')} ${i}`}
                      </span>
                      <p className="mt-0.5 text-[10px] text-slate-400 truncate" dir="ltr">{String(src).slice(0, 60)}</p>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {i !== 0 && (
                        <button onClick={() => makePrimary(i)} title={t('admin.header.makePrimary')} className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600">
                          <Icon name="star" size={14} />
                        </button>
                      )}
                      <button onClick={() => moveSlide(i, -1)} disabled={i === 0} title={t('admin.common.up')} className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-midnight-900 disabled:opacity-30">
                        <Icon name="chevronDown" size={14} className="rotate-180" />
                      </button>
                      <button onClick={() => moveSlide(i, 1)} disabled={i === barSlides.length - 1} title={t('admin.common.down')} className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-midnight-900 disabled:opacity-30">
                        <Icon name="chevronDown" size={14} />
                      </button>
                      <button onClick={() => removeSlide(i)} title={t('admin.common.delete')} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600">
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-[11px] text-slate-400">{t('admin.header.slidesHint')}</p>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <ImageUploader
              label={t('admin.header.addSlide')}
              values={header.barBgImages || []}
              onChangeValues={(urls) => setHeader({ barBgImages: urls })}
              multiple
            />
            <ImageUploader
              label={t('admin.header.topBarBgImage')}
              hint={t('admin.header.topBarImageHint')}
              value={header.topBarBgImage || ''}
              onChange={(url) => setHeader({ topBarBgImage: url })}
            />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title={t('admin.header.topBar')} subtitle={t('admin.header.topBarHint')}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
              <span className="text-sm font-semibold text-midnight-900">{t('admin.header.topBarEnabled')}</span>
              <Toggle checked={header.topBarEnabled !== false} onChange={(v) => setHeader({ topBarEnabled: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label={t('admin.header.topBarBg')} value={header.topBarBg} onChange={(v) => setHeader({ topBarBg: v })} clearLabel={t('admin.header.clear')} />
              <ColorField label={t('admin.header.topBarColor')} value={header.topBarColor} onChange={(v) => setHeader({ topBarColor: v })} clearLabel={t('admin.header.clear')} />
            </div>
            {(header.topBarBg || header.topBarBgImage || header.topBarColor) && (
              <div
                className="rounded-xl h-8 flex items-center justify-center overflow-hidden"
                style={{
                  background: header.topBarBg || '#0a1628',
                  ...(header.topBarBgImage ? { backgroundImage: `url(${header.topBarBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {})
                }}
              >
                <span className="text-[11px]" style={{ color: header.topBarColor || '#fff' }}>
                  {messages[0] || t('topBar.msg1')}
                </span>
              </div>
            )}
            <div className="space-y-2">
              {messages.length === 0 && (
                <p className="text-xs text-slate-400 px-1">{t('admin.header.defaultMessages')}</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <TextInput
                    value={m}
                    onChange={(e) => setHeader({ topBarMessages: messages.map((x, xi) => (xi === i ? e.target.value : x)) })}
                  />
                  <button
                    onClick={() => setHeader({ topBarMessages: messages.filter((_, xi) => xi !== i) })}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 shrink-0"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <TextInput
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder={t('admin.header.newMessage')}
                  onKeyDown={(e) => e.key === 'Enter' && addMessage()}
                />
                <Button variant="outline" size="sm" onClick={addMessage} className="shrink-0">
                  <Icon name="plus" size={14} /> {t('admin.common.add')}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card title={t('admin.header.logo')} subtitle={t('admin.header.logoHint')}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label={t('admin.appearance.siteName')}>
                <TextInput value={settings.siteName} onChange={(e) => setSetting('siteName', e.target.value)} />
              </Field>
              <Field label={t('admin.appearance.siteSuffix')}>
                <TextInput value={settings.siteSuffix} onChange={(e) => setSetting('siteSuffix', e.target.value)} />
              </Field>
            </div>
            <Field label={t('admin.header.font')} hint={t('admin.header.fontHint')}>
              <div className="grid grid-cols-3 gap-2">
                {HEADER_FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setHeader({ logoFont: f.id })}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                      font.id === f.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                    style={f.family ? { fontFamily: f.family } : undefined}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={`${t('admin.header.logoSize')} — ${(header.logoSize || 2.4).toFixed(1)}rem`} hint={t('admin.header.logoSizeHint')}>
              <input
                type="range"
                min="1.4"
                max="3.4"
                step="0.1"
                value={header.logoSize || 2.4}
                onChange={(e) => setHeader({ logoSize: Number(e.target.value) })}
                className="w-full accent-brand-600"
              />
            </Field>
            <div
              className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-6"
              style={{
                ...(header.barBg ? { background: header.barBg } : {}),
                ...(header.barBgImage ? { backgroundImage: `url(${header.barBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {})
              }}
            >
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">{t('admin.appearance.preview')}</p>
              <span
                className={`${font.family ? '' : 'font-display'} font-extrabold tracking-tight text-midnight-900 leading-none`}
                style={{
                  fontSize: `${header.logoSize || 2.4}rem`,
                  ...(font.family ? { fontFamily: font.family } : {})
                }}
              >
                {settings.siteName} <span className="text-brand-600">{settings.siteSuffix}</span>
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card title={t('admin.header.barBg')} subtitle={t('admin.header.barBgHint')}>
          <div className="space-y-4">
            <ColorField label={t('admin.header.barBgColor')} value={header.barBg} onChange={(v) => setHeader({ barBg: v })} clearLabel={t('admin.header.clear')} />
            <div
              className="rounded-2xl border border-slate-100 h-20 flex items-center px-5 overflow-hidden"
              style={{
                background: header.barBg || '#ffffff',
                ...(header.barBgImage ? { backgroundImage: `url(${header.barBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {})
              }}
            >
              <span className="text-[10px] uppercase tracking-widest bg-white/80 rounded px-2 py-0.5 text-slate-400">{t('admin.appearance.preview')}</span>
            </div>
          </div>
        </Card>

        <Card title={t('admin.header.elements')} subtitle={t('admin.header.elementsHint')}>
          <div className="space-y-2.5">
            {HEADER_TOGGLES.map((tg) => (
              <div key={tg.key} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-midnight-50 text-midnight-700">
                    <Icon name={tg.icon} size={16} />
                  </span>
                  <span className="text-sm font-semibold text-midnight-900">{t(`admin.header.toggles.${tg.key}`)}</span>
                </div>
                <Toggle checked={header[tg.key] !== false} onChange={(v) => setHeader({ [tg.key]: v })} />
              </div>
            ))}
          </div>
        </Card>

        <Card title={t('admin.header.customLinks')} subtitle={t('admin.header.customLinksHint')}>
          <div className="space-y-3">
            {customLinks.map((l) => (
              <div key={l.id} className="flex items-center gap-2">
                <TextInput
                  value={l.label}
                  onChange={(e) =>
                    setHeader({ customLinks: customLinks.map((x) => (x.id === l.id ? { ...x, label: e.target.value } : x)) })
                  }
                />
                <TextInput
                  value={l.to}
                  dir="ltr"
                  onChange={(e) =>
                    setHeader({ customLinks: customLinks.map((x) => (x.id === l.id ? { ...x, to: e.target.value } : x)) })
                  }
                />
                <button
                  onClick={() => setHeader({ customLinks: customLinks.filter((x) => x.id !== l.id) })}
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 shrink-0"
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <TextInput
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                placeholder={t('admin.header.linkLabel')}
              />
              <TextInput
                value={newLink.to}
                dir="ltr"
                onChange={(e) => setNewLink({ ...newLink, to: e.target.value })}
                placeholder="/deals"
              />
              <Button variant="outline" size="sm" onClick={addLink} className="shrink-0">
                <Icon name="plus" size={14} /> {t('admin.common.add')}
              </Button>
            </div>
            <Button onClick={() => toast(t('admin.common.saved'))}>{t('admin.common.save')}</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
