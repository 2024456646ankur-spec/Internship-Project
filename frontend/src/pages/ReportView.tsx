/**
 * ReportView — displays the full AI-generated post-session report.
 * Polls the report endpoint until status === 'done'.
 * Renders Markdown with react-markdown + remark-gfm.
 * Shows engagement graph with recharts.
 */
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DOMPurify from 'dompurify'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import api from '@/lib/api'

interface Report {
  session_id: string
  status: string
  generated_at?: string
  engagement_summary?: {
    eye_contact_pct: number
    avg_blink_rate:  number
    smile_frequency: number
    head_steadiness: number
    engagement_over_time: { minute: number; score: number }[]
  }
  question_analyses?: {
    question_text: string
    score_out_of_10: number
    feedback: string
    missed_concepts: string[]
  }[]
  report_markdown?: string
  improvement_plan_markdown?: string
}

export default function ReportView() {
  const { id }      = useParams<{ id: string }>()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  // Poll until done
  useEffect(() => {
    if (!id) return
    let cancelled = false
    const poll = async () => {
      try {
        const res = await api.get(`/reports/${id}`)
        if (cancelled) return
        setReport(res.data)
        if (res.data.status !== 'done' && res.data.status !== 'failed') {
          setTimeout(poll, 3000)
        } else {
          setLoading(false)
        }
      } catch {
        setLoading(false)
      }
    }
    poll()
    return () => { cancelled = true }
  }, [id])

  if (loading && report?.status !== 'done') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full"
        />
        <p className="text-surface-400">
          {report?.status === 'generating' ? 'Gemini is analyzing your session…' : 'Loading report…'}
        </p>
      </div>
    )
  }

  if (!report || report.status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-surface-400">
        <div className="text-4xl mb-3">❌</div>
        <p>Report generation failed. Please try again.</p>
        <Link to="/" className="mt-4 text-brand-400 hover:underline">← Dashboard</Link>
      </div>
    )
  }

  const eng = report.engagement_summary
  const sanitizedMd = DOMPurify.sanitize(report.report_markdown ?? '')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold gradient-text">Session Report</h1>
          <p className="text-surface-400 text-sm mt-1">
            Generated {report.generated_at ? new Date(report.generated_at).toLocaleString() : '—'}
          </p>
        </div>
        <Link to="/history" className="text-brand-400 hover:text-brand-300 text-sm">
          ← History
        </Link>
      </div>

      {/* Engagement summary cards */}
      {eng && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Engagement Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Eye Contact',     value: `${(eng.eye_contact_pct * 100).toFixed(0)}%`, icon: '👁️' },
              { label: 'Blink Rate',      value: `${eng.avg_blink_rate.toFixed(1)}/min`,        icon: '👀' },
              { label: 'Smile Rate',      value: `${eng.smile_frequency.toFixed(1)}/min`,       icon: '😊' },
              { label: 'Head Steadiness', value: `${(eng.head_steadiness * 100).toFixed(0)}%`, icon: '🎯' },
            ].map((m) => (
              <div key={m.label} className="glass rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <div className="text-xl font-bold gradient-text">{m.value}</div>
                  <div className="text-xs text-surface-400">{m.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Engagement over time chart */}
          {eng.engagement_over_time?.length > 0 && (
            <div className="glass rounded-2xl p-4">
              <h3 className="text-sm font-medium text-surface-300 mb-3">Engagement Over Time</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={eng.engagement_over_time}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="minute" stroke="#8b949e" tick={{ fontSize: 11 }} label={{ value: 'min', position: 'insideRight', offset: -5 }} />
                  <YAxis domain={[0, 1]} stroke="#8b949e" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8 }}
                    labelStyle={{ color: '#8b949e' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#5c7cfa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      )}

      {/* Question analyses */}
      {report.question_analyses && report.question_analyses.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Question-by-Question</h2>
          <div className="flex flex-col gap-4">
            {report.question_analyses.map((qa, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-surface-400">Q{i + 1}</span>
                  <span className={`text-lg font-bold ${qa.score_out_of_10 >= 7 ? 'text-green-400' : qa.score_out_of_10 >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {qa.score_out_of_10}/10
                  </span>
                </div>
                <p className="text-white font-medium mb-2">{qa.question_text}</p>
                <p className="text-surface-400 text-sm mb-3">{qa.feedback}</p>
                {qa.missed_concepts?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {qa.missed_concepts.map((c, j) => (
                      <span key={j} className="px-2 py-0.5 text-xs bg-red-900/40 text-red-300 rounded-full border border-red-800">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full Markdown Report */}
      {report.report_markdown && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Full Analysis</h2>
          <div className="glass rounded-2xl p-6 report-prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {sanitizedMd}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Improvement Plan */}
      {report.improvement_plan_markdown && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">📈 Improvement Plan</h2>
          <div className="glass rounded-2xl p-6 border border-brand-800 report-prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {DOMPurify.sanitize(report.improvement_plan_markdown)}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </motion.div>
  )
}
