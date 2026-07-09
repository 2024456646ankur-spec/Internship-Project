/**
 * useFaceTracking — runs face-api.js on webcam frames at ~5fps.
 * Extracts engagement metrics and pushes them to the session store.
 * Privacy: only derived numeric metrics leave this hook — never raw video.
 */
import { useEffect, useRef, useCallback } from 'react'
import * as faceapi from '@vladmandic/face-api'
import { useSessionStore } from '@/store/sessionStore'

const MODEL_URL = '/models' // face-api.js model weights in public/models/

export function useFaceTracking(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  const modelsLoaded  = useRef(false)
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const pushFrame     = useSessionStore((s) => s.pushEngagementFrame)

  // Load face-api models once
  useEffect(() => {
    if (modelsLoaded.current) return
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]).then(() => {
      modelsLoaded.current = true
    }).catch(console.error)
  }, [])

  const processFrame = useCallback(async () => {
    const video = videoRef.current
    if (!video || !modelsLoaded.current || video.paused || video.ended) return

    try {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
        .withFaceLandmarks(true)
        .withFaceExpressions()

      if (!detections) {
        pushFrame({
          ts:                  Date.now(),
          gaze_x:              null,
          gaze_y:              null,
          blink_detected:      false,
          smile_prob:          0,
          head_yaw:            null,
          dominant_expression: 'neutral',
          face_detected:       false,
          engagement_score:    0.1,
        })
        return
      }

      const { landmarks, expressions } = detections

      // ── Gaze estimation (simplified) ─────────────────────────────────────
      // Use the iris (approximated from eye landmarks) relative to face box
      const leftEye  = landmarks.getLeftEye()
      const rightEye = landmarks.getRightEye()
      const noseTip  = landmarks.getNose()[3]
      const faceBB   = detections.detection.box

      const eyeCenterX = (leftEye[0].x + rightEye[3].x) / 2
      const eyeCenterY = (leftEye[0].y + rightEye[3].y) / 2
      const gaze_x = ((eyeCenterX - faceBB.x) / faceBB.width  - 0.5) * 2   // -1..1
      const gaze_y = ((eyeCenterY - faceBB.y) / faceBB.height - 0.5) * 2   // -1..1

      // ── Blink detection ───────────────────────────────────────────────────
      // EAR = Eye Aspect Ratio < 0.2 → blink
      const ear = _computeEAR(leftEye)
      const blink_detected = ear < 0.18

      // ── Head pose (yaw from nose-to-eye horizontal offset) ────────────────
      const faceCenterX = faceBB.x + faceBB.width / 2
      const head_yaw = ((noseTip.x - faceCenterX) / (faceBB.width / 2)) * 45 // degrees approx

      // ── Dominant expression ───────────────────────────────────────────────
      const dominant_expression = Object.entries(expressions)
        .sort((a, b) => b[1] - a[1])[0][0]

      const smile_prob = expressions.happy ?? 0

      // ── Engagement score (composite heuristic) ────────────────────────────
      // High engagement: face detected + looking center + not fearful + not disgusted
      const gazeOnCamera = Math.abs(gaze_x) < 0.3 && Math.abs(gaze_y) < 0.3 ? 1 : 0
      const positiveExpr = (smile_prob + (expressions.neutral ?? 0)) / 2
      const engagement_score = Math.min(1, (
        gazeOnCamera * 0.5 +
        positiveExpr * 0.3 +
        (blink_detected ? 0 : 0.1) +   // penalize closed eyes slightly
        0.1                             // baseline for face being detected
      ))

      pushFrame({
        ts: Date.now(),
        gaze_x,
        gaze_y,
        blink_detected,
        smile_prob,
        head_yaw,
        dominant_expression,
        face_detected: true,
        engagement_score,
      })
    } catch {
      // Silently ignore per-frame errors
    }
  }, [pushFrame, videoRef])

  // Start / stop interval
  useEffect(() => {
    if (enabled) {
      intervalRef.current = setInterval(processFrame, 200) // 5fps
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, processFrame])
}

/** Eye Aspect Ratio — measures openness of an eye from 6 landmarks. */
function _computeEAR(eye: { x: number; y: number }[]): number {
  if (eye.length < 6) return 0.3 // assume open
  const A = _dist(eye[1], eye[5])
  const B = _dist(eye[2], eye[4])
  const C = _dist(eye[0], eye[3])
  return (A + B) / (2 * C)
}

function _dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}
