import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  res => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/users/token/refresh/', { refresh })
          localStorage.setItem('access_token', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ── API helpers ──────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/users/token/', data),
  register: (data) => api.post('/users/register/', data),
  me: () => api.get('/users/me/'),
}

export const productsAPI = {
  list: (params) => api.get('/products/', { params }),
  detail: (id) => api.get(`/products/${id}/`),
  categories: () => api.get('/products/categories/'),
}

export const cartAPI = {
  get: () => api.get('/orders/cart/'),
  add: (data) => api.post('/orders/cart/add/', data),
  update: (id, data) => api.patch(`/orders/cart/${id}/`, data),
  remove: (id) => api.delete(`/orders/cart/${id}/`),
}

export const ordersAPI = {
  list: () => api.get('/orders/'),
  detail: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/create/', data),
}

export const adminAPI = {
  stats: () => api.get('/orders/admin/stats/'),
  orders: (params) => api.get('/orders/admin/orders/', { params }),
  vendors: () => api.get('/users/vendors/'),
  updateOrder: (id, data) => api.patch(`/orders/admin/orders/${id}/`, data),
}