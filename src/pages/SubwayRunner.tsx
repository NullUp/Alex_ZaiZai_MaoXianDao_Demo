import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Sky, Text } from '@react-three/drei'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Group, MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { HeroModel } from '@/game/HeroModel'
import runnerMusicUrl from '../../assets/moodmode-8-bit-retro-game-music-233964.mp3?url'

const LANES = [-2.4, 0, 2.4] as const
const LOOP_LENGTH = 88
const PLAYER_Z = 0
const ROAD_SEGMENT_LENGTH = 8
const ROAD_SEGMENTS = 14
const MAX_JUMP_HEIGHT = 2.4

type PlayStatus = 'playing' | 'lost'
type ObstacleKind = 'barrier' | 'sign' | 'crate'

type RunnerObstacle = {
  id: string
  lane: -1 | 0 | 1
  z: number
  kind: ObstacleKind
}

type RunnerCoin = {
  id: string
  lane: -1 | 0 | 1
  z: number
}

const obstacles: RunnerObstacle[] = [
  { id: 'obs-1', lane: 0, z: -13, kind: 'barrier' },
  { id: 'obs-2', lane: -1, z: -19, kind: 'crate' },
  { id: 'obs-3', lane: 1, z: -26, kind: 'sign' },
  { id: 'obs-4', lane: 0, z: -33, kind: 'crate' },
  { id: 'obs-5', lane: -1, z: -41, kind: 'sign' },
  { id: 'obs-6', lane: 1, z: -48, kind: 'barrier' },
  { id: 'obs-7', lane: 0, z: -55, kind: 'sign' },
  { id: 'obs-8', lane: -1, z: -63, kind: 'barrier' },
  { id: 'obs-9', lane: 1, z: -70, kind: 'crate' },
  { id: 'obs-10', lane: 0, z: -80, kind: 'barrier' },
]

const coins: RunnerCoin[] = [
  { id: 'coin-1', lane: -1, z: -8 },
  { id: 'coin-2', lane: 0, z: -10 },
  { id: 'coin-3', lane: 1, z: -12 },
  { id: 'coin-4', lane: 1, z: -21 },
  { id: 'coin-5', lane: 0, z: -24 },
  { id: 'coin-6', lane: -1, z: -30 },
  { id: 'coin-7', lane: -1, z: -38 },
  { id: 'coin-8', lane: 0, z: -44 },
  { id: 'coin-9', lane: 1, z: -52 },
  { id: 'coin-10', lane: 0, z: -60 },
  { id: 'coin-11', lane: -1, z: -68 },
  { id: 'coin-12', lane: 1, z: -76 },
]

const loopedZ = (baseZ: number, distance: number) => {
  let z = baseZ + (distance % LOOP_LENGTH)
  if (z > 8) z -= LOOP_LENGTH
  return z
}

function laneX(lane: -1 | 0 | 1) {
  return LANES[lane + 1]
}

function RunnerMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(runnerMusicUrl)
    audio.loop = true
    audio.volume = 0.32
    audio.preload = 'auto'
    audioRef.current = audio

    const tryPlay = () => {
      void audio.play().catch(() => {
        // Browsers may block autoplay until another user gesture.
      })
    }

    window.addEventListener('pointerdown', tryPlay)
    window.addEventListener('keydown', tryPlay)

    return () => {
      window.removeEventListener('pointerdown', tryPlay)
      window.removeEventListener('keydown', tryPlay)
      audio.pause()
      audioRef.current = null
    }
  }, [])

  return null
}

function RunnerHero({
  playerRef,
  motionRef,
}: {
  playerRef: RefObject<Group>
  motionRef: RefObject<{ stride: number; running: boolean; grounded: boolean; moving: boolean; verticalVelocity: number; sliding: boolean }>
}) {
  return (
    <group ref={playerRef} scale={0.82}>
      <HeroModel motionRef={motionRef} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.16} />
      </mesh>
    </group>
  )
}

function TrackSegment({ index, distance }: { index: number; distance: number }) {
  const z = loopedZ(-index * ROAD_SEGMENT_LENGTH, distance)
  const stripeZ = ROAD_SEGMENT_LENGTH * 0.33

  return (
    <group position={[0, -0.05, z]}>
      <mesh receiveShadow>
        <boxGeometry args={[8.7, 0.12, ROAD_SEGMENT_LENGTH + 0.08]} />
        <meshStandardMaterial color={index % 2 === 0 ? '#1688f5' : '#35a8ff'} roughness={0.58} />
      </mesh>
      {LANES.map((x) => (
        <mesh key={x} position={[x, 0.02, 0]}>
          <boxGeometry args={[1.62, 0.035, ROAD_SEGMENT_LENGTH + 0.05]} />
          <meshStandardMaterial color={x === 0 ? '#fff3a3' : '#74e8c5'} roughness={0.5} />
        </mesh>
      ))}
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.055, stripeZ]}>
          <boxGeometry args={[0.08, 0.025, 1.6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.78} />
        </mesh>
      ))}
      {[-4.8, 4.8].map((x) => (
        <mesh key={x} position={[x, 0.32, 0]}>
          <boxGeometry args={[0.18, 0.72, ROAD_SEGMENT_LENGTH]} />
          <meshStandardMaterial color="#f59e0b" emissive="#ffd166" emissiveIntensity={0.24} roughness={0.48} />
        </mesh>
      ))}
    </group>
  )
}

