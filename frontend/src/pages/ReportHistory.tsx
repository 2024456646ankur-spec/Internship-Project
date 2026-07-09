/**
 * ReportHistory — list of all past completed sessions.
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@/lib/api'

interface ReportSummary {
  session_id: string
  generated_at?: string
  engagement_summary?: { avg_engagement?: number }
  report_markdown?: string
}

export default function ReportHistory() {
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reports/')
      .then((r) => setReports(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="font-display text-3xl font-bold gradient-text mb-8">Report History</h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-surface-400">
          <div className="text-4xl mb-3">📋</div>
          <p>No completed sessions yet.</p>
          <Link to="/setup" className="mt-4 inline-block text-brand-400 hover:underline">
            Start your first session →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((r) => (
            <motion.div
              key={r.session_id}
              whileHover={{ x: 4 }}
              className="glass rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <div className="text-sm text-surface-400 mb-1">
                  {r.generated_at ? new Date(r.generated_at).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—'}
                </div>
                <div className="text-white font-medium">Session {r.session_id.slice(0, 8)}…</div>
              </div>
              <Link
                to={`/report/${r.session_id}`}
                className="px-4 py-1.5 text-sm bg-brand-700 hover:bg-brand-600 text-white rounded-lg transition-colors"
              >
                View Report →
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
