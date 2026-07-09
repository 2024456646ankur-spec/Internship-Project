/**
 * Dashboard — landing page after login.
 * Shows quick-start cards, recent sessions, and stats.
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const SESSION_TYPES = [
  { type: 'behavioral',  label: 'Behavioral',  icon: '🧠', desc: 'STAR-method answers, soft skills', color: 'from-purple-600 to-purple-900' },
  { type: 'dsa',         label: 'DSA / Coding', icon: '💻', desc: 'LeetCode-style problems with live runner', color: 'from-brand-600 to-brand-900' },
  { type: 'viva',        label: 'Viva-Voce',    icon: '📚', desc: 'Oral exam for university subjects', color: 'from-teal-600 to-teal-900' },
  { type: 'mixed',       label: 'Full Loop',    icon: '🔁', desc: 'Mixed session like a real interview', color: 'from-accent-600 to-accent-900' },
]

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* Hero */}
      <motion.div variants={item} className="mb-10">
        <h1 className="font-display text-4xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.display_name ?? 'Candidate'}</span> 👋
        </h1>
        <p className="text-surface-400 text-lg">
          Ready to rehearse? Pick a session type below.
        </p>
      </motion.div>

      {/* Session Type Cards */}
      <motion.section variants={item} className="mb-12">
        <h2 className="text-xl font-semibold text-surface-300 mb-4">Start a Session</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SESSION_TYPES.map((s) => (
            <motion.div
              key={s.type}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/setup?type=${s.type}`}
                id={`start-${s.type}`}
                className={`block p-5 rounded-2xl bg-gradient-to-br ${s.color} 
                            border border-white/10 cursor-pointer transition-shadow 
                            hover:shadow-xl hover:glow-brand`}
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="font-semibold text-lg mb-1">{s.label}</div>
                <div className="text-sm text-white/70">{s.desc}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section variants={item} className="mb-12">
        <h2 className="text-xl font-semibold text-surface-300 mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Sessions Done',    value: '—', icon: '🎯' },
            { label: 'Avg Engagement',   value: '—', icon: '👁️' },
            { label: 'Questions Solved', value: '—', icon: '✅' },
            { label: 'Streak',           value: '—', icon: '🔥' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-5 flex items-center gap-4">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-surface-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Recent Sessions */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-surface-300">Recent Sessions</h2>
          <Link to="/history" className="text-brand-400 hover:text-brand-300 text-sm transition-colors">
            View all →
          </Link>
        </div>
        <div className="glass rounded-2xl p-6 text-center text-surface-500">
          <div className="text-4xl mb-3">🎙️</div>
          <p>No sessions yet. Start your first rehearsal above!</p>
        </div>
      </motion.section>
    </motion.div>
  )
}
