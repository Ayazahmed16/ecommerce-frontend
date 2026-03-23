import { create } from 'zustand'
import { cartAPI } from '../api/axios'
import toast from 'react-hot-toast'

export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,
  isOpen: false,

  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const { data } = await cartAPI.get()
      set({ items: data.items || [], isLoading: false })
    } catch { set({ isLoading: false }) }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      await cartAPI.add({ product_id: productId, quantity })
      await get().fetchCart()
      toast.success('Added to cart')
      set({ isOpen: true })
    } catch { toast.error('Failed to add item') }
  },

  updateItem: async (id, quantity) => {
    try {
      await cartAPI.update(id, { quantity })
      await get().fetchCart()
    } catch { toast.error('Failed to update') }
  },

  removeItem: async (id) => {
    try {
      await cartAPI.remove(id)
      await get().fetchCart()
      toast.success('Removed from cart')
    } catch { toast.error('Failed to remove') }
  },

  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  toggleCart: () => set(s => ({ isOpen: !s.isOpen })),
}))