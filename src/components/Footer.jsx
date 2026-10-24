import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'
import PaymentBrand from './PaymentBrand.jsx'
import CircleLink from './CircleLink.jsx'
import { getSocialLinks, getWhatsAppUrl } from '../utils/social.js'

export default function Footer() {
  const { t } = useTranslation()
  const { categories, settings } = useStore()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const phone = settings?.phone || '+966 11 234 5678'
  const whatsappUrl = getWhatsAppUrl(settings)
  const mail = settings?.email || 'hello@ciarvip.com'
  const social = getSocialLinks(settings)

  const serviceLinks = [
    { to: '/help', key: 'footer.helpCenter' },
    { to: '/track-order', key: 'footer.trackOrder' },
    { to: '/info/returns', key: 'footer.returns' },
    { to: '/info/shipping', key: 'footer.shippingInfo' },
    { to: '/contact', key: 'footer.contactUs' }
  ]
  const accountLinks = [
    { to: '/login', key: 'footer.signIn' },
    { to: '/account/orders', key: 'footer.myOrders' },
    { to: '/wishlist', key: 'footer.wishlist' },
    { to: '/coupons', key: 'deals.couponTitle' }
  ]
  const sellLinks = [
    { to: '/sell', key: 'footer.becomeSeller' },
    { to: '/seller', key: 'footer.sellerDashboard' },
    { to: '/seller', key: 'footer.learnSelling' }
  ]
  const policyLinks = [
    { to: '/info/privacy', key: 'footer.privacy' },
    { to: '/info/terms', key: 'footer.terms' },
    { to: '/info/cookies', key: 'footer.cookies' },
    { to: '/about', key: 'footer.about' }
  ]

  return (
    <footer className="bg-midnight-900 text-slate-300 mt-auto">
      {/* Sell CTA — end of page (not in top bar), per client request */}
      <div className="border-b border-white/10 bg-gradient-to-r from-midnight-950 via-midnight-900 to-midnight-950">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-start">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-2">{t('footer.sellBadge')}</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">{t('footer.sellTitle')}</h3>
            <p className="text-sm text-slate-400 max-w-xl">{t('footer.sellSubtitle')}</p>
          </div>
          <Link
            to="/sell"
            className="shrink-0 px-8 py-3.5 rounded-full bg-brand-600 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-orange-900/30"
          >
            {t('nav.sell')}
          </Link>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white mb-2">{t('footer.newsletter')}</h3>
            <p className="text-sm text-slate-400">{t('footer.newsletterText')}</p>
          </div>
          <div>
            {subscribed ? (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl px-5 py-4 text-sm font-medium">
                <Icon name="check" size={18} />
                {t('footer.subscribed')}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email.trim()) setSubscribed(true)
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 bg-white/10 border border-white/10 rounded-full px-5 py-3.5 text-sm placeholder:text-slate-500 outline-none focus:border-brand-400 focus:bg-white/15 transition-colors"
                />
                <button type="submit" className="px-7 py-3.5 rounded-full bg-brand-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shrink-0">
                  {t('footer.subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Link columns + contact */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="mb-4">
            <span className="font-display text-4xl font-extrabold text-white tracking-tight leading-none">
              {settings?.siteName || 'Ciar'} <span className="text-brand-400">{settings?.siteSuffix || 'VIP'}</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-sm">{t('footer.aboutText')}</p>

          <div className="space-y-2.5 mb-6 text-sm">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors">
              <Icon name="phone" size={16} className="text-brand-400" />
              <span dir="ltr">{phone}</span>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors">
              <Icon name="whatsapp" size={16} className="text-emerald-400" />
              <span dir="ltr">WhatsApp · {settings?.whatsapp || '+966 50 123 4567'}</span>
            </a>
            <a href={`mailto:${mail}`} className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors">
              <Icon name="mail" size={16} className="text-brand-400" />
              <span dir="ltr">{mail}</span>
            </a>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('footer.follow')}</p>
          <div className="flex flex-wrap items-center gap-2">
            {social.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-brand-600 text-white transition-colors"
              >
                <Icon name={s.icon} size={17} />
              </a>
            ))}
          </div>
        </div>
        <FooterCol title={t('footer.customerService')} links={serviceLinks} />
        <FooterCol title={t('footer.myAccount')} links={accountLinks} />
        <FooterCol title={t('footer.sellWithUs')} links={sellLinks} />
      </div>

      {/* Circular categories strip */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 block">{t('footer.categories')}</span>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {categories.map((c) => (
              <CircleLink
                key={c.id}
                to={`/category/${c.id}`}
                image={c.image}
                label={t(c.nameKey)}
                size="sm"
                light
                className="w-[4.5rem]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
            {policyLinks.map((l) => (
              <Link key={l.key} to={l.to} className="hover:text-white transition-colors">{t(l.key)}</Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs text-slate-500">{t('footer.paymentNote')}</span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {['visa', 'mastercard', 'mada', 'amex', 'paypal'].map((brand) => (
                <span key={brand} className="flex h-10 min-w-[3.25rem] items-center justify-center rounded-lg bg-white px-2.5">
                  <PaymentBrand id={brand} size="sm" />
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {settings?.siteName || 'Ciar'} {settings?.siteSuffix || 'VIP'}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  const { t } = useTranslation()
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.key}>
            <Link to={l.to} className="text-sm text-slate-400 hover:text-white transition-colors">{t(l.key)}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
