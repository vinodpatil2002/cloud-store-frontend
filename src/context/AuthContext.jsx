import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cloudstore_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('cloudstore_token', data.token)
      localStorage.setItem('cloudstore_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('cloudstore_token', data.token)
      localStorage.setItem('cloudstore_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cloudstore_token')
    localStorage.removeItem('cloudstore_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, clearError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
