/**
 * InterviewerAvatar — Three.js 3D avatar driven by AvatarState.
 *
 * States & Animations:
 *   idle       → gentle breathing bob, neutral expression
 *   listening  → slight forward lean, nodding head slowly
 *   nodding    → faster nod cycle (2-3 nods), positive tilt
 *   concerned  → slight backward lean, head tilt
 *   thinking   → gaze up-left, finger-on-chin pose
 *
 * The avatar is a stylized low-poly humanoid built with Three.js primitives
 * (no external model required for the scaffold — a GLTF model can replace).
 */
import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { AvatarState } from '@/store/sessionStore'

// ── State machine config ───────────────────────────────────────────────────
const STATE_CONFIGS: Record<AvatarState, {
  headRotX: number
  headRotY: number
  bodyRotX: number
  nodSpeed: number
  nodAmplitude: number
}> = {
  idle:      { headRotX: 0,      headRotY: 0,    bodyRotX: 0,    nodSpeed: 0.5,  nodAmplitude: 0.02 },
  listening: { headRotX: 0.05,  headRotY: 0,    bodyRotX: 0.03, nodSpeed: 0.8,  nodAmplitude: 0.04 },
  nodding:   { headRotX: 0,      headRotY: 0,    bodyRotX: 0,    nodSpeed: 3.0,  nodAmplitude: 0.15 },
  concerned: { headRotX: -0.05, headRotY: 0.1,  bodyRotX: -0.02,nodSpeed: 0.3,  nodAmplitude: 0.01 },
  thinking:  { headRotX: -0.1,  headRotY: -0.2, bodyRotX: 0,    nodSpeed: 0.2,  nodAmplitude: 0.005},
}

// ── Head mesh ─────────────────────────────────────────────────────────────
function AvatarHead({ state }: { state: AvatarState }) {
  const headRef  = useRef<THREE.Group>(null)
  const config   = STATE_CONFIGS[state]
  const targetX  = useRef(config.headRotX)
  const targetY  = useRef(config.headRotY)

  useEffect(() => {
    targetX.current = STATE_CONFIGS[state].headRotX
    targetY.current = STATE_CONFIGS[state].headRotY
  }, [state])

  useFrame((_, delta) => {
    const head = headRef.current
    if (!head) return
    const cfg = STATE_CONFIGS[state]

    // Smoothly lerp to target rotation
    head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetX.current, delta * 4)
    head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetY.current, delta * 4)

    // Nodding animation
    if (state === 'nodding' || state === 'listening' || state === 'idle') {
      head.rotation.x += Math.sin(Date.now() * 0.001 * cfg.nodSpeed) * cfg.nodAmplitude * delta * 60
    }
  })

  return (
    <group ref={headRef} position={[0, 0.75, 0]}>
      {/* Head */}
      <mesh castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <MeshDistortMaterial color="#f4c2a1" speed={0.3} distort={0.05} roughness={0.7} />
      </mesh>

      {/* Left eye */}
      <mesh position={[-0.1, 0.08, 0.32]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Right eye */}
      <mesh position={[0.1, 0.08, 0.32]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Iris glow (simulates eye contact) */}
      <mesh position={[-0.1, 0.08, 0.35]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#4c6ef5" emissive="#4c6ef5" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.1, 0.08, 0.35]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#4c6ef5" emissive="#4c6ef5" emissiveIntensity={0.8} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, -0.1, 0.34]} rotation={[0, 0, state === 'nodding' ? 0.3 : 0]}>
        <torusGeometry args={[0.06, 0.015, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#c97d60" />
      </mesh>
    </group>
  )
}

// ── Body mesh ────────────────────────────────────────────────────────────
function AvatarBody({ state }: { state: AvatarState }) {
  const bodyRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    const body = bodyRef.current
    if (!body) return
    const cfg = STATE_CONFIGS[state]
    body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, cfg.bodyRotX, delta * 3)
    // Breathing animation
    body.position.y = Math.sin(Date.now() * 0.001) * 0.01
  })

  return (
    <group ref={bodyRef} position={[0, 0, 0]}>
      {/* Torso */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.8, 16]} />
        <meshStandardMaterial color="#3b5bdb" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.15, 0.28, 0.12, 16]} />
        <meshStandardMaterial color="#364fc7" roughness={0.5} />
      </mesh>

      {/* Left shoulder */}
      <mesh position={[-0.38, 0.25, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#3b5bdb" roughness={0.4} />
      </mesh>

      {/* Right shoulder */}
      <mesh position={[0.38, 0.25, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#3b5bdb" roughness={0.4} />
      </mesh>
    </group>
  )
}

// ── Main exported component ───────────────────────────────────────────────
interface AvatarProps {
  state: AvatarState
  className?: string
}

export default function InterviewerAvatar({ state, className = '' }: AvatarProps) {
  return (
    <div className={`avatar-canvas ${className}`} style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
        <pointLight position={[-2, 2, 2]} intensity={0.5} color="#4c6ef5" />
        <pointLight position={[2, -1, 1]} intensity={0.3} color="#f783ac" />

        {/* Environment */}
        <Environment preset="city" />

        {/* Avatar */}
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
          <group>
            <AvatarBody state={state} />
            <AvatarHead state={state} />
          </group>
        </Float>

        {/* Ground reflection */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
          <circleGeometry args={[2, 32]} />
          <meshStandardMaterial color="#161b22" roughness={0.8} transparent opacity={0.5} />
        </mesh>
      </Canvas>
    </div>
  )
}
