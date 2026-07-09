/**
 * Login page
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function Login() {
  const navigate  = useNavigate()
  const setAuth   = useAuthStore((s) => s.setAuth)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { access_token } = res.data
      // Fetch user info
      const me = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      }).catch(() => ({ data: { id: '', email, display_name: email } }))
      setAuth(access_token, me.data)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎙️</div>
          <h1 className="font-display text-3xl font-bold gradient-text">Rehearsal Room</h1>
          <p className="text-surface-400 mt-2">AI-powered interview coaching</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-surface-300 mb-1">Email</label>
              <input
                id="email-input"
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-700 border border-surface-600 rounded-lg px-4 py-2.5 
                           text-white placeholder-surface-500 focus:outline-none focus:border-brand-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-surface-300 mb-1">Password</label>
              <input
                id="password-input"
                type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-700 border border-surface-600 rounded-lg px-4 py-2.5 
                           text-white placeholder-surface-500 focus:outline-none focus:border-brand-500"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <button
              id="login-btn"
              type="submit" disabled={loading}
              className="py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl 
                         transition-all glow-brand disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-sm text-surface-400 text-center mt-4">
            No account?{' '}
            <Link to="/register" className="text-brand-400 hover:underline">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
