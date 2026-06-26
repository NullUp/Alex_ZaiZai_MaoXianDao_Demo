import { Text } from '@react-three/drei'
import { useRef } from 'react'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '@/store/gameStore'
import type { ProjectItem } from '@/types/game'

type InteractivePointProps = {
  project: ProjectItem
}

function LowPolyChicken() {
  return (
    <group>
      <mesh castShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[0.74, 0.62, 0.58]} />
        <meshStandardMaterial color="#fff7d6" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 0.52, -0.05]}>
        <boxGeometry args={[0.48, 0.42, 0.42]} />
        <meshStandardMaterial color="#fff2bd" roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, 0.53, -0.34]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.22, 4]} />
        <meshStandardMaterial color="#f97316" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.18, 0.73, -0.05]}>
        <boxGeometry args={[0.13, 0.14, 0.09]} />
        <meshStandardMaterial color="#ef4444" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 0.77, -0.05]}>
        <boxGeometry args={[0.13, 0.17, 0.09]} />
        <meshStandardMaterial color="#ef4444" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0.18, 0.73, -0.05]}>
        <boxGeometry args={[0.13, 0.14, 0.09]} />
        <meshStandardMaterial color="#ef4444" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[-0.46, 0.08, 0]}>
        <boxGeometry args={[0.18, 0.34, 0.42]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.46, 0.08, 0]}>
        <boxGeometry args={[0.18, 0.34, 0.42]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.16, -0.32, -0.1]}>
        <boxGeometry args={[0.08, 0.36, 0.08]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0.16, -0.32, -0.1]}>
        <boxGeometry args={[0.08, 0.36, 0.08]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.7} />
      </mesh>
      <mesh position={[-0.12, 0.6, -0.28]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>
      <mesh position={[0.12, 0.6, -0.28]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>
    </group>
  )
}

export function InteractivePoint({ project }: InteractivePointProps) {
  const groupRef = useRef<Group>(null)
  const nearbyProjectId = useGameStore((state) => state.nearbyProjectId)
  const isNearby = nearbyProjectId === project.id
  const isChickenStand = project.displayModel === 'chicken'

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.5
  })

  return (
    <group position={project.position} scale={0.8}>
      <mesh receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.15, 1.35, 0.16, 8]} />
        <meshStandardMaterial color="#7c4a22" roughness={0.82} />
      </mesh>
      <group ref={groupRef} position={[0, isChickenStand ? 0.96 : 1.15, 0]}>
        {isChickenStand ? (
          <LowPolyChicken />
        ) : (
          <>
            <mesh castShadow>
              <boxGeometry args={[1.4, 1.4, 0.16]} />
              <meshStandardMaterial color={project.color} roughness={0.56} />
            </mesh>
            <mesh position={[0, 0, 0.12]}>
              <boxGeometry args={[1.08, 0.84, 0.05]} />
              <meshStandardMaterial color="#fff7ed" roughness={0.5} />
            </mesh>
          </>
        )}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[1.45, 1.62, 48]} />
        <meshBasicMaterial color={isNearby ? '#facc15' : '#ffffff'} transparent opacity={isNearby ? 0.9 : 0.35} />
      </mesh>
      <Text
        position={[0, isChickenStand ? 2.15 : 2.35, 0]}
        fontSize={0.28}
        color="#1e1b4b"
        anchorX="center"
        anchorY="middle"
        outlineColor="#fff7ed"
        outlineWidth={0.03}
      >
        {isNearby ? '按 E 查看' : project.title}
      </Text>
    </group>
  )
}