function NeonGate({ index, distance }: { index: number; distance: number }) {
  const z = loopedZ(-index * 16 - 8, distance)

  return (
    <group position={[0, 0, z]}>
      <mesh position={[-5.15, 1.55, 0]}>
        <boxGeometry args={[0.16, 3.1, 0.18]} />
        <meshStandardMaterial color="#ff4fb8" emissive="#ff4fb8" emissiveIntensity={0.24} roughness={0.32} />
      </mesh>
      <mesh position={[5.15, 1.55, 0]}>
        <boxGeometry args={[0.16, 3.1, 0.18]} />
        <meshStandardMaterial color="#21d6a4" emissive="#21d6a4" emissiveIntensity={0.24} roughness={0.32} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <boxGeometry args={[10.4, 0.14, 0.18]} />
        <meshStandardMaterial color="#ffe45c" emissive="#ffe45c" emissiveIntensity={0.22} roughness={0.32} />
      </mesh>
    </group>
  )
}

function RunnerObstacleView({ obstacle, distance }: { obstacle: RunnerObstacle; distance: number }) {
  const z = loopedZ(obstacle.z, distance)
  const x = laneX(obstacle.lane)

  if (obstacle.kind === 'barrier') {
    return (
      <group position={[x, 0.33, z]}>
        <mesh castShadow>
          <boxGeometry args={[1.45, 0.58, 0.42]} />
          <meshStandardMaterial color="#ffe45c" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[1.72, 0.16, 0.48]} />
          <meshStandardMaterial color="#ff4fb8" roughness={0.42} />
        </mesh>
      </group>
    )
  }

  if (obstacle.kind === 'sign') {
    return (
      <group position={[x, 1.15, z]}>
        <mesh castShadow position={[0, 0.62, 0]}>
          <boxGeometry args={[1.55, 0.24, 0.32]} />
          <meshStandardMaterial color="#ff4fb8" roughness={0.42} />
        </mesh>
        <mesh castShadow position={[-0.62, -0.08, 0]}>
          <boxGeometry args={[0.12, 1.26, 0.12]} />
          <meshStandardMaterial color="#fff8d6" roughness={0.45} />
        </mesh>
        <mesh castShadow position={[0.62, -0.08, 0]}>
          <boxGeometry args={[0.12, 1.26, 0.12]} />
          <meshStandardMaterial color="#fff8d6" roughness={0.45} />
        </mesh>
      </group>
    )
  }

  return (
    <group position={[x, 0.54, z]} rotation={[0, 0.35, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.25, 1.08, 1.0]} />
        <meshStandardMaterial color="#21d6a4" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.26, 0.52]}>
        <boxGeometry args={[0.85, 0.12, 0.04]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

function RunnerCoinView({ coin, distance, collected }: { coin: RunnerCoin; distance: number; collected: boolean }) {
  const ref = useRef<Group>(null)
  const z = loopedZ(coin.z, distance)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 3.4
    ref.current.position.y = 1.08 + Math.sin(performance.now() * 0.005 + coin.z) * 0.08
  })

  if (collected) return null

  return (
    <group ref={ref} position={[laneX(coin.lane), 1.08, z]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.09, 18]} />
        <meshStandardMaterial color="#facc15" roughness={0.32} metalness={0.2} emissive="#f59e0b" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0, 0.055, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.02, 18]} />
        <meshStandardMaterial color="#fff7ad" roughness={0.25} />
      </mesh>
    </group>
  )
}

