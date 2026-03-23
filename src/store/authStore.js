import { create } from 'zustand'
import { authAPI } from '../api/axios'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('access_token'),

  login: async (credentials) => {
    set({ isLoading: true })
    const { data } = await authAPI.login(credentials)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const me = await authAPI.me()
    set({ user: me.data, token: data.access, isAuthenticated: true, isLoading: false })
    return me.data
  },

  logout: () => {
    localStorage.clear()
    set({ user: null, token: null, isAuthenticated: false })
  },

  fetchMe: async () => {
    try {
      const { data } = await authAPI.me()
      set({ user: data, isAuthenticated: true })
    } catch {
      get().logout()
    }
  },
}))