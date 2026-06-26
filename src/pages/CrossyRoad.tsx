import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Sky, Text } from '@react-three/drei'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Group, MathUtils, Vector3 } from 'three'
import { HeroModel } from '@/game/HeroModel'
import crossyMusicUrl from '../../assets/moodmode-8-bit-retro-game-music-233964.mp3?url'

const TILE = 1.45
const MIN_X = -5
const MAX_X = 5
const WRAP = 9
const MOVING_INDICES = [-1, 0, 1] as const
const LOG_PLAYER_Y = 0.32
const CROSSY_GRASS_COLOR = '#70c45b'

type LaneType = 'grass' | 'road' | 'water' | 'finish'

type Lane = {
  type: LaneType
  speed?: number
  direction?: 1 | -1
  color: string
}

type PlayStatus = 'playing' | 'lost' | 'won'

type CoinItem = {
  id: string
  row: number
  x: number
}

const lanes: Lane[] = [
  { type: 'grass', color: '#70c45b' },
  { type: 'road', speed: 1.45, direction: 1, color: '#3f4656' },
  { type: 'road', speed: 1.9, direction: -1, color: '#343b4a' },
  { type: 'grass', color: '#7ad067' },
  { type: 'water', speed: 0.95, direction: 1, color: '#38a8e8' },
  { type: 'water', speed: 1.2, direction: -1, color: '#2597dc' },
  { type: 'grass', color: '#7acb64' },
  { type: 'road', speed: 2.1, direction: -1, color: '#3c4350' },
  { type: 'road', speed: 1.65, direction: 1, color: '#303744' },
  { type: 'grass', color: '#7ed26d' },
  { type: 'water', speed: 1.05, direction: -1, color: '#2fa5e9' },
  { type: 'road', speed: 1.95, direction: 1, color: '#384050' },
  { type: 'grass', color: '#78cf64' },
  { type: 'road', speed: 2.25, direction: -1, color: '#343b49' },
  { type: 'road', speed: 1.75, direction: 1, color: '#404858' },
  { type: 'water', speed: 1.15, direction: 1, color: '#35aeea' },
  { type: 'water', speed: 1.35, direction: -1, color: '#248fd3' },
  { type: 'grass', color: '#82d66e' },
  { type: 'road', speed: 2.35, direction: 1, color: '#363f4d' },
  { type: 'water', speed: 1.22, direction: -1, color: '#2aa1e1' },
  { type: 'road', speed: 2.05, direction: -1, color: '#303846' },
  { type: 'finish', color: '#facc15' },
]

const carColors = ['#ef4444', '#f97316', '#2563eb', '#a855f7']

const coins: CoinItem[] = [
  { id: 'coin-1', row: 1, x: -2 * TILE },
  { id: 'coin-2', row: 3, x: 2 * TILE },
  { id: 'coin-3', row: 4, x: 0 },
  { id: 'coin-4', row: 6, x: -3 * TILE },
  { id: 'coin-5', row: 8, x: 3 * TILE },
  { id: 'coin-6', row: 10, x: -1 * TILE },
  { id: 'coin-7', row: 11, x: 2 * TILE },
  { id: 'coin-8', row: 12, x: 0 },
  { id: 'coin-9', row: 13, x: -3 * TILE },
  { id: 'coin-10', row: 15, x: 2 * TILE },
  { id: 'coin-11', row: 17, x: -2 * TILE },
  { id: 'coin-12', row: 18, x: 3 * TILE },
  { id: 'coin-13', row: 19, x: 0 },
  { id: 'coin-14', row: 20, x: -1 * TILE },
]