function RunnerWorld({
  onStatsChange,
  onStatusChange,
}: {
  onStatsChange: (distance: number, coins: number, speed: number) => void
  onStatusChange: (status: PlayStatus) => void
}) {
  const playerRef = useRef<Group>(null)
  const laneRef = useRef<(-1 | 0 | 1)>(0)
  const statusRef = useRef<PlayStatus>('playing')
  const distanceRef = useRef(0)
  const speedRef = useRef(8.8)
  const yRef = useRef(0)
  const vyRef = useRef(0)
  const slideTimerRef = useRef(0)
  const collectedCoinsRef = useRef<Set<string>>(new Set())
  const [, forceRender] = useState(0)
  const motionRef = useRef({ stride: 0, running: true, grounded: true, moving: true, verticalVelocity: 0, sliding: false })
  const targetPosition = useMemo(() => new Vector3(), [])

  const reset = useCallback(() => {
    laneRef.current = 0
    statusRef.current = 'playing'
    distanceRef.current = 0
    speedRef.current = 8.8
    yRef.current = 0
    vyRef.current = 0
    slideTimerRef.current = 0
    collectedCoinsRef.current = new Set()
    motionRef.current = { stride: 0, running: true, grounded: true, moving: true, verticalVelocity: 0, sliding: false }
    if (playerRef.current) {
      playerRef.current.position.set(0, 0, PLAYER_Z)
      playerRef.current.rotation.set(0, Math.PI, 0)
    }
    forceRender((value) => value + 1)
    onStatsChange(0, 0, speedRef.current)
    onStatusChange('playing')
  }, [onStatsChange, onStatusChange])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyS', 'Space', 'KeyR'].includes(event.code)) {
        event.preventDefault()
      }
      if (event.code === 'KeyR') {
        reset()
        return
      }
      if (event.repeat || statusRef.current !== 'playing') return

      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        laneRef.current = Math.max(-1, laneRef.current - 1) as -1 | 0 | 1
      }
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        laneRef.current = Math.min(1, laneRef.current + 1) as -1 | 0 | 1
      }
      if ((event.code === 'ArrowUp' || event.code === 'KeyW' || event.code === 'Space') && yRef.current <= 0.03) {
        vyRef.current = 8.2
      }
      if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        slideTimerRef.current = 0.62
      }
    }

    window.addEventListener('keydown', onKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [reset])

  useFrame(({ camera }, delta) => {
    const player = playerRef.current
    if (!player) return

    if (statusRef.current === 'playing') {
      const safeDelta = Math.min(delta, 0.04)
      speedRef.current = Math.min(15.5, speedRef.current + safeDelta * 0.12)
      distanceRef.current += speedRef.current * safeDelta

      if (slideTimerRef.current > 0) slideTimerRef.current = Math.max(0, slideTimerRef.current - safeDelta)

      vyRef.current -= 22 * safeDelta
      yRef.current = Math.max(0, Math.min(MAX_JUMP_HEIGHT, yRef.current + vyRef.current * safeDelta))
      if (yRef.current <= 0) {
        yRef.current = 0
        vyRef.current = 0
      }

      targetPosition.set(laneX(laneRef.current), yRef.current, PLAYER_Z)
      player.position.lerp(targetPosition, 1 - Math.pow(0.00008, safeDelta))
      player.rotation.y = MathUtils.lerp(player.rotation.y, Math.PI, 0.14)

      const isSliding = slideTimerRef.current > 0
      for (const obstacle of obstacles) {
        const z = loopedZ(obstacle.z, distanceRef.current)
        const sameLane = obstacle.lane === laneRef.current && Math.abs(player.position.x - laneX(obstacle.lane)) < 0.72
        const nearPlayer = Math.abs(z - PLAYER_Z) < 0.7
        if (!sameLane || !nearPlayer) continue

        const cleared =
          (obstacle.kind === 'barrier' && yRef.current > 0.78)
          || (obstacle.kind === 'sign' && isSliding)

        if (!cleared) {
          statusRef.current = 'lost'
          motionRef.current.moving = false
          motionRef.current.running = false
          motionRef.current.sliding = false
          onStatusChange('lost')
          break
        }
      }

      for (const coin of coins) {
        const z = loopedZ(coin.z, distanceRef.current)
        const cycleId = `${coin.id}-${Math.floor((distanceRef.current - coin.z) / LOOP_LENGTH)}`
        if (collectedCoinsRef.current.has(cycleId)) continue
        if (coin.lane === laneRef.current && Math.abs(z - PLAYER_Z) < 0.72 && yRef.current < 1.8) {
          collectedCoinsRef.current.add(cycleId)
          forceRender((value) => value + 1)
        }
      }

      motionRef.current.stride += safeDelta * speedRef.current * 1.2
      motionRef.current.grounded = yRef.current <= 0.02
      motionRef.current.verticalVelocity = vyRef.current
      motionRef.current.running = statusRef.current === 'playing'
      motionRef.current.moving = statusRef.current === 'playing'
      motionRef.current.sliding = isSliding && motionRef.current.grounded
      onStatsChange(distanceRef.current, collectedCoinsRef.current.size, speedRef.current)
    }

    camera.position.lerp(new Vector3(player.position.x * 0.32, 4.4, 8.2), 1 - Math.pow(0.006, delta))
    if (camera instanceof PerspectiveCamera) {
      camera.fov = MathUtils.lerp(camera.fov, 48 + Math.min(8, speedRef.current * 0.42), 0.03)
      camera.updateProjectionMatrix()
    }
    camera.lookAt(player.position.x * 0.22, 1.05, -5.2)
  })

  const distance = distanceRef.current

  return (
    <>
      <color attach="background" args={['#19c4f6']} />
      <fog attach="fog" args={['#92ecff', 22, 70]} />
      <Sky sunPosition={[4, 14, 5]} turbidity={3.2} rayleigh={1.15} mieCoefficient={0.004} />
      <ambientLight intensity={1.45} />
      <directionalLight castShadow position={[5, 11, 7]} intensity={3.1} shadow-mapSize-width={1536} shadow-mapSize-height={1536} />
      <pointLight position={[0, 4.2, -5]} color="#fff3a3" intensity={2.4} distance={16} />
      <pointLight position={[-4, 2.2, 3]} color="#ff4fb8" intensity={2.1} distance={12} />
      <Environment preset="park" environmentIntensity={0.44} />

      <mesh receiveShadow position={[0, -0.16, -28]}>
        <boxGeometry args={[32, 0.08, 120]} />
        <meshStandardMaterial color="#37a7ff" roughness={0.7} />
      </mesh>

      {Array.from({ length: ROAD_SEGMENTS }, (_, index) => (
        <TrackSegment key={index} index={index} distance={distance} />
      ))}
      {Array.from({ length: 6 }, (_, index) => (
        <NeonGate key={index} index={index} distance={distance} />
      ))}
      {obstacles.map((obstacle) => (
        <RunnerObstacleView key={obstacle.id} obstacle={obstacle} distance={distance} />
      ))}
      {coins.map((coin) => {
        const cycleId = `${coin.id}-${Math.floor((distanceRef.current - coin.z) / LOOP_LENGTH)}`
        return <RunnerCoinView key={coin.id} coin={coin} distance={distance} collected={collectedCoinsRef.current.has(cycleId)} />
      })}

      <Text position={[0, 0.08, -9.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.7} color="#fff8d6">
        ZAI ZAI RUN
      </Text>
      <RunnerHero playerRef={playerRef} motionRef={motionRef} />
    </>
  )
}

