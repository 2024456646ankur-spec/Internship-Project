/**
 * SessionSetup — configure and start a practice session.
 * Upload resume (mammoth), select subject, pick difficulty.
 */
import { useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import mammoth from 'mammoth'
import api from '@/lib/api'
import { useSessionStore } from '@/store/sessionStore'
import { Question } from '@/store/sessionStore'

const SUBJECTS = [
  { id: 1, name: 'Data Structures & Algorithms', category: 'technical' },
  { id: 2, name: 'System Design',                category: 'technical' },
  { id: 3, name: 'Machine Learning',             category: 'viva'      },
  { id: 4, name: 'Frontend Development',         category: 'technical' },
  { id: 5, name: 'Behavioral (FAANG)',            category: 'behavioral'},
  { id: 6, name: 'Operating Systems',            category: 'viva'      },
  { id: 7, name: 'Database Systems',             category: 'viva'      },
  { id: 8, name: 'Computer Networks',            category: 'viva'      },
]

export default function SessionSetup() {
  const [params]        = useSearchParams()
  const navigate        = useNavigate()
  const initSession     = useSessionStore((s) => s.initSession)

  const defaultType = params.get('type') ?? 'mixed'
  const [sessionType,  setSessionType]  = useState(defaultType)
  const [subjectId,    setSubjectId]    = useState<number | null>(null)
  const [customSubject,setCustomSubject]= useState('')
  const [difficulty,   setDifficulty]  = useState('medium')
  const [count,        setCount]       = useState(5)
  const [resumeText,   setResumeText]  = useState<string | null>(null)
  const [resumeName,   setResumeName]  = useState<string | null>(null)
  const [loading,      setLoading]     = useState(false)
  const [error,        setError]       = useState<string | null>(null)

  const handleResumeUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.docx')) {
      setError('Only .docx files are supported.')
      return
    }
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result      = await mammoth.extractRawText({ arrayBuffer })
      setResumeText(result.value)
      setResumeName(file.name)
    } catch {
      setError('Failed to parse resume. Try a different file.')
    }
  }, [])

  const handleStart = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Generate questions
      const qRes = await api.post('/questions/generate', {
        role_subject_id:  subjectId,
        subject_freetext: customSubject || undefined,
        session_type:     sessionType,
        difficulty,
        count,
        resume_text:      resumeText,
      })
      const questions: Question[] = qRes.data

      // 2. Create session (MOCKED FOR OFFLINE USE)
      // const sRes = await api.post('/sessions/', {
      //   role_subject_id: subjectId,
      //   session_type:    sessionType,
      //   question_ids:    questions.map((q) => q.id),
      // })
      // const session = sRes.data
      const session = { id: 'offline-mock-session' }

      // 3. Init local store
      initSession(session.id, questions)

      navigate(`/session/${session.id}`)
    } catch (err: any) {
      setError(err.response?.data?.detail ?? 'Failed to start session. Check API keys.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h1 className="font-display text-3xl font-bold mb-2">
        Configure Your <span className="gradient-text">Rehearsal</span>
      </h1>
      <p className="text-surface-400 mb-8">Set up a mock session tailored to your role.</p>

      <div className="glass rounded-2xl p-6 flex flex-col gap-6">
        {/* Session Type */}
        <FormField label="Session Type">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['behavioral','dsa','viva','mixed'].map((t) => (
              <button
                key={t}
                id={`type-${t}`}
                onClick={() => setSessionType(t)}
                className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all
                  ${sessionType === t
                    ? 'bg-brand-600 text-white glow-brand'
                    : 'glass-light text-surface-300 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </FormField>

        {/* Subject */}
        <FormField label="Subject / Role">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSubjectId(s.id); setCustomSubject('') }}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all
                  ${subjectId === s.id
                    ? 'bg-brand-700 border border-brand-500 text-white'
                    : 'glass-light text-surface-300 hover:text-white border border-transparent'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Or type a custom subject…"
            value={customSubject}
            onChange={(e) => { setCustomSubject(e.target.value); setSubjectId(null) }}
            className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:border-brand-500 text-white placeholder-surface-500"
          />
        </FormField>

        {/* Difficulty & Count */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Difficulty">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-surface-700 border border-surface-600 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:border-brand-500 text-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </FormField>

          <FormField label={`Questions: ${count}`}>
            <input
              type="range" min={3} max={15} value={count}
              onChange={(e) => setCount(+e.target.value)}
              className="w-full accent-brand-500"
            />
          </FormField>
        </div>

        {/* Resume upload */}
        <FormField label="Resume / JD (optional .docx)">
          <label
            htmlFor="resume-upload"
            className="flex items-center gap-3 glass-light border border-dashed border-surface-500 
                       hover:border-brand-500 rounded-lg px-4 py-3 cursor-pointer transition-colors"
          >
            <span className="text-2xl">📄</span>
            <span className="text-sm text-surface-400">
              {resumeName ?? 'Upload resume or job description…'}
            </span>
            {resumeText && <span className="ml-auto text-green-400 text-xs">✓ Parsed</span>}
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".docx"
            onChange={handleResumeUpload}
            className="hidden"
          />
        </FormField>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          id="start-session-btn"
          onClick={handleStart}
          disabled={loading || (!subjectId && !customSubject)}
          className="w-full py-3 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-500 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all glow-brand 
                     hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? '⟳ Generating questions…' : '🎙️ Start Rehearsal'}
        </button>
      </div>
    </motion.div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-surface-300 mb-2">{label}</label>
      {children}
    </div>
  )
}