const roadsideTrees = [
  { x: -7.3, row: 0, scale: 0.95, rotation: 0.2 },
  { x: 7.2, row: 0, scale: 1.08, rotation: 1.4 },
  { x: -7.7, row: 1, scale: 0.9, rotation: 2.2 },
  { x: 7.8, row: 2, scale: 1, rotation: -0.6 },
  { x: -7.4, row: 3, scale: 1.15, rotation: -1.3 },
  { x: 7.5, row: 3, scale: 0.92, rotation: 2.8 },
  { x: -7.8, row: 4, scale: 1, rotation: 0.9 },
  { x: 7.4, row: 5, scale: 1.12, rotation: -2.4 },
  { x: -7.1, row: 6, scale: 0.96, rotation: 1.8 },
  { x: 7.7, row: 6, scale: 1.05, rotation: -1.1 },
  { x: -7.6, row: 7, scale: 0.88, rotation: 2.5 },
  { x: 7.2, row: 8, scale: 1, rotation: 0.4 },
  { x: -7.5, row: 9, scale: 1.14, rotation: -0.8 },
  { x: 7.6, row: 9, scale: 0.95, rotation: 2.1 },
  { x: -7.8, row: 10, scale: 0.9, rotation: -2.8 },
  { x: 7.5, row: 11, scale: 1.05, rotation: 1.2 },
  { x: -7.2, row: 12, scale: 1, rotation: 0.7 },
  { x: 7.3, row: 12, scale: 1.12, rotation: -1.9 },
  { x: -7.7, row: 13, scale: 0.96, rotation: 2.4 },
  { x: 7.4, row: 14, scale: 1.08, rotation: -0.5 },
  { x: -7.5, row: 15, scale: 0.92, rotation: 1.1 },
  { x: 7.8, row: 16, scale: 1.04, rotation: -2.6 },
  { x: -7.1, row: 17, scale: 1.15, rotation: 0.3 },
  { x: 7.2, row: 17, scale: 0.95, rotation: 2.7 },
  { x: -7.9, row: 18, scale: 0.9, rotation: -1.4 },
  { x: 7.6, row: 19, scale: 1.06, rotation: 1.6 },
  { x: -7.4, row: 20, scale: 1, rotation: 2.2 },
  { x: 7.5, row: 21, scale: 1.12, rotation: -0.9 },
] as const

const wrapPosition = (value: number) => {
  const range = WRAP * 2
  return ((((value + WRAP) % range) + range) % range) - WRAP
}

function laneZ(row: number) {
  return -row * TILE
}

function CrossyHero({
  playerRef,
  motionRef,
}: {
  playerRef: RefObject<Group>
  motionRef: RefObject<{ stride: number; running: boolean; grounded: boolean; moving: boolean }>
}) {
  return (
    <group ref={playerRef} scale={0.8}>
      <HeroModel motionRef={motionRef} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.48, 32]} />
        <meshBasicMaterial color="#111827" transparent opacity={0.16} />
      </mesh>
    </group>
  )
}

function CrossyRoadMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(crossyMusicUrl)
    audio.loop = true
    audio.volume = 0.34
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

function PixelCoin({ item, collected }: { item: CoinItem; collected: boolean }) {
  const ref = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 2.4
    ref.current.position.y = 0.62 + Math.sin(performance.now() * 0.004 + item.row) * 0.05
  })

  if (collected) return null

  return (
    <group ref={ref} position={[item.x, 0.62, laneZ(item.row)]}>
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.42, 0.1]} />
        <meshStandardMaterial color="#facc15" roughness={0.35} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.062]}>
        <boxGeometry args={[0.2, 0.2, 0.04]} />
        <meshStandardMaterial color="#f97316" roughness={0.45} />
      </mesh>
    </group>
  )
}

