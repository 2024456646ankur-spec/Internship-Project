/**
 * AppLayout — persistent shell wrapping all protected pages.
 * Contains sidebar nav, top bar, and the main content area (via <Outlet />).
 */
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS = [
  { to: '/',         icon: '🏠', label: 'Dashboard'   },
  { to: '/setup',    icon: '🎙️', label: 'New Session'  },
  { to: '/history',  icon: '📋', label: 'Reports'      },
  { to: '/settings', icon: '⚙️', label: 'Settings'     },
]

export default function AppLayout() {
  const user     = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="h-screen flex bg-surface-900 overflow-hidden">
      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 flex flex-col glass border-r border-surface-700">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-surface-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎙️</span>
            <span className="font-display font-bold text-lg gradient-text">Rehearsal</span>
          </div>
          <div className="text-xs text-surface-500 mt-0.5 pl-8">Room</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              id={`nav-${label.toLowerCase().replace(/\s+/, '-')}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                 ${isActive
                   ? 'bg-brand-700/60 text-white border border-brand-600/40 glow-brand'
                   : 'text-surface-400 hover:text-white hover:bg-surface-700'}`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User badge */}
        <div className="px-4 py-4 border-t border-surface-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.display_name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.display_name}</div>
              <div className="text-xs text-surface-500 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-surface-500 hover:text-red-400 transition-colors py-1"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
