/**
 * WebSocket manager for the live session.
 * Connects to ws://.../ws/session/{sessionId}?token=...
 * Sends engagement frames and receives nudges / avatar state updates.
 */
import { useEffect, useRef, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useSessionStore, EngagementFrame } from '@/store/sessionStore'

type WsIncomingMessage =
  | { type: 'nudge';        message: string }
  | { type: 'avatar_state'; state: string   }
  | { type: 'pong'                          }

export function useSessionWebSocket(sessionId: string | null) {
  const wsRef    = useRef<WebSocket | null>(null)
  const token    = useAuthStore((s) => s.token)
  const setNudge = useSessionStore((s) => s.setLatestNudge)
  const setAvatar = useSessionStore((s) => s.setAvatarState)

  // Connect on mount / sessionId change
  useEffect(() => {
    if (!sessionId || !token) return

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const host     = window.location.host
    const url      = `${protocol}://${host}/ws/session/${sessionId}?token=${token}`
    const ws       = new WebSocket(url)
    wsRef.current  = ws

    ws.onmessage = (event) => {
      try {
        const msg: WsIncomingMessage = JSON.parse(event.data)
        if (msg.type === 'nudge') {
          setNudge(msg.message)
          // Auto-clear nudge after 8s
          setTimeout(() => setNudge(null), 8000)
        } else if (msg.type === 'avatar_state') {
          setAvatar(msg.state as any)
        }
      } catch {}
    }

    ws.onerror = (e) => console.error('[WS] error', e)

    // Ping every 20s to keep alive
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 20_000)

    return () => {
      clearInterval(pingInterval)
      ws.close()
      wsRef.current = null
    }
  }, [sessionId, token])

  // Send a batch of engagement frames
  const sendMetric = useCallback((frame: EngagementFrame & { question_index: number }) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({
      type: 'metric',
      payload: {
        frame_batch_id:      crypto.randomUUID(),
        client_ts:           frame.ts,
        question_index:      frame.question_index,
        gaze_x:              frame.gaze_x,
        gaze_y:              frame.gaze_y,
        blink_detected:      frame.blink_detected,
        smile_prob:          frame.smile_prob,
        head_yaw:            frame.head_yaw,
        dominant_expression: frame.dominant_expression,
        face_detected:       frame.face_detected,
        engagement_score:    frame.engagement_score,
      },
    }))
  }, [])

  // Send a completed transcript turn
  const sendTranscriptTurn = useCallback((turn: object) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify({ type: 'transcript', payload: turn }))
  }, [])

  return { sendMetric, sendTranscriptTurn }
}