export default function SubwayRunner() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<PlayStatus>('playing')
  const [distance, setDistance] = useState(0)
  const [coinCount, setCoinCount] = useState(0)
  const [speed, setSpeed] = useState(8.8)
  const bestDistanceRef = useRef(0)

  const handleStatsChange = useCallback((nextDistance: number, nextCoins: number, nextSpeed: number) => {
    setDistance(nextDistance)
    setCoinCount(nextCoins)
    setSpeed(nextSpeed)
    bestDistanceRef.current = Math.max(bestDistanceRef.current, nextDistance)
  }, [])

  return (
    <main className="relative h-screen w-screen overflow-hidden" style={{ backgroundColor: '#19c4f6' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 4.4, 8.2], fov: 52, near: 0.1, far: 130 }}>
        <Suspense fallback={null}>
          <RunnerWorld onStatsChange={handleStatsChange} onStatusChange={setStatus} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-5 top-5 z-20 rounded-[28px] border-4 border-white bg-fuchsia-500 px-5 py-4 text-white shadow-toy backdrop-blur">
        <p className="font-display text-3xl leading-none text-white">仔仔跑酷</p>
        <p className="mt-1 text-sm font-black text-white/85">A/D 变道，W/空格跳跃，S 下滑，R 重开</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.16em]">
          <span className="rounded-full bg-white px-2 py-1 text-sky-600">距离：{Math.floor(distance)}m</span>
          <span className="rounded-full bg-yellow-300 px-2 py-1 text-purple-800">金币：{coinCount}</span>
          <span className="rounded-full bg-emerald-300 px-2 py-1 text-purple-800">速度：{speed.toFixed(1)}</span>
        </div>
      </div>

      <div className="absolute right-5 top-5 z-20 flex gap-3">
        <button className="toy-button" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' }))}>
          <RotateCcw size={18} />
          重玩
        </button>
        <button className="toy-button" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          回冒险岛
        </button>
      </div>

      {status !== 'playing' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-sky-400/45 px-5 backdrop-blur-sm">
          <article className="max-w-md rounded-[34px] border-4 border-white bg-cream p-7 text-center text-ink shadow-modal">
            <p className="font-display text-5xl leading-none">跑酷失败！</p>
            <p className="mt-3 text-base font-bold text-ink/70">
              仔仔跑了 {Math.floor(distance)} 米，最高纪录 {Math.floor(bestDistanceRef.current)} 米，收集了 {coinCount} 枚金币。
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button className="primary-action" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' }))}>
                再跑一次
              </button>
              <button className="secondary-action" onClick={() => navigate('/')}>
                回冒险岛
              </button>
            </div>
          </article>
        </div>
      )}
      <RunnerMusic />
      <div className="grain-overlay" />
    </main>
  )
}