function LaneStrip({ lane, row }: { lane: Lane; row: number }) {
  const isSafeLane = lane.type === 'grass' || lane.type === 'finish'

  return (
    <group position={[0, -0.04, laneZ(row)]}>
      <mesh receiveShadow>
        <boxGeometry args={[18, 0.08, TILE]} />
        <meshStandardMaterial color={lane.color} roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.12, TILE * 0.5 + 0.06]}>
        <boxGeometry args={[18, 0.18, 0.12]} />
        <meshStandardMaterial color={isSafeLane ? '#5fa84d' : '#252b36'} roughness={0.86} />
      </mesh>
      <mesh position={[0, -0.12, -TILE * 0.5 - 0.06]}>
        <boxGeometry args={[18, 0.18, 0.12]} />
        <meshStandardMaterial color={isSafeLane ? '#5fa84d' : '#252b36'} roughness={0.86} />
      </mesh>
      {lane.type === 'road' && (
        <>
          {[-6, -3, 0, 3, 6].map((x) => (
            <mesh key={x} position={[x, 0.055, 0]}>
              <boxGeometry args={[1.1, 0.025, 0.055]} />
              <meshBasicMaterial color="#dbe4f0" transparent opacity={0.68} />
            </mesh>
          ))}
        </>
      )}
      {lane.type === 'water' && (
        <>
          {[-6, -3, 0, 3, 6].map((x) => (
            <mesh key={x} position={[x, 0.055, -0.34]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.64, 0.025, 0.08]} />
              <meshBasicMaterial color="#bff3ff" transparent opacity={0.46} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

function GrassBackdrop() {
  return (
    <mesh receiveShadow position={[0, -0.13, laneZ((lanes.length - 1) / 2)]}>
      <boxGeometry args={[42, 0.08, lanes.length * TILE + 18]} />
      <meshStandardMaterial color={CROSSY_GRASS_COLOR} roughness={0.86} />
    </mesh>
  )
}

function RoadsideTree({ x, row, scale, rotation }: { x: number; row: number; scale: number; rotation: number }) {
  return (
    <group position={[x, 0, laneZ(row)]} rotation={[0, rotation, 0]} scale={scale}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.13, 0.18, 0.84, 7]} />
        <meshStandardMaterial color="#7c3f1d" roughness={0.86} />
      </mesh>
      <mesh castShadow position={[0, 1.08, 0]}>
        <coneGeometry args={[0.48, 0.92, 7]} />
        <meshStandardMaterial color="#2f855a" roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, 1.62, 0]}>
        <coneGeometry args={[0.38, 0.74, 7]} />
        <meshStandardMaterial color="#3fa65c" roughness={0.76} />
      </mesh>
    </group>
  )
}

function MovingCar({ row, index, lane }: { row: number; index: number; lane: Lane }) {
  const ref = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current || !lane.speed || !lane.direction) return
    ref.current.position.x = wrapPosition(index * 5.2 + clock.elapsedTime * lane.speed * lane.direction)
  })

  return (
    <group ref={ref} position={[0, 0.32, laneZ(row)]}>
      <mesh castShadow>
        <boxGeometry args={[1.42, 0.52, 0.82]} />
        <meshStandardMaterial color={carColors[(row + index) % carColors.length]} roughness={0.52} metalness={0.05} />
      </mesh>
      <mesh castShadow position={[0.05, 0.34, 0]}>
        <boxGeometry args={[0.72, 0.34, 0.7]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.2} />
      </mesh>
      <mesh position={[-0.45, -0.31, -0.43]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>
      <mesh position={[0.45, -0.31, -0.43]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>
      <mesh position={[-0.45, -0.31, 0.43]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>
      <mesh position={[0.45, -0.31, 0.43]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>
    </group>
  )
}

function MovingLog({ row, index, lane }: { row: number; index: number; lane: Lane }) {
  const ref = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current || !lane.speed || !lane.direction) return
    ref.current.position.x = wrapPosition(index * 5.3 + clock.elapsedTime * lane.speed * lane.direction)
  })

  return (
    <group ref={ref} position={[0, 0.08, laneZ(row)]}>
      <mesh castShadow>
        <boxGeometry args={[2.8, 0.28, 0.92]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.86} />
      </mesh>
      <mesh position={[-0.6, 0.16, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.82]} />
        <meshStandardMaterial color="#b7793d" roughness={0.84} />
      </mesh>
      <mesh position={[0.6, 0.16, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.82]} />
        <meshStandardMaterial color="#b7793d" roughness={0.84} />
      </mesh>
    </group>
  )
}

