import { RefObject, useEffect, useRef } from 'react'
import { Group, MathUtils, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { HeroModel } from '@/game/HeroModel'
import { clampToPlayArea, getGroundHeight } from '@/game/terrain'
import type { KeyMap } from '@/hooks/useKeyboardControls'
import { useGameStore } from '@/store/gameStore'

type BoyControllerProps = {
  playerRef: RefObject<Group>
  keysRef: RefObject<KeyMap>
}

const spawnPoint = new Vector3(0, 1.1, 4)
const JUMP_VELOCITY = 6.4
const GRAVITY = -20.8

export function BoyController({ playerRef, keysRef }: BoyControllerProps) {
  const position = useRef(spawnPoint.clone())
  const velocity = useRef(new Vector3())
  const facing = useRef(0)
  const jumpLocked = useRef(false)
  const motionRef = useRef({
    stride: 0,
    grounded: false,
    moving: false,
    running: false,
    verticalVelocity: 0,
  })
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition)
  const respawnSignal = useGameStore((state) => state.respawnSignal)

  useEffect(() => {
    position.current.copy(spawnPoint)
    velocity.current.set(0, 0, 0)
  }, [respawnSignal])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.033)
    const keys = keysRef.current
    const input = new Vector3(
      (keys?.has('KeyD') || keys?.has('ArrowRight') ? 1 : 0) -
        (keys?.has('KeyA') || keys?.has('ArrowLeft') ? 1 : 0),
      0,
      (keys?.has('KeyS') || keys?.has('ArrowDown') ? 1 : 0) -
        (keys?.has('KeyW') || keys?.has('ArrowUp') ? 1 : 0),
    )

    const hasMoveInput = input.lengthSq() > 0
    motionRef.current.moving = hasMoveInput
    motionRef.current.running = Boolean(keys?.has('ShiftLeft') || keys?.has('ShiftRight')) && hasMoveInput
    motionRef.current.verticalVelocity = velocity.current.y

    if (hasMoveInput) {
      input.normalize()
      const speed = motionRef.current.running ? 8 : 4.31
      velocity.current.x = MathUtils.lerp(velocity.current.x, input.x * speed, 0.22)
      velocity.current.z = MathUtils.lerp(velocity.current.z, input.z * speed, 0.22)
      const targetFacing = Math.atan2(input.x, input.z)
      facing.current = MathUtils.lerp(facing.current, targetFacing, 0.18)
      motionRef.current.stride += delta * (motionRef.current.running ? 13 : 8)
    } else {
      velocity.current.x = MathUtils.lerp(velocity.current.x, 0, 0.2)
      velocity.current.z = MathUtils.lerp(velocity.current.z, 0, 0.2)
      motionRef.current.stride += delta * 1.5
    }

    const groundHeight = getGroundHeight(position.current.x, position.current.z)
    motionRef.current.grounded = position.current.y <= groundHeight + 0.04 && velocity.current.y <= 0

    const jumpPressed = Boolean(keys?.has('Space'))
    if (jumpPressed && motionRef.current.grounded && !jumpLocked.current) {
      velocity.current.y = JUMP_VELOCITY
      motionRef.current.grounded = false
      jumpLocked.current = true
    }
    if (!jumpPressed) jumpLocked.current = false

    velocity.current.y += GRAVITY * delta
    motionRef.current.verticalVelocity = velocity.current.y
    position.current.addScaledVector(velocity.current, delta)

    const nextGroundHeight = getGroundHeight(position.current.x, position.current.z)
    if (position.current.y <= nextGroundHeight) {
      position.current.y = nextGroundHeight
      velocity.current.y = 0
      motionRef.current.grounded = true
    }

    if (position.current.y < -5) {
      position.current.copy(spawnPoint)
      velocity.current.set(0, 0, 0)
    }

    const clamped = clampToPlayArea(position.current.x, position.current.z)
    position.current.x = clamped.x
    position.current.z = clamped.z

    if (playerRef.current) {
      playerRef.current.position.copy(position.current)
      playerRef.current.rotation.y = facing.current
    }

    setPlayerPosition([position.current.x, position.current.y, position.current.z])
  })

  return (
    <group ref={playerRef}>
      <HeroModel motionRef={motionRef} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.65, 32]} />
        <meshBasicMaterial color="#111827" transparent opacity={0.16} />
      </mesh>
    </group>
  )
}
