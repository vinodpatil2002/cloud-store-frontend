import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    const result = await login(form.email, form.password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-10">
          <Cloud size={17} strokeWidth={1.5} className="text-neutral-400" />
          <span className="font-bold text-sm tracking-tight text-[#FAFAFA]">CloudStore</span>
        </div>

        <h1 className="text-xl font-semibold text-[#FAFAFA] mb-1">Sign in</h1>
        <p className="text-sm text-neutral-500 mb-8">Welcome back. Enter your details below.</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-neutral-400 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-neutral-500 rounded px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-neutral-600 outline-none transition-colors duration-150"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-neutral-400 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-neutral-500 rounded px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-neutral-600 outline-none transition-colors duration-150"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-danger"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-[#FAFAFA] hover:bg-[#E8E8E8] text-[#0F0F0F] text-sm font-medium py-2 rounded transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading && <Loader2 size={14} strokeWidth={2} className="animate-spin" />}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-neutral-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-neutral-300 hover:text-[#FAFAFA] transition-colors duration-150">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
