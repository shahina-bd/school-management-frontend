import { defineStore } from 'pinia'
import authService from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.login(credentials)
        const token = response.token || response.access_token || response.data?.token
        const user = response.user || response.data?.user || { name: 'Admin User', email: credentials.email, role: 'Admin' }

        this.token = token || 'dummy-token'
        this.user = user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        return response
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed. Please check your credentials.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.register(userData)
        const token = response.token || response.access_token || response.data?.token || 'dummy-token'
        const user = response.user || response.data?.user || {
          name: userData.name,
          email: userData.email,
          role: userData.role || 'Staff',
        }

        this.token = token
        this.user = user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        return response
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed. Please try again.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      try {
        if (this.token && this.token !== 'dummy-token') {
          await authService.logout().catch(() => {})
        }
      } finally {
        this.token = null
        this.user = null
        this.loading = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    async fetchUser() {
      if (!this.token || this.token === 'dummy-token') return
      this.loading = true
      try {
        const response = await authService.getUser()
        this.user = response.user || response.data || response
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch user'
      } finally {
        this.loading = false
      }
    },
  },
})
