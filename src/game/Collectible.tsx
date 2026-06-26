import { useRef } from 'react'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/store/gameStore'
import type { CollectibleItem } from '@/types/game'

type CollectibleProps = {
  item: CollectibleItem
}

export function Collectible({ item }: CollectibleProps) {
  const groupRef = useRef<Group>(null)
  const collectedIds = useGameStore((state) => state.collectedIds)
  const playerPosition = useGameStore((state) => state.playerPosition)
  const collect = useGameStore((state) => state.collect)
  const collected = collectedIds.includes(item.id)

  useFrame((_, delta) => {
    if (!groupRef.current || collected) return

    groupRef.current.rotation.y += delta * 2.4
    groupRef.current.position.y = item.position[1] + Math.sin(Date.now() * 0.004 + item.position[0]) * 0.12

    const dx = playerPosition[0] - item.position[0]
    const dy = playerPosition[1] + 0.8 - item.position[1]
    const dz = playerPosition[2] - item.position[2]
    if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 1.5) {
      collect(item.id)
    }
  })

  if (collected) return null

  return (
    <group ref={groupRef} position={item.position} scale={1}>
      <mesh castShadow>
        <octahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.35} roughness={0.35} />
      </mesh>
      <pointLight color="#facc15" intensity={0.55} distance={2.2} />
    </group>
  )
}