function CrossyWorld({
  onStatusChange,
  onCoinChange,
}: {
  onStatusChange: (status: PlayStatus, bestRow: number) => void
  onCoinChange: (coinCount: number) => void
}) {
  const playerRef = useRef<Group>(null)
  const targetRef = useRef({ x: 0, row: 0 })
  const statusRef = useRef<PlayStatus>('playing')
  const bestRowRef = useRef(0)
  const stepLockedRef = useRef(false)
  const stepStartedAtRef = useRef(0)
  const collectedCoinsRef = useRef<Set<string>>(new Set())
  const [, forceCoinRender] = useState(0)
  const motionRef = useRef({ stride: 0, running: false, grounded: true, moving: false })
  const targetPosition = useMemo(() => new Vector3(0, 0, 0), [])

  const reset = useCallback(() => {
    targetRef.current = { x: 0, row: 0 }
    statusRef.current = 'playing'
    bestRowRef.current = 0
    stepLockedRef.current = false
    stepStartedAtRef.current = 0
    collectedCoinsRef.current = new Set()
    forceCoinRender((value) => value + 1)
    if (playerRef.current) playerRef.current.position.set(0, 0, 0)
    onStatusChange('playing', 0)
    onCoinChange(0)
  }, [onCoinChange, onStatusChange])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyR') {
        reset()
        return
      }
      if (statusRef.current !== 'playing') return
      if (event.repeat || stepLockedRef.current) return

      const target = targetRef.current
      const prevX = target.x
      const prevRow = target.row
      if (event.code === 'ArrowUp' || event.code === 'KeyW') target.row = Math.min(lanes.length - 1, target.row + 1)
      if (event.code === 'ArrowDown' || event.code === 'KeyS') target.row = Math.max(0, target.row - 1)
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') target.x = Math.max(MIN_X * TILE, target.x - TILE)
      if (event.code === 'ArrowRight' || event.code === 'KeyD') target.x = Math.min(MAX_X * TILE, target.x + TILE)
      stepLockedRef.current = prevX !== target.x || prevRow !== target.row
      if (stepLockedRef.current) stepStartedAtRef.current = performance.now()
      bestRowRef.current = Math.max(bestRowRef.current, target.row)
      onStatusChange('playing', bestRowRef.current)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onStatusChange, reset])

  useFrame(({ camera, clock }, delta) => {
    const player = playerRef.current
    if (!player) return

    const target = targetRef.current
    const lane = lanes[target.row]
    if (statusRef.current === 'playing') {
      if (lane.type === 'water' && lane.speed && lane.direction) {
        target.x += lane.speed * lane.direction * delta
      }

      targetPosition.set(target.x, lane.type === 'water' ? LOG_PLAYER_Y : 0, laneZ(target.row))
      player.position.lerp(targetPosition, 1 - Math.pow(0.00002, delta))
      const distanceToTarget = player.position.distanceTo(targetPosition)
      motionRef.current.moving = distanceToTarget > 0.05
      if (distanceToTarget < 0.08 || (lane.type === 'water' && performance.now() - stepStartedAtRef.current > 260)) {
        stepLockedRef.current = false
      }
      motionRef.current.stride += delta * (motionRef.current.moving ? 9 : 1.5)
      player.rotation.y = MathUtils.lerp(player.rotation.y, target.x >= player.position.x ? Math.PI / 2 : -Math.PI / 2, 0.08)

      if (lane.type === 'road' && lane.speed && lane.direction) {
        for (const i of MOVING_INDICES) {
          const carX = wrapPosition(i * 5.2 + clock.elapsedTime * lane.speed * lane.direction)
          if (Math.abs(carX - player.position.x) < 0.92) {
            statusRef.current = 'lost'
            onStatusChange('lost', bestRowRef.current)
          }
        }
      }

      for (const coin of coins) {
        if (collectedCoinsRef.current.has(coin.id)) continue
        if (coin.row === target.row && Math.abs(coin.x - player.position.x) < 0.58 && Math.abs(laneZ(coin.row) - player.position.z) < 0.5) {
          collectedCoinsRef.current.add(coin.id)
          forceCoinRender((value) => value + 1)
          onCoinChange(collectedCoinsRef.current.size)
        }
      }

      if (lane.type === 'water' && lane.speed && lane.direction) {
        let onLog = false
        for (const i of MOVING_INDICES) {
          const logX = wrapPosition(i * 5.3 + clock.elapsedTime * lane.speed * lane.direction)
          if (Math.abs(logX - player.position.x) < 1.95) onLog = true
        }
        if (!onLog || Math.abs(target.x) > MAX_X * TILE + 1.2) {
          statusRef.current = 'lost'
          onStatusChange('lost', bestRowRef.current)
        }
      }

      if (lane.type === 'finish') {
        statusRef.current = 'won'
        onStatusChange('won', bestRowRef.current)
      }
    } else {
      motionRef.current.moving = false
    }

    camera.position.lerp(new Vector3(player.position.x + 6.3, 7.4, player.position.z + 6.3), 1 - Math.pow(0.004, delta))
    camera.lookAt(player.position.x, 0.15, player.position.z - 0.8)
  })

  return (
    <>
      <color attach="background" args={[CROSSY_GRASS_COLOR]} />
      <fog attach="fog" args={['#9fdcff', 16, 36]} />
      <Sky sunPosition={[8, 18, 4]} turbidity={4.5} rayleigh={1.4} />
      <ambientLight intensity={1.1} />
      <directionalLight castShadow position={[7, 12, 6]} intensity={2.7} shadow-mapSize-width={1536} shadow-mapSize-height={1536} />
      <Environment preset="park" environmentIntensity={0.28} />

      <GrassBackdrop />

      {lanes.map((lane, row) => (
        <LaneStrip key={`${lane.type}-${row}`} lane={lane} row={row} />
      ))}

      {roadsideTrees.map((tree) => (
        <RoadsideTree key={`${tree.x}-${tree.row}`} x={tree.x} row={tree.row} scale={tree.scale} rotation={tree.rotation} />
      ))}

      {coins.map((coin) => (
        <PixelCoin key={coin.id} item={coin} collected={collectedCoinsRef.current.has(coin.id)} />
      ))}

      {lanes.map((lane, row) =>
        lane.type === 'road'
          ? MOVING_INDICES.map((index) => <MovingCar key={`car-${row}-${index}`} row={row} index={index} lane={lane} />)
          : null,
      )}
      {lanes.map((lane, row) =>
        lane.type === 'water'
          ? MOVING_INDICES.map((index) => <MovingLog key={`log-${row}-${index}`} row={row} index={index} lane={lane} />)
          : null,
      )}

      <Text position={[0, 0.08, laneZ(lanes.length - 1)]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.7} color="#1f1a3d">
        终点
      </Text>
      <CrossyHero playerRef={playerRef} motionRef={motionRef} />
    </>
  )
}

