const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  try {
    return localStorage.getItem('lumina_token') || ''
  } catch {
    return ''
  }
}

export function setToken(token) {
  if (token) localStorage.setItem('lumina_token', token)
  else localStorage.removeItem('lumina_token')
}

export function getStoredToken() {
  return getToken()
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined
  })

  const text = await res.text()
  const contentType = res.headers.get('content-type') || ''
  // Netlify SPA fallback can return index.html with 200 for missing /api routes.
  if (contentType.includes('text/html') || /^\s*</.test(text)) {
    const err = new Error('API returned HTML instead of JSON (is the backend deployed?)')
    err.status = res.status
    throw err
  }

  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    const err = new Error(text || 'Invalid JSON response')
    err.status = res.status
    throw err
  }

  if (!res.ok) {
    const message =
      typeof data?.error === 'string'
        ? data.error
        : data?.error?.formErrors?.[0] ||
          (data?.error?.fieldErrors && Object.values(data.error.fieldErrors).flat()[0]) ||
          data?.message ||
          `HTTP ${res.status}`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  health: () => request('/health'),
  catalog: () => request('/catalog'),
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: () => request('/auth/me'),
  updateMe: (body) => request('/auth/me', { method: 'PATCH', body }),
  forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body }),
  checkout: (body) => request('/checkout', { method: 'POST', body }),
  myOrders: () => request('/orders/mine'),
  getOrder: (id) => request(`/orders/${id}`),
  orderBySession: (sessionId) => request(`/orders/by-session/${sessionId}`),
  trackOrder: (body) => request('/track', { method: 'POST', body }),
  applySeller: (body) => request('/seller/apply', { method: 'POST', body }),
  sellerMe: () => request('/seller/me'),
  createSellerProduct: (body) => request('/seller/products', { method: 'POST', body }),
  updateSellerProduct: (id, body) => request(`/seller/products/${id}`, { method: 'PATCH', body }),
  deleteSellerProduct: (id) => request(`/seller/products/${id}`, { method: 'DELETE' }),
  adminOverview: () => request('/admin/overview'),
  adminProducts: () => request('/admin/products'),
  adminCreateProduct: (body) => request('/admin/products', { method: 'POST', body }),
  adminUpdateProduct: (id, body) => request(`/admin/products/${id}`, { method: 'PATCH', body }),
  adminDeleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  adminSellers: () => request('/admin/sellers'),
  adminUpdateSeller: (id, body) => request(`/admin/sellers/${id}`, { method: 'PATCH', body }),
  adminOrders: () => request('/admin/orders'),
  adminUpdateOrder: (id, body) => request(`/admin/orders/${id}`, { method: 'PATCH', body }),
  adminUsers: () => request('/admin/users'),
  coupon: (code) => request(`/coupons/${encodeURIComponent(code)}`)
}

export default api
