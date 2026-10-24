import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '../../context/StoreContext.jsx'
import { SectionTitle, Card, Field, TextInput, Textarea, Button, Toggle, Badge, Stat, Bar, Empty } from '../ui.jsx'
import Icon from '../../components/Icons.jsx'

const POSITIVE_WORDS = [
  'love', 'loved', 'great', 'excellent', 'amazing', 'perfect', 'beautiful', 'flawless', 'superb', 'wonderful',
  'fantastic', 'good', 'best', 'happy', 'recommend', 'impeccable', 'gorgeous', 'stunning',
  'ممتاز', 'ممتازة', 'رائع', 'رائعة', 'جميل', 'جميلة', 'مذهل', 'أحب', 'احب', 'سعيد', 'مثالي', 'شكرا',
  'سريع', 'أفضل', 'افضل', 'ممتازه', 'خدمة رائعة', 'تعامل راقي', 'انصح', 'أنصح'
]

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'awful', 'worst', 'hate', 'disappointed', 'broken', 'late', 'never', 'poor', 'issue',
  'problem', 'refund', 'charged', 'scam', 'fake', 'slow', 'rude',
  'سيئ', 'سيئة', 'مؤسف', 'متأخر', 'مشكلة', 'غاضب', 'أسوأ', 'اسوأ', 'زعلان', 'مكسور', 'مزيف', 'تأخر',
  'لم يصل', 'لم تصل', 'سيء', 'خايب', 'مخيب', 'استرداد'
]

function sentimentScore(text, rating) {
  const norm = String(text || '').toLowerCase()
  let score = 0
  for (const w of POSITIVE_WORDS) if (norm.includes(w)) score += 1
  for (const w of NEGATIVE_WORDS) if (norm.includes(w)) score -= 1
  if (rating >= 4) score += 1
  else if (rating && rating <= 2) score -= 1
  return score
}

function orderTotal(o) {
  if (typeof o.total === 'number') return o.total
  if (typeof o.subtotal === 'number') return o.subtotal
  return (o.items || []).reduce((s, i) => s + (i.product?.price || i.price || 0) * (i.qty || 1), 0)
}

