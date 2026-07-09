/** Settings page placeholder */
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const user      = useAuthStore((s) => s.user)
  const navigate  = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold gradient-text mb-8">Settings</h1>
      <div className="glass rounded-2xl p-6 flex flex-col gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Account</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-surface-400">Name</div>
            <div className="text-white">{user?.display_name}</div>
            <div className="text-surface-400">Email</div>
            <div className="text-white">{user?.email}</div>
          </div>
        </section>
        <hr className="border-surface-700" />
        <section>
          <h2 className="text-lg font-semibold mb-3">Privacy</h2>
          <div className="glass-light rounded-xl p-4 text-sm text-surface-300 leading-relaxed">
            <strong className="text-green-400">🔒 Privacy-first design:</strong> Your webcam video is 
            processed entirely in your browser using face-api.js. No video frames are ever sent to 
            any server. Only anonymized engagement metrics (numbers like gaze coordinates and smile 
            probability) are transmitted for coaching purposes.
          </div>
        </section>
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="w-full py-2.5 border border-red-700 text-red-400 hover:bg-red-900/20 
                     rounded-xl transition-colors text-sm font-medium"
        >
          Sign Out
        </button>
      </div>
    </motion.div>
  )
}
