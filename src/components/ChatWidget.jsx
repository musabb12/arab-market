import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'
import { getWhatsAppUrl } from '../utils/social.js'

const INTENTS = [
  { id: 'greeting', re: /(مرحبا|اهلا|أهلا|هلا|السلام|صباح|مساء|\bhi\b|hello|hey|salut|hola)/i, reply: 'chat.replyGreeting', link: null },
  { id: 'track', re: /(تتبع|طلبي|طلب|وين|توصيل طلبي|track|order status|where is my order)/i, reply: 'chat.replyTrack', link: { to: '/track-order', labelKey: 'chat.linkTrack' } },
  { id: 'shipping', re: /(شحن|توصيل|مدة التوصيل|shipping|delivery|livraison|envío)/i, reply: 'chat.replyShipping', link: { to: '/info/shipping', labelKey: 'chat.linkShipping' } },
  { id: 'returns', re: /(ارجاع|إرجاع|استرداد|استرجاع|return|refund|retour)/i, reply: 'chat.replyReturns', link: { to: '/info/returns', labelKey: 'chat.linkReturns' } },
  { id: 'payment', re: /(دفع|بطاقة|بايبال|قسط|payment|paypal|card|checkout)/i, reply: 'chat.replyPayment', link: null },
  { id: 'coupons', re: /(كوبون|خصم|عروض|تخفيض|coupon|discount|deal|promo)/i, reply: 'chat.replyCoupons', link: { to: '/deals', labelKey: 'chat.linkDeals' } },
  { id: 'human', re: /(موظف|شخص|خدمة عملاء|عميل|بشر|human|agent|support person)/i, reply: 'chat.replyHuman', link: { to: '/contact', labelKey: 'chat.linkContact' } },
  { id: 'thanks', re: /(شكرا|شكراً|ممتاز|رائع|thanks|thank you|merci|gracias)/i, reply: 'chat.replyThanks', link: null }
]

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ً-ْٰ]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function ChatWidget() {
  const { t, i18n } = useTranslation()
  const { siteData, settings, products, brands, formatPrice } = useStore()
  const ai = siteData.ai || {}

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const timersRef = useRef([])

  const enabled = ai.enabled !== false
  const name = ai.name || t('chat.assistantName')
  const whatsappUrl = ai.whatsappFallback !== false ? getWhatsAppUrl(settings) : ''
  const suggestions = (ai.suggestions || []).filter(Boolean).slice(0, 4)

  useEffect(() => () => timersRef.current.forEach(clearTimeout), [])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: 'w', from: 'bot', text: ai.welcome || t('chat.welcome') }])
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, open])

  const productMatches = useMemo(
    () => (query) => {
      const tokens = normalize(query)
        .split(' ')
        .filter((w) => w.length >= 3)
      if (!tokens.length) return []
      const scored = []
      for (const p of products || []) {
        const brandName = (brands || []).find((b) => b.id === p.brand)?.name || p.brand || ''
        const hay = normalize(`${p.name} ${brandName} ${t(`categories.${p.category}`, { defaultValue: p.category })}`)
        const score = tokens.reduce((s, tok) => s + (hay.includes(tok) ? 1 : 0), 0)
        if (score > 0) scored.push({ p, score })
      }
      return scored
        .sort((a, b) => b.score - a.score || (b.p.rating || 0) - (a.p.rating || 0))
        .slice(0, 3)
        .map((x) => x.p)
    },
    [products, brands, t]
  )

  const buildReply = (query) => {
    const faqs = ai.faqs || []
    const qNorm = normalize(query)
    const qTokens = new Set(qNorm.split(' ').filter((w) => w.length >= 2))
    let best = null
    let bestScore = 0
    for (const f of faqs) {
      const fTokens = normalize(f.q).split(' ').filter((w) => w.length >= 2)
      if (!fTokens.length || !f.a) continue
      const score = fTokens.filter((tok) => qTokens.has(tok) || qNorm.includes(tok)).length
      if (score > bestScore) {
        bestScore = score
        best = f
      }
    }
    if (best && bestScore >= Math.min(2, normalize(best.q).split(' ').length)) {
      return { text: best.a }
    }

    for (const intent of INTENTS) {
      if (intent.re.test(query) || intent.re.test(qNorm)) {
        return { text: t(intent.reply), link: intent.link ? { to: intent.link.to, label: t(intent.link.labelKey) } : null }
      }
    }

    const found = productMatches(query)
    if (found.length) {
      return { text: t('chat.replyProducts'), products: found }
    }

    return { text: t('chat.replyFallback'), whatsapp: Boolean(whatsappUrl) }
  }

  const send = (raw) => {
    const text = (raw ?? input).trim()
    if (!text || typing) return
    setInput('')
    const userMsg = { id: `u${Date.now()}`, from: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setTyping(true)
    const reply = buildReply(text)
    const delay = Math.min(1400, 500 + (reply.text?.length || 0) * 8)
    const timer = setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { id: `b${Date.now()}`, from: 'bot', ...reply }])
    }, delay)
    timersRef.current.push(timer)
  }

  if (!enabled) return null

  const whatsappMsgUrl = getWhatsAppUrl(settings, input.trim() ? `${settings.whatsappMessage || ''} ${input}`.trim() : undefined)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={name}
        className="fixed z-40 bottom-[4.9rem] md:bottom-6 end-4 md:end-6 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-600 text-white shadow-lift hover:scale-105 active:scale-95 transition-transform"
      >
        <Icon name={open ? 'close' : 'chat'} size={22} />
        {!open && <span className="absolute -top-0.5 -end-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="fixed z-40 bottom-[9.4rem] md:bottom-24 end-3 md:end-6 w-[min(22.5rem,calc(100vw-1.5rem))] rounded-3xl bg-white dark:bg-midnight-900 border border-slate-100 dark:border-white/10 shadow-lift overflow-hidden flex flex-col"
            dir={i18n.dir()}
          >
            <div className="flex items-center gap-3 bg-midnight-900 px-4 py-3.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
                <Icon name="sparkle" size={16} />
                <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-midnight-900" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{name}</p>
                <p className="text-[10px] text-emerald-300">{t('chat.online')}</p>
              </div>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-emerald-300 hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  <Icon name="whatsapp" size={15} />
                </a>
              )}
              <button onClick={() => setOpen(false)} className="p-1.5 text-slate-400 hover:text-white" aria-label={t('common.close', { defaultValue: 'Close' })}>
                <Icon name="close" size={18} />
              </button>
            </div>

            <div ref={listRef} className="h-72 overflow-y-auto bg-slate-50 dark:bg-midnight-950 px-3.5 py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      m.from === 'user'
                        ? 'bg-brand-600 text-white rounded-be-sm'
                        : 'bg-white dark:bg-midnight-900 border border-slate-100 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-bs-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.products?.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        {m.products.map((p) => (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-midnight-950 p-2 hover:border-brand-400 transition-colors"
                          >
                            <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" loading="lazy" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-midnight-900 dark:text-white line-clamp-1">{p.name}</p>
                              <p className="text-[11px] font-bold text-brand-600">{formatPrice(p.price)}</p>
                            </div>
                            <Icon name="arrowRight" size={13} className="text-slate-400 rtl:rotate-180 shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}
                    {m.link && (
                      <Link
                        to={m.link.to}
                        onClick={() => setOpen(false)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
                      >
                        {m.link.label}
                        <Icon name="arrowRight" size={12} className="rtl:rotate-180" />
                      </Link>
                    )}
                    {m.whatsapp && whatsappUrl && (
                      <a
                        href={whatsappMsgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                      >
                        <Icon name="whatsapp" size={13} />
                        {t('chat.whatsappCta')}
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bs-sm bg-white dark:bg-midnight-900 border border-slate-100 dark:border-white/10 px-4 py-3 shadow-sm">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-slate-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {suggestions.length > 0 && messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-3.5 py-2.5 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-midnight-900">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-200 px-3 py-1 text-[11px] font-semibold hover:bg-brand-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex items-center gap-2 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-midnight-900 px-3 py-2.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                className="flex-1 bg-slate-50 dark:bg-midnight-950 border border-slate-100 dark:border-white/10 rounded-full px-4 py-2.5 text-sm text-midnight-900 dark:text-white outline-none focus:border-brand-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label={t('chat.send')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-all hover:brightness-110 disabled:opacity-40"
              >
                <Icon name="arrowRight" size={17} className="rtl:rotate-180" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
