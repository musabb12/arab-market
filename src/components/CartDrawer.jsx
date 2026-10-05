import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext.jsx'
import { getBrand } from '../utils/helpers.js'
import Icon from './Icons.jsx'

export default function CartDrawer() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, cartSubtotal, formatPrice, user } = useStore()

  const freeShipThreshold = 99

  useEffect(() => {
    if (cartOpen && !user) {
      setCartOpen(false)
      navigate('/login', { state: { from: '/cart' } })
    }
  }, [cartOpen, user, setCartOpen, navigate])

  if (!user) return null

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-black/50"
          onClick={() => setCartOpen(false)}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-midnight-950 shadow-lift flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-midnight-900 dark:text-white">{t('cart.title')}</h2>
                <span className="text-xs font-semibold bg-slate-100 dark:bg-midnight-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 text-slate-500 hover:text-midnight-900 dark:hover:text-white transition-colors" aria-label="Close">
                <Icon name="close" size={22} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-4">
                  <Icon name="cart" size={34} className="text-slate-300" />
                </span>
                <h3 className="font-semibold text-midnight-900 mb-1">{t('cart.empty')}</h3>
                <p className="text-sm text-slate-500 mb-6">{t('cart.emptySub')}</p>
                <button onClick={() => { setCartOpen(false); navigate('/products') }} className="px-6 py-3 rounded-full bg-brand-600 text-white text-sm font-semibold">
                  {t('cart.startShopping')}
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b border-slate-50">
                      <Link to={`/product/${item.product.id}`} onClick={() => setCartOpen(false)} className="shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-600">{getBrand(item.product.brand).name}</p>
                            <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-midnight-900 line-clamp-2 hover:text-brand-600 transition-colors">
                              {item.product.name}
                            </Link>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-1 text-slate-300 hover:text-red-600 transition-colors" aria-label="Remove">
                            <Icon name="trash" size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-full">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 py-1 text-slate-500 hover:text-midnight-900" aria-label="Decrease">
                              <Icon name="minus" size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 py-1 text-slate-500 hover:text-midnight-900" aria-label="Increase">
                              <Icon name="plus" size={14} />
                            </button>
                          </div>
                          <span className="font-bold text-midnight-900 text-sm">{formatPrice(item.product.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-5 border-t border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-midnight-900/80">
                  {cartSubtotal < freeShipThreshold && (
                    <div className="mb-3 text-xs text-slate-500">
                      <div className="flex justify-between mb-1">
                        <span>{t('common.freeShipping')}</span>
                        <span className="font-semibold text-brand-600">{formatPrice(freeShipThreshold - cartSubtotal)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (cartSubtotal / freeShipThreshold) * 100)}%` }}
                          transition={{ duration: 0.6 }}
                          className="h-full bg-brand-600"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-500">{t('cart.subtotal')}</span>
                    <span className="text-xl font-bold text-midnight-900">{formatPrice(cartSubtotal)}</span>
                  </div>
                  <button
                    onClick={() => { setCartOpen(false); navigate('/checkout') }}
                    className="w-full py-3.5 rounded-full bg-brand-600 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t('cart.checkout')}
                  </button>
                  <button onClick={() => { setCartOpen(false); navigate('/products') }} className="w-full py-3 mt-2 text-sm font-medium text-midnight-900 hover:text-brand-600 transition-colors">
                    {t('cart.continueShopping')}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