export default function AI() {
  const { t } = useTranslation()
  const { siteData, updateSite, toast, reviews, tickets, orders, users, products, formatPrice } = useStore()
  const ai = siteData.ai || {}
  const [tab, setTab] = useState('assistant')

  const setAi = (patch) => updateSite((prev) => ({ ...prev, ai: { ...prev.ai, ...patch } }))

  const suggestions = ai.suggestions || []
  const faqs = ai.faqs || []
  const [newSuggestion, setNewSuggestion] = useState('')

  const setFaq = (id, patch) => setAi({ faqs: faqs.map((f) => (f.id === id ? { ...f, ...patch } : f)) })
  const addFaq = () => setAi({ faqs: [...faqs, { id: `f${Date.now()}`, q: '', a: '' }] })
  const removeFaq = (id) => setAi({ faqs: faqs.filter((f) => f.id !== id) })

  // ---- Sentiment analysis ----
  const sentiment = useMemo(() => {
    const analyzedReviews = (reviews || []).map((r) => ({
      ...r,
      score: sentimentScore(r.comment, r.rating)
    }))
    const analyzedTickets = (tickets || []).map((tk) => ({
      ...tk,
      score: sentimentScore((tk.messages || []).join(' '))
    }))
    const pos = analyzedReviews.filter((r) => r.score > 0).length
    const neg = analyzedReviews.filter((r) => r.score < 0).length
    const neu = analyzedReviews.length - pos - neg
    const angryTickets = analyzedTickets.filter((tk) => tk.score < 0 && tk.status !== 'closed')
    const avg = analyzedReviews.length
      ? analyzedReviews.reduce((s, r) => s + r.score, 0) / analyzedReviews.length
      : 0
    return { analyzedReviews, analyzedTickets, pos, neg, neu, angryTickets, avg }
  }, [reviews, tickets])

  // ---- Behavior analysis ----
  const behavior = useMemo(() => {
    const list = orders || []
    const totals = list.map(orderTotal)
    const revenue = totals.reduce((s, v) => s + v, 0)
    const avgOrder = list.length ? revenue / list.length : 0

    const byEmail = {}
    for (const o of list) {
      const email = (o.email || 'guest').toLowerCase()
      byEmail[email] = byEmail[email] || { count: 0, total: 0 }
      byEmail[email].count += 1
      byEmail[email].total += orderTotal(o)
    }
    const repeat = Object.values(byEmail).filter((c) => c.count > 1).length

    const catCount = {}
    for (const o of list) {
      for (const item of o.items || []) {
        const cat = item.product?.category || item.category
        if (cat) catCount[cat] = (catCount[cat] || 0) + (item.qty || 1)
      }
    }
    const topCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 6)
    const maxCat = topCats[0]?.[1] || 1

    const topCustomers = (users || [])
      .filter((u) => (u.spent || 0) > 0)
      .sort((a, b) => (b.spent || 0) - (a.spent || 0))
      .slice(0, 5)

    const insights = []
    if (repeat > 0) insights.push({ icon: 'refresh', key: 'repeat', value: repeat })
    const pendingReviews = (reviews || []).filter((r) => r.status === 'pending').length
    if (pendingReviews) insights.push({ icon: 'star', key: 'pendingReviews', value: pendingReviews })
    const openTickets = (tickets || []).filter((tk) => tk.status === 'open').length
    if (openTickets) insights.push({ icon: 'chat', key: 'openTickets', value: openTickets })
    const lowStock = (products || []).filter((p) => (p.stock ?? 0) <= (siteData.settings?.lowStockThreshold || 50)).length
    if (lowStock) insights.push({ icon: 'box', key: 'lowStock', value: lowStock })

    return { count: list.length, revenue, avgOrder, repeat, byEmail, topCats, maxCat, topCustomers, insights }
  }, [orders, users, reviews, tickets, products, siteData.settings])

  // ---- Fraud detection ----
  const fraud = useMemo(() => {
    const threshold = Number(ai.fraudThreshold) > 0 ? Number(ai.fraudThreshold) : Math.max(2000, behavior.avgOrder * 3)
    const flags = []
    const list = orders || []

    const byEmailDay = {}
    for (const o of list) {
      const email = (o.email || 'guest').toLowerCase()
      const day = String(o.date || '').slice(0, 10)
      const key = `${email}|${day}`
      byEmailDay[key] = byEmailDay[key] || { count: 0, orders: [] }
      byEmailDay[key].count += 1
      byEmailDay[key].orders.push(o)
    }

    for (const o of list) {
      const total = orderTotal(o)
      const email = (o.email || '').toLowerCase()
      const day = String(o.date || '').slice(0, 10)

      if (total > threshold) {
        flags.push({ id: `hv-${o.id}`, severity: 'high', reason: 'highValue', order: o, detail: total })
      }
      if (byEmailDay[`${email}|${day}`]?.count >= 3) {
        flags.push({ id: `burst-${o.id}`, severity: 'medium', reason: 'orderBurst', order: o, detail: byEmailDay[`${email}|${day}`].count })
      }
      const u = (users || []).find((x) => x.email?.toLowerCase() === email)
      if (u) {
        const joined = new Date(u.joined)
        const ordered = new Date(o.date)
        const days = (ordered - joined) / 86400000
        if (days >= 0 && days < 7 && total > threshold * 0.5) {
          flags.push({ id: `new-${o.id}`, severity: 'medium', reason: 'newAccountHighOrder', order: o, detail: Math.round(days) })
        }
        if (u.status === 'suspended') {
          flags.push({ id: `susp-${o.id}`, severity: 'high', reason: 'suspendedUser', order: o, detail: u.name })
        }
      }
      if (o.status === 'cancelled' && total > threshold * 0.5) {
        flags.push({ id: `cxl-${o.id}`, severity: 'low', reason: 'cancelledHighValue', order: o, detail: total })
      }
    }

    const seen = new Set()
    const unique = flags.filter((f) => (seen.has(f.id) ? false : seen.add(f.id)))
    const high = unique.filter((f) => f.severity === 'high').length
    return { flags: unique, high, threshold }
  }, [orders, users, ai.fraudThreshold, behavior.avgOrder])

  const tabs = [
    { key: 'assistant', label: t('admin.ai.tabs.assistant') },
    { key: 'sentiment', label: t('admin.ai.tabs.sentiment') },
    { key: 'behavior', label: t('admin.ai.tabs.behavior') },
    { key: 'fraud', label: t('admin.ai.tabs.fraud') }
  ]

  const severityTone = { high: 'red', medium: 'amber', low: 'gray' }
  const sentimentTone = (s) => (s > 0 ? 'green' : s < 0 ? 'red' : 'gray')

  return (
    <div>
      <SectionTitle title={t('admin.ai.title')} subtitle={t('admin.ai.subtitle')} />

      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === tb.key ? 'bg-midnight-900 text-white' : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-300'}`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'assistant' && (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card
              title={t('admin.ai.assistant')}
              subtitle={t('admin.ai.assistantSub')}
              actions={<Badge tone={ai.enabled !== false ? 'green' : 'gray'}>{ai.enabled !== false ? t('admin.common.enabled') : t('admin.common.disabled')}</Badge>}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${ai.enabled !== false ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-400'}`}>
                      <Icon name="sparkle" size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-midnight-900">{t('admin.ai.enabled')}</p>
                      <p className="text-xs text-slate-400">{t('admin.ai.enabledHint')}</p>
                    </div>
                  </div>
                  <Toggle checked={ai.enabled !== false} onChange={(v) => setAi({ enabled: v })} />
                </div>

                <Field label={t('admin.ai.name')}>
                  <TextInput value={ai.name || ''} onChange={(e) => setAi({ name: e.target.value })} />
                </Field>
                <Field label={t('admin.ai.welcome')} hint={t('admin.ai.welcomeHint')}>
                  <Textarea rows={3} value={ai.welcome || ''} onChange={(e) => setAi({ welcome: e.target.value })} />
                </Field>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon name="whatsapp" size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-midnight-900">{t('admin.ai.whatsappFallback')}</p>
                      <p className="text-xs text-slate-400">{t('admin.ai.whatsappFallbackHint')}</p>
                    </div>
                  </div>
                  <Toggle checked={ai.whatsappFallback !== false} onChange={(v) => setAi({ whatsappFallback: v })} />
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card title={t('admin.ai.suggestions')} subtitle={t('admin.ai.suggestionsHint')}>
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <TextInput
                        value={s}
                        onChange={(e) => setAi({ suggestions: suggestions.map((x, xi) => (xi === i ? e.target.value : x)) })}
                      />
                      <button
                        onClick={() => setAi({ suggestions: suggestions.filter((_, xi) => xi !== i) })}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 shrink-0"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <TextInput
                      value={newSuggestion}
                      onChange={(e) => setNewSuggestion(e.target.value)}
                      placeholder={t('admin.ai.newSuggestion')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newSuggestion.trim()) {
                          setAi({ suggestions: [...suggestions, newSuggestion.trim()] })
                          setNewSuggestion('')
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => {
                        if (!newSuggestion.trim()) return
                        setAi({ suggestions: [...suggestions, newSuggestion.trim()] })
                        setNewSuggestion('')
                      }}
                    >
                      <Icon name="plus" size={14} /> {t('admin.common.add')}
                    </Button>
                  </div>
                </div>
              </Card>

              <Card title={t('admin.ai.preview')} subtitle={t('admin.ai.previewSub')}>
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center gap-3 bg-midnight-900 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Icon name="sparkle" size={14} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{ai.name || 'Assistant'}</p>
                      <p className="text-[10px] text-emerald-300">{t('admin.ai.online')}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 space-y-3">
                    <div className="max-w-[85%] rounded-2xl rounded-ts-sm bg-white border border-slate-100 px-3.5 py-2.5 text-sm text-slate-700 shadow-sm">
                      {ai.welcome || t('admin.ai.welcome')}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.slice(0, 3).map((s, i) => (
                        <span key={i} className="rounded-full border border-brand-200 bg-brand-50 text-brand-700 px-3 py-1 text-xs font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <Card
              title={t('admin.ai.faqs')}
              subtitle={t('admin.ai.faqsHint')}
              actions={<Button variant="outline" size="sm" onClick={addFaq}><Icon name="plus" size={14} /> {t('admin.ai.addFaq')}</Button>}
            >
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={f.id} className="border border-slate-100 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">{t('admin.ai.faq')} {i + 1}</span>
                      <button onClick={() => removeFaq(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600">
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                    <Field label={t('admin.ai.faqQ')} hint={t('admin.ai.faqQHint')}>
                      <TextInput value={f.q} onChange={(e) => setFaq(f.id, { q: e.target.value })} />
                    </Field>
                    <Field label={t('admin.ai.faqA')}>
                      <Textarea rows={2} value={f.a} onChange={(e) => setFaq(f.id, { a: e.target.value })} />
                    </Field>
                  </div>
                ))}
                {faqs.length === 0 && <p className="text-sm text-slate-400 text-center py-4">{t('admin.ai.noFaqs')}</p>}
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === 'sentiment' && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <Stat icon="star" label={t('admin.ai.sent.positive')} value={sentiment.pos} color="bg-emerald-600" hint={t('admin.ai.sent.ofReviews', { count: reviews.length })} />
            <Stat icon="minus" label={t('admin.ai.sent.neutral')} value={sentiment.neu} color="bg-slate-400" />
            <Stat icon="info" label={t('admin.ai.sent.negative')} value={sentiment.neg} color="bg-red-600" />
            <Stat icon="chat" label={t('admin.ai.sent.angryTickets')} value={sentiment.angryTickets.length} color="bg-amber-500" hint={t('admin.ai.sent.angryHint')} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card title={t('admin.ai.sent.reviews')} subtitle={t('admin.ai.sent.reviewsSub')}>
              <div className="space-y-2.5">
                {sentiment.analyzedReviews.map((r) => (
                  <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500 mt-0.5">
                      <Icon name="star" size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-midnight-900 truncate">{r.author}</p>
                        <Badge tone={sentimentTone(r.score)}>
                          {r.score > 0 ? t('admin.ai.sent.positive') : r.score < 0 ? t('admin.ai.sent.negative') : t('admin.ai.sent.neutral')}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.comment}</p>
                    </div>
                  </div>
                ))}
                {sentiment.analyzedReviews.length === 0 && <Empty icon="star" title={t('admin.ai.sent.empty')} />}
              </div>
            </Card>

            <Card title={t('admin.ai.sent.tickets')} subtitle={t('admin.ai.sent.ticketsSub')}>
              <div className="space-y-2.5">
                {sentiment.analyzedTickets.map((tk) => (
                  <div key={tk.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5 ${tk.score < 0 ? 'bg-red-50 text-red-500' : 'bg-midnight-50 text-midnight-700'}`}>
                      <Icon name="chat" size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-midnight-900 truncate">{tk.subject}</p>
                        <Badge tone={sentimentTone(tk.score)}>
                          {tk.score > 0 ? t('admin.ai.sent.positive') : tk.score < 0 ? t('admin.ai.sent.negative') : t('admin.ai.sent.neutral')}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{tk.customer} · {tk.status}</p>
                    </div>
                  </div>
                ))}
                {sentiment.analyzedTickets.length === 0 && <Empty icon="chat" title={t('admin.ai.sent.empty')} />}
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === 'behavior' && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <Stat icon="cart" label={t('admin.ai.beh.totalOrders')} value={behavior.count} />
            <Stat icon="chart" label={t('admin.ai.beh.avgOrder')} value={formatPrice(behavior.avgOrder)} color="bg-emerald-600" />
            <Stat icon="refresh" label={t('admin.ai.beh.repeatCustomers')} value={behavior.repeat} color="bg-midnight-700" hint={t('admin.ai.beh.repeatHint')} />
            <Stat icon="user" label={t('admin.ai.beh.customers')} value={Object.keys(behavior.byEmail).length} color="bg-brand-600" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card title={t('admin.ai.beh.insights')} subtitle={t('admin.ai.beh.insightsSub')}>
              <div className="space-y-2.5">
                {behavior.insights.map((ins) => (
                  <div key={ins.key} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
                      <Icon name={ins.icon} size={18} />
                    </span>
                    <p className="text-sm text-slate-700">{t(`admin.ai.beh.insight_${ins.key}`, { count: ins.value })}</p>
                  </div>
                ))}
                {behavior.insights.length === 0 && <Empty icon="sparkle" title={t('admin.ai.beh.noInsights')} />}
              </div>
            </Card>

            <Card title={t('admin.ai.beh.topCategories')} subtitle={t('admin.ai.beh.topCategoriesSub')}>
              <div className="space-y-4">
                {behavior.topCats.map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-midnight-900">{t(`categories.${cat}`, { defaultValue: cat })}</span>
                      <span className="text-xs text-slate-400">{count}</span>
                    </div>
                    <Bar value={count} max={behavior.maxCat} />
                  </div>
                ))}
                {behavior.topCats.length === 0 && <Empty icon="chart" title={t('admin.ai.beh.noData')} />}
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <Card title={t('admin.ai.beh.topCustomers')} subtitle={t('admin.ai.beh.topCustomersSub')}>
              <div className="space-y-2.5">
                {behavior.topCustomers.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-midnight-900 text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-midnight-900 truncate">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                    <div className="text-end">
                      <p className="text-sm font-bold text-brand-600">{formatPrice(u.spent || 0)}</p>
                      <p className="text-[11px] text-slate-400">{u.orders} {t('admin.users.orders')}</p>
                    </div>
                  </div>
                ))}
                {behavior.topCustomers.length === 0 && <Empty icon="user" title={t('admin.ai.beh.noData')} />}
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === 'fraud' && (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Stat icon="shield" label={t('admin.ai.fraud.flagged')} value={fraud.flags.length} color={fraud.flags.length ? 'bg-red-600' : 'bg-emerald-600'} />
            <Stat icon="info" label={t('admin.ai.fraud.highRisk')} value={fraud.high} color="bg-red-600" />
            <Card className="!shadow-soft">
              <Field label={t('admin.ai.fraud.threshold')} hint={t('admin.ai.fraud.thresholdHint')}>
                <TextInput
                  type="number"
                  dir="ltr"
                  value={ai.fraudThreshold ?? ''}
                  placeholder={String(Math.round(Math.max(2000, behavior.avgOrder * 3)))}
                  onChange={(e) => setAi({ fraudThreshold: e.target.value === '' ? null : Number(e.target.value) })}
                />
              </Field>
            </Card>
          </div>

          <Card title={t('admin.ai.fraud.list')} subtitle={t('admin.ai.fraud.listSub')}>
            <div className="space-y-2.5">
              {fraud.flags.map((f) => (
                <div key={f.id} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${f.severity === 'high' ? 'bg-red-50 text-red-600' : f.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                    <Icon name="shield" size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-midnight-900">{t(`admin.ai.fraud.reason_${f.reason}`)}</p>
                      <Badge tone={severityTone[f.severity]}>{t(`admin.ai.fraud.sev_${f.severity}`)}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {t('admin.common.code')} {f.order.id} · {f.order.email || '—'} · {formatPrice(orderTotal(f.order))}
                    </p>
                  </div>
                </div>
              ))}
              {fraud.flags.length === 0 && (
                <Empty icon="shield" title={t('admin.ai.fraud.clean')} subtitle={t('admin.ai.fraud.cleanSub')} />
              )}
            </div>
          </Card>
        </>
      )}

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={() => toast(t('admin.common.saved'))}>{t('admin.common.save')}</Button>
      </div>
    </div>
  )
}
