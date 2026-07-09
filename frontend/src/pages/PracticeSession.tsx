/**
 * PracticeSession — the core live interview experience.
 * Orchestrates: avatar, webcam HUD, question display, coding editor.
 * Stage machine: intro → question → coding → feedback → completed
 */
import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import InterviewerAvatar from '@/components/avatar/InterviewerAvatar'
import EngagementHUD from '@/components/session/EngagementHUD'
import CodeEditor from '@/components/editor/CodeEditor'
import { useSessionStore } from '@/store/sessionStore'
import { useSessionWebSocket } from '@/hooks/useSessionWebSocket'
import api from '@/lib/api'

const STAGE_LABELS: Record<string, string> = {
  intro:     'Getting Ready',
  question:  'Answer the Question',
  coding:    'Coding Round',
  feedback:  'Quick Feedback',
  completed: 'Session Complete',
}

export default function PracticeSession() {
  const { id: sessionId }  = useParams<{ id: string }>()
  const navigate           = useNavigate()
  const answerStartRef     = useRef<number>(Date.now())

  const {
    stage, questions, currentIndex, avatarState,
    setStage, nextQuestion, appendTranscriptTurn, resetSession,
    currentCode, currentOutput,
  } = useSessionStore()

  const { sendMetric, sendTranscriptTurn } = useSessionWebSocket(sessionId ?? null)

  // Sync engagement frames to WebSocket
  const engagementBuffer = useSessionStore((s) => s.engagementBuffer)
  const lastSentIdx      = useRef(0)

  useEffect(() => {
    const unsent = engagementBuffer.slice(lastSentIdx.current)
    if (unsent.length === 0) return
    unsent.forEach((frame) =>
      sendMetric({ ...frame, question_index: currentIndex })
    )
    lastSentIdx.current = engagementBuffer.length
  }, [engagementBuffer, currentIndex, sendMetric])

  // Auto-advance from intro after 3s
  useEffect(() => {
    if (stage === 'intro') {
      const t = setTimeout(() => {
        setStage(questions[0]?.question_type === 'dsa' ? 'coding' : 'question')
        answerStartRef.current = Date.now()
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [stage, questions, setStage])

  const currentQ = questions[currentIndex]

  const handleNextQuestion = () => {
    const turn = {
      turn_index:           currentIndex,
      question_id:          currentQ?.id ?? '',
      question_text:        currentQ?.question_text ?? '',
      question_type:        currentQ?.question_type ?? 'behavioral',
      user_answer_text:     '',    // would come from STT in a full implementation
      code_submission:      stage === 'coding' ? currentCode : undefined,
      code_output:          stage === 'coding' ? currentOutput : undefined,
      answer_duration_secs: (Date.now() - answerStartRef.current) / 1000,
      nudges_given:         [],
    }
    appendTranscriptTurn(turn)
    sendTranscriptTurn(turn)
    nextQuestion()
    answerStartRef.current = Date.now()
  }

  const handleFinishSession = async () => {
    if (!sessionId) return
    try {
      await api.post(`/sessions/${sessionId}/finish`, {
        duration_secs: Math.floor((Date.now() - answerStartRef.current) / 1000),
      })
      await api.post(`/reports/${sessionId}/generate`)
    } catch {}
    resetSession()
    navigate(`/report/${sessionId}`)
  }

  if (!currentQ && stage !== 'intro' && stage !== 'completed') {
    return (
      <div className="flex items-center justify-center h-full text-surface-400">
        No session data found. <button className="ml-2 text-brand-400 underline" onClick={() => navigate('/')}>Go home</button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="glass border-b border-surface-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-medium text-surface-300">{STAGE_LABELS[stage]}</span>
        </div>
        <div className="text-sm text-surface-500">
          Question {Math.min(currentIndex + 1, questions.length)} / {questions.length}
        </div>
        <button
          id="end-session-btn"
          onClick={handleFinishSession}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          End Session
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 min-h-0 flex gap-0">
        {/* Left: Avatar + HUD */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3 p-4 border-r border-surface-700">
          {/* Avatar */}
          <div className="h-56 rounded-2xl overflow-hidden">
            <InterviewerAvatar state={avatarState} className="h-full" />
          </div>

          {/* Webcam + metrics */}
          <EngagementHUD />
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0 p-4 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {/* INTRO stage */}
            {stage === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="text-6xl mb-4 animate-bounce">🎙️</div>
                <h2 className="font-display text-3xl font-bold gradient-text mb-3">
                  Session Starting…
                </h2>
                <p className="text-surface-400 mb-2">Camera check complete. Get ready!</p>
                <div className="flex gap-2 mt-4">
                  {[1,2,3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 rounded-full bg-brand-500"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ delay: i * 0.2, repeat: Infinity, duration: 0.8 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* QUESTION stage */}
            {(stage === 'question') && currentQ && (
              <motion.div
                key={`q-${currentIndex}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-2 py-0.5 text-xs rounded font-medium uppercase tracking-wide
                    ${currentQ.difficulty === 'hard'   ? 'bg-red-900 text-red-300' :
                      currentQ.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                                                         'bg-green-900 text-green-300'}`}>
                    {currentQ.difficulty}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded bg-surface-700 text-surface-300 uppercase">
                    {currentQ.question_type}
                  </span>
                </div>

                <h2 className="font-display text-2xl font-semibold text-white mb-6 leading-relaxed">
                  {currentQ.question_text}
                </h2>

                <div className="flex-1 glass rounded-2xl p-4 text-surface-400 text-sm italic">
                  Speak your answer clearly. The AI interviewer is listening…
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                  <button
                    id="next-question-btn"
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold 
                               rounded-xl transition-all hover:scale-[1.02]"
                  >
                    {currentIndex + 1 >= questions.length ? 'Finish Session →' : 'Next Question →'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* CODING stage */}
            {stage === 'coding' && currentQ && (
              <motion.div
                key={`c-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col gap-3 min-h-0"
              >
                <div className="glass rounded-xl px-4 py-3 flex-shrink-0">
                  <p className="text-white font-medium text-sm">{currentQ.question_text}</p>
                </div>

                <div className="flex-1 min-h-0">
                  <CodeEditor
                    starterCode={currentQ.starter_code}
                    idealCode={currentQ.ideal_answer}
                    questionId={currentQ.id}
                  />
                </div>

                <div className="flex justify-end flex-shrink-0">
                  <button
                    id="next-coding-btn"
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold 
                               rounded-xl transition-all"
                  >
                    {currentIndex + 1 >= questions.length ? 'Finish →' : 'Next →'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* COMPLETED stage */}
            {stage === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="text-7xl mb-4">🏆</div>
                <h2 className="font-display text-3xl font-bold gradient-text mb-3">
                  Session Complete!
                </h2>
                <p className="text-surface-400 mb-6">
                  Great work! Your report is being generated by AI…
                </p>
                <button
                  onClick={handleFinishSession}
                  className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold 
                             rounded-xl transition-all glow-brand"
                >
                  View Report →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
