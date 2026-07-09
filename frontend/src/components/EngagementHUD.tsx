/**
 * EngagementHUD — real-time webcam + metrics overlay during a session.
 * Shows live video feed, engagement score, blink rate, smile indicator.
 * Privacy note: video never leaves this component.
 */
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFaceTracking } from '@/hooks/useFaceTracking'
import { useSessionStore } from '@/store/sessionStore'

export default function EngagementHUD() {
  const videoRef        = useRef<HTMLVideoElement>(null)
  const streamRef       = useRef<MediaStream | null>(null)
  const currentEngagement = useSessionStore((s) => s.currentEngagement)
  const engagementBuffer  = useSessionStore((s) => s.engagementBuffer)
  const latestNudge       = useSessionStore((s) => s.latestNudge)

  // Start webcam
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      })
      .catch(console.error)

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  // Run face tracking
  useFaceTracking(videoRef, true)

  const latestFrame = engagementBuffer[engagementBuffer.length - 1]
  const engagePct   = Math.round(currentEngagement * 100)

  const engageColor = engagePct > 70
    ? 'bg-green-500'
    : engagePct > 45
    ? 'bg-yellow-500'
    : 'bg-red-500'

  return (
    <div className="flex flex-col gap-3">
      {/* Webcam feed */}
      <div className="relative rounded-xl overflow-hidden border border-surface-600" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1]" // mirror
          playsInline
          muted
          autoPlay
        />

        {/* Engagement overlay */}
        <div className="absolute bottom-0 left-0 right-0 glass-light px-2 py-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-surface-400">Engagement</span>
            <span className={`font-bold ${engagePct > 70 ? 'text-green-400' : engagePct > 45 ? 'text-yellow-400' : 'text-red-400'}`}>
              {engagePct}%
            </span>
          </div>
          <div className="w-full bg-surface-700 rounded-full h-1.5">
            <motion.div
              className={`h-1.5 rounded-full engagement-bar ${engageColor}`}
              animate={{ width: `${engagePct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Face detection indicator */}
        <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${latestFrame?.face_detected ? 'bg-green-400' : 'bg-red-400'}`} />
      </div>

      {/* Metric pills */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <MetricPill
          label="Expression"
          value={latestFrame?.dominant_expression ?? 'neutral'}
          icon="😊"
        />
        <MetricPill
          label="Eye Contact"
          value={latestFrame?.gaze_x !== null
            ? (Math.abs(latestFrame?.gaze_x ?? 0) < 0.3 ? 'On cam' : 'Looking away')
            : 'N/A'}
          icon="👁️"
        />
      </div>

      {/* Live nudge */}
      {latestNudge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="nudge-toast rounded-xl px-3 py-2 text-sm text-brand-200"
        >
          <span className="text-brand-400 font-semibold mr-1">💡</span>
          {latestNudge}
        </motion.div>
      )}
    </div>
  )
}

function MetricPill({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="glass rounded-lg px-2 py-1.5 flex items-center gap-1.5">
      <span>{icon}</span>
      <div className="min-w-0">
        <div className="text-surface-400 text-[10px] uppercase tracking-wide">{label}</div>
        <div className="text-white font-medium truncate capitalize">{value}</div>
      </div>
    </div>
  )
}
