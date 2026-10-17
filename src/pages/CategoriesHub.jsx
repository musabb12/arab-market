import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '../context/StoreContext.jsx'
import CircleLink from '../components/CircleLink.jsx'
import { subcategoryLabel, subcategoryImage } from '../utils/catalog.js'
import Icon from '../components/Icons.jsx'

/** Full mobile/desktop categories hub — circular icons for every section and branch. */
export default function CategoriesHub() {
  const { t } = useTranslation()
  const { categories, user, settings } = useStore()
  const [openId, setOpenId] = useState(categories[0]?.id || null)
  const canBrowse = Boolean(user) || settings?.requireLogin === false
  const open = categories.find((c) => c.id === openId) || categories[0]

  const gate = (to) => (canBrowse ? to : '/login')
  const gateState = (to) => (canBrowse ? undefined : { from: to })

  return (
    <div className="bg-white dark:bg-midnight-950 min-h-[70vh]">
      <div className="max-w-7xl mx-auto md:px-4 md:py-8">
        <div className="md:hidden sticky top-[var(--site-nav-h)] z-20 bg-white dark:bg-midnight-950 border-b border-slate-100 dark:border-white/10 px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-midnight-900 dark:text-white">{t('mobileNav.categories')}</h1>
          <Link to="/search" className="p-2 text-midnight-900 dark:text-white" aria-label={t('search.button')}>
            <Icon name="search" size={20} />
          </Link>
        </div>

        <div className="hidden md:block mb-8">
          <h1 className="font-display text-3xl font-bold text-midnight-900 dark:text-white mb-2">{t('categories.title')}</h1>
          <p className="text-slate-500">{t('categories.subtitle')}</p>
        </div>

        <div className="md:grid md:grid-cols-[220px_1fr] md:gap-8">
          {/* Side / top category list */}
          <aside className="md:sticky md:top-28 self-start border-b md:border-b-0 md:border-e border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-midnight-900/50">
            <div className="flex md:flex-col overflow-x-auto no-scrollbar md:overflow-visible">
              {categories.map((c) => {
                const active = open?.id === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setOpenId(c.id)}
                    className={`shrink-0 md:w-full text-start px-4 py-3.5 text-[13px] font-semibold border-b-2 md:border-b-0 md:border-s-2 transition-colors ${
                      active
                        ? 'border-brand-600 text-brand-600 bg-white dark:bg-midnight-950'
                        : 'border-transparent text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-midnight-900'
                    }`}
                  >
                    {t(c.nameKey)}
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="px-3 py-5 md:px-0">
            {open && (
              <>
                <div className="flex items-center justify-between mb-5 px-1">
                  <h2 className="font-display text-xl font-bold text-midnight-900 dark:text-white">{t(open.nameKey)}</h2>
                  <Link
                    to={gate(`/category/${open.id}`)}
                    state={gateState(`/category/${open.id}`)}
                    className="text-xs font-semibold text-brand-600"
                  >
                    {t('common.seeAll')}
                  </Link>
                </div>

                <div className="grid grid-cols-5 gap-x-1 gap-y-5 mb-8">
                  {(open.subcategories || []).map((s) => (
                    <CircleLink
                      key={s}
                      to={gate(`/products?q=${encodeURIComponent(s)}&category=${open.id}`)}
                      state={gateState(`/category/${open.id}`)}
                      image={subcategoryImage(s, open.image)}
                      label={subcategoryLabel(t, s)}
                      size="sm"
                      className="w-full"
                    />
                  ))}
                </div>

                <h3 className="text-sm font-bold text-midnight-900 dark:text-white mb-4 px-1">{t('home.shopByCategory')}</h3>
                <div className="grid grid-cols-5 gap-x-1 gap-y-5">
                  {categories.map((c) => (
                    <CircleLink
                      key={c.id}
                      to={gate(`/category/${c.id}`)}
                      state={gateState(`/category/${c.id}`)}
                      image={c.image}
                      label={t(c.nameKey)}
                      size="sm"
                      className="w-full"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