export default function CrossyRoad() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<PlayStatus>('playing')
  const [bestRow, setBestRow] = useState(0)
  const [coinCount, setCoinCount] = useState(0)

  const handleStatusChange = (nextStatus: PlayStatus, nextBestRow: number) => {
    setStatus(nextStatus)
    setBestRow(nextBestRow)
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden" style={{ backgroundColor: CROSSY_GRASS_COLOR }}>
      <Canvas
        orthographic
        shadows
        dpr={[1, 2]}
        camera={{ position: [6.3, 7.4, 6.3], zoom: 104, near: 0.1, far: 120 }}
      >
        <Suspense fallback={null}>
          <CrossyWorld onStatusChange={handleStatusChange} onCoinChange={setCoinCount} />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-5 top-5 z-20 rounded-[28px] border border-white/70 bg-cream/90 px-5 py-4 text-ink shadow-toy backdrop-blur">
        <p className="font-display text-3xl leading-none">过马路</p>
        <p className="mt-1 text-sm font-black text-ink/65">按一次 WASD / 方向键移动一格，R 重新开始</p>
        <div className="mt-2 flex gap-2 text-xs font-black uppercase tracking-[0.18em]">
          <span className="text-tomato">最远：第 {bestRow} 排</span>
          <span className="text-ink/55">金币：{coinCount}/{coins.length}</span>
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
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-indigoNight/45 px-5 backdrop-blur-sm">
          <article className="max-w-md rounded-[34px] border border-white/70 bg-cream p-7 text-center text-ink shadow-modal">
            <p className="font-display text-5xl leading-none">{status === 'won' ? '成功过马路！' : '挑战失败！'}</p>
            <p className="mt-3 text-base font-bold text-ink/70">
              {status === 'won' ? '小男孩顺利到达终点。' : '小男孩撞车或落水了，再试一次吧。'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button className="primary-action" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' }))}>
                再玩一次
              </button>
              <button className="secondary-action" onClick={() => navigate('/')}>
                回冒险岛
              </button>
            </div>
          </article>
        </div>
      )}
      <CrossyRoadMusic />
      <div className="grain-overlay" />
    </main>
  )
}
