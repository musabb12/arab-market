import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Textarea, Button, Badge, Select } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'
import ImageUploader from '../../components/ImageUploader.jsx'
import { INFO_PAGES, HEADER_FONTS, TEXT_SIZES } from '../../data/siteDefaults.js'

const PAGE_LIST = [...INFO_PAGES, 'about']
const PAGE_ICONS = { privacy: 'shield', terms: 'document', returns: 'refresh', shipping: 'truck', cookies: 'sparkle', about: 'store' }

export default function Pages() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast } = useStore()
  const pages = siteData.pages || {}
  const [active, setActive] = useState('privacy')
  const isAbout = active === 'about'
  const pageLabel = (id) => (id === 'about' ? t('footer.about') : t(`info.${id}Title`))
  const pageHref = (id) => (id === 'about' ? '/about' : `/info/${id}`)

  const current = pages[active] || null

  const setPage = (patch) =>
    updateSite((prev) => ({ ...prev, pages: { ...prev.pages, [active]: { ...(prev.pages?.[active] || {}), ...patch } } }))

  const sections = current?.sections || []
  const setSection = (i, patch) => setPage({ sections: sections.map((s, si) => (si === i ? { ...s, ...patch } : s)) })
  const addSection = () => setPage({ sections: [...sections, { title: '', text: '' }] })
  const removeSection = (i) => setPage({ sections: sections.filter((_, si) => si !== i) })
  const moveSection = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= sections.length) return
    const next = [...sections]
    ;[next[i], next[j]] = [next[j], next[i]]
    setPage({ sections: next })
  }

  const resetPage = () => {
    updateSite((prev) => {
      const next = { ...(prev.pages || {}) }
      delete next[active]
      return { ...prev, pages: next }
    })
    toast(t('admin.pages.resetDone'), 'info')
  }

  const startEditing = () => {
    if (current) return
    setPage({ title: '', intro: '', sections: [{ title: '', text: '' }] })
  }

  return (
    <div>
      <SectionTitle title={t('admin.pages.title')} subtitle={t('admin.pages.subtitle')} />

      <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {PAGE_LIST.map((id) => {
          const customized = Boolean(pages[id])
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-start transition-colors ${
                active === id ? 'border-brand-600 bg-brand-50' : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active === id ? 'bg-brand-600 text-white' : 'bg-midnight-50 text-midnight-700'}`}>
                <Icon name={PAGE_ICONS[id]} size={17} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-midnight-900 truncate">{pageLabel(id)}</p>
                <Badge tone={customized ? 'green' : 'gray'} className="mt-1">
                  {customized ? t('admin.pages.customized') : t('admin.pages.default')}
                </Badge>
              </div>
            </button>
          )
        })}
      </div>

      {current ? (
        <Card
          title={pageLabel(active)}
          subtitle={t('admin.pages.editingCustom')}
          actions={
            <div className="flex items-center gap-2">
              <Link to={pageHref(active)} target="_blank" className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
                <Icon name="eye" size={14} /> {t('admin.pages.view')}
              </Link>
              <Button variant="outline" size="sm" onClick={resetPage}>{t('admin.pages.reset')}</Button>
            </div>
          }
        >
          <div className="space-y-5">
            <div className={`grid ${isAbout ? '' : 'md:grid-cols-2'} gap-4`}>
              <Field label={t('admin.pages.pageTitle')} hint={t('admin.pages.emptyFallback')}>
                <TextInput value={current.title || ''} onChange={(e) => setPage({ title: e.target.value })} />
              </Field>
              {!isAbout && (
              <Field label={t('admin.pages.pageIcon')}>
                <div className="flex gap-2">
                  {Object.values(PAGE_ICONS).map((ic) => (
                    <button
                      key={ic}
                      onClick={() => setPage({ icon: ic })}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                        (current.icon || PAGE_ICONS[active]) === ic ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <Icon name={ic} size={16} />
                    </button>
                  ))}
                </div>
              </Field>
              )}
            </div>
            <Field label={t('admin.pages.pageIntro')} hint={t('admin.pages.emptyFallback')}>
              <Textarea rows={3} value={current.intro || ''} onChange={(e) => setPage({ intro: e.target.value })} />
            </Field>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-4">
              <p className="text-sm font-bold text-midnight-900">{t('admin.pages.typography')}</p>
              <div className="grid md:grid-cols-4 gap-4">
                <Field label={t('admin.pages.font')}>
                  <Select value={current.font || 'default'} onChange={(e) => setPage({ font: e.target.value })}>
                    {HEADER_FONTS.map((f) => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </Select>
                </Field>
                <Field label={t('admin.pages.titleSize')}>
                  <Select value={current.titleSize || 'default'} onChange={(e) => setPage({ titleSize: e.target.value })}>
                    {TEXT_SIZES.map((s) => (
                      <option key={s.id} value={s.id}>{t(`admin.pages.sizes.${s.id}`)}</option>
                    ))}
                  </Select>
                </Field>
                <Field label={t('admin.pages.bodySize')}>
                  <Select value={current.bodySize || 'default'} onChange={(e) => setPage({ bodySize: e.target.value })}>
                    {TEXT_SIZES.map((s) => (
                      <option key={s.id} value={s.id}>{t(`admin.pages.sizes.${s.id}`)}</option>
                    ))}
                  </Select>
                </Field>
                <Field label={t('admin.pages.textColor')}>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={current.textColor || '#334155'}
                      onChange={(e) => setPage({ textColor: e.target.value })}
                      className="h-9 w-12 rounded-lg border border-slate-200 cursor-pointer shrink-0"
                    />
                    <TextInput dir="ltr" value={current.textColor || ''} onChange={(e) => setPage({ textColor: e.target.value })} placeholder="#334155" />
                    {current.textColor ? (
                      <button onClick={() => setPage({ textColor: '' })} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 shrink-0">
                        <Icon name="close" size={14} />
                      </button>
                    ) : null}
                  </div>
                </Field>
              </div>
            </div>

            {isAbout && (
            <div className="rounded-2xl border border-slate-100 p-4 space-y-4">
              <p className="text-sm font-bold text-midnight-900">{t('admin.pages.aboutContent')}</p>
              <Field label={t('admin.pages.storyTitle')} hint={t('admin.pages.emptyFallback')}>
                <TextInput value={current.storyTitle || ''} onChange={(e) => setPage({ storyTitle: e.target.value })} />
              </Field>
              {['story1', 'story2', 'story3'].map((k, i) => (
                <Field key={k} label={`${t('admin.pages.storyText')} ${i + 1}`} hint={t('admin.pages.emptyFallback')}>
                  <Textarea rows={2} value={current[k] || ''} onChange={(e) => setPage({ [k]: e.target.value })} />
                </Field>
              ))}
              <Field label={t('admin.pages.missionText')} hint={t('admin.pages.emptyFallback')}>
                <Textarea rows={2} value={current.missionText || ''} onChange={(e) => setPage({ missionText: e.target.value })} />
              </Field>
              <ImageUploader
                label={t('admin.pages.storyImage')}
                value={current.storyImage || ''}
                onChange={(url) => setPage({ storyImage: url })}
              />
            </div>
            )}

            {!isAbout && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-midnight-900">{t('admin.pages.sections')}</p>
                <Button variant="outline" size="sm" onClick={addSection}><Icon name="plus" size={14} /> {t('admin.pages.addSection')}</Button>
              </div>
              <div className="space-y-4">
                {sections.map((s, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">{t('admin.pages.section')} {i + 1}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveSection(i, -1)} disabled={i === 0} className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 disabled:opacity-30">
                          <Icon name="chevronDown" size={14} className="rotate-180" />
                        </button>
                        <button onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1} className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 disabled:opacity-30">
                          <Icon name="chevronDown" size={14} />
                        </button>
                        <button onClick={() => removeSection(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600">
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                    <Field label={t('admin.content.titleLabel')}>
                      <TextInput value={s.title} onChange={(e) => setSection(i, { title: e.target.value })} />
                    </Field>
                    <Field label={t('admin.pages.sectionText')}>
                      <Textarea rows={3} value={s.text} onChange={(e) => setSection(i, { text: e.target.value })} />
                    </Field>
                  </div>
                ))}
                {sections.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">{t('admin.pages.noSections')}</p>
                )}
              </div>
            </div>
            )}
          </div>
        </Card>
      ) : (
        <Card title={pageLabel(active)} subtitle={t('admin.pages.usingDefault')}>
          <div className="flex flex-col items-center py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
              <Icon name={PAGE_ICONS[active]} size={26} />
            </span>
            <p className="text-sm text-slate-500 max-w-md mb-5">{t('admin.pages.defaultHint')}</p>
            <div className="flex items-center gap-3">
              <Link to={pageHref(active)} target="_blank" className="text-sm font-semibold text-brand-600 hover:underline flex items-center gap-1.5">
                <Icon name="eye" size={15} /> {t('admin.pages.view')}
              </Link>
              <Button onClick={startEditing}><Icon name="edit" size={15} /> {t('admin.pages.customize')}</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={() => toast(t('admin.common.saved'))}>{t('admin.common.save')}</Button>
      </div>
    </div>
  )
}
