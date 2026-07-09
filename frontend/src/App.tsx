import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppLayout from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import SessionSetup from '@/pages/SessionSetup'
import PracticeSession from '@/pages/PracticeSession'
import ReportView from '@/pages/ReportView'
import ReportHistory from '@/pages/ReportHistory'
import Settings from '@/pages/Settings'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { useAuthStore } from '@/store/authStore'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // const token = useAuthStore((s) => s.token)
  // return token ? <>{children}</> : <Navigate to="/login" replace />
  return <>{children}</> // Bypassing login for now
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index              element={<Dashboard />} />
          <Route path="/setup"      element={<SessionSetup />} />
          <Route path="/session/:id" element={<PracticeSession />} />
          <Route path="/report/:id"  element={<ReportView />} />
          <Route path="/history"     element={<ReportHistory />} />
          <Route path="/settings"    element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
