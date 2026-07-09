/**
 * Session store — all live session state managed by Zustand.
 * This is the central state for the PracticeSession page.
 */
import { create } from 'zustand'

export type SessionStage =
  | 'idle'        // no session
  | 'intro'       // countdown / camera check
  | 'question'    // behavioral / viva question display
  | 'coding'      // coding round with Monaco + terminal
  | 'feedback'    // per-question quick feedback
  | 'completed'   // session finished, report generating

export type AvatarState = 'idle' | 'listening' | 'nodding' | 'concerned' | 'thinking'

export interface Question {
  id:            string
  question_text: string
  question_type: 'behavioral' | 'technical' | 'dsa' | 'viva'
  difficulty:    'easy' | 'medium' | 'hard'
  ideal_answer?: string
  starter_code?: string
}

export interface EngagementFrame {
  ts:                  number  // client Unix ms
  gaze_x:              number | null
  gaze_y:              number | null
  blink_detected:      boolean
  smile_prob:          number
  head_yaw:            number | null
  dominant_expression: string
  face_detected:       boolean
  engagement_score:    number
}

export interface TranscriptTurn {
  turn_index:           number
  question_id:          string
  question_text:        string
  question_type:        string
  user_answer_text:     string
  code_submission?:     string
  code_output?:         string
  answer_duration_secs: number
  nudges_given:         string[]
}

interface SessionState {
  // Session metadata
  sessionId:     string | null
  stage:         SessionStage
  questions:     Question[]
  currentIndex:  number

  // Timer
  questionStartTs: number | null

  // Engagement
  engagementBuffer: EngagementFrame[]
  currentEngagement: number

  // Avatar
  avatarState: AvatarState

  // Nudges (live)
  latestNudge: string | null

  // Transcript accumulation
  transcript: TranscriptTurn[]

  // Current code submission (coding round)
  currentCode:    string
  currentOutput:  string

  // Actions
  initSession:         (sessionId: string, questions: Question[]) => void
  setStage:            (stage: SessionStage) => void
  nextQuestion:        () => void
  pushEngagementFrame: (frame: EngagementFrame) => void
  setAvatarState:      (state: AvatarState) => void
  setLatestNudge:      (nudge: string | null) => void
  appendTranscriptTurn:(turn: TranscriptTurn) => void
  setCurrentCode:      (code: string) => void
  setCurrentOutput:    (output: string) => void
  resetSession:        () => void
}

const MAX_BUFFER = 300 // keep last 300 frames (~60s at 5fps)

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionId:        null,
  stage:            'idle',
  questions:        [],
  currentIndex:     0,
  questionStartTs:  null,
  engagementBuffer: [],
  currentEngagement: 0.5,
  avatarState:      'idle',
  latestNudge:      null,
  transcript:       [],
  currentCode:      '',
  currentOutput:    '',

  initSession: (sessionId, questions) =>
    set({ sessionId, questions, stage: 'intro', currentIndex: 0, transcript: [] }),

  setStage: (stage) =>
    set({ stage, questionStartTs: stage === 'question' || stage === 'coding' ? Date.now() : get().questionStartTs }),

  nextQuestion: () => {
    const { currentIndex, questions } = get()
    if (currentIndex + 1 >= questions.length) {
      set({ stage: 'completed' })
    } else {
      set({ currentIndex: currentIndex + 1, stage: 'question', currentCode: '', currentOutput: '' })
    }
  },

  pushEngagementFrame: (frame) =>
    set((s) => {
      const buffer = [...s.engagementBuffer, frame].slice(-MAX_BUFFER)
      const recent = buffer.slice(-10)
      const avgEngagement = recent.reduce((a, f) => a + f.engagement_score, 0) / recent.length
      return { engagementBuffer: buffer, currentEngagement: avgEngagement }
    }),

  setAvatarState:       (avatarState) => set({ avatarState }),
  setLatestNudge:       (latestNudge) => set({ latestNudge }),
  appendTranscriptTurn: (turn) => set((s) => ({ transcript: [...s.transcript, turn] })),
  setCurrentCode:       (currentCode) => set({ currentCode }),
  setCurrentOutput:     (currentOutput) => set({ currentOutput }),

  resetSession: () => set({
    sessionId: null, stage: 'idle', questions: [], currentIndex: 0,
    engagementBuffer: [], currentEngagement: 0.5, avatarState: 'idle',
    latestNudge: null, transcript: [], currentCode: '', currentOutput: '',
  }),
}))
