import { RefObject, useRef } from 'react'
import { Group, Mesh } from 'three'
import { useFrame, type GroupProps } from '@react-three/fiber'

type BoyModelProps = GroupProps & {
  motionRef: RefObject<{
    stride: number
    running: boolean
    grounded: boolean
  }>
}

export function BoyModel({ motionRef, ...props }: BoyModelProps) {
  const rootRef = useRef<Group>(null)
  const leftLegRef = useRef<Group>(null)
  const rightLegRef = useRef<Group>(null)
  const leftArmRef = useRef<Group>(null)
  const rightArmRef = useRef<Group>(null)
  const scarfRef = useRef<Mesh>(null)

  useFrame(() => {
    const motion = motionRef.current
    if (!motion) return

    const swing = Math.sin(motion.stride) * (motion.running ? 0.75 : 0.45)
    const bounce = motion.grounded ? Math.abs(Math.sin(motion.stride * 2)) * 0.05 : -0.06
    const scarfLift = motion.grounded ? Math.sin(motion.stride * 1.3) * 0.08 : 0.22

    if (rootRef.current) rootRef.current.position.y = bounce
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.7
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.7
    if (scarfRef.current) scarfRef.current.position.y = 1.18 + scarfLift
  })

  return (
    <group ref={rootRef} {...props}>
      <mesh castShadow position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.34, 24, 16]} />
        <meshStandardMaterial color="#f7c99d" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 1.78, -0.02]}>
        <sphereGeometry args={[0.36, 24, 12]} />
        <meshStandardMaterial color="#3b2418" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.34, -0.29]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[0.58, 0.62, 0.28]} />
        <meshStandardMaterial color="#2f80ed" roughness={0.65} />
      </mesh>
      <mesh castShadow position={[0, 0.82, 0]}>
        <capsuleGeometry args={[0.33, 0.48, 8, 16]} />
        <meshStandardMaterial color="#f97316" roughness={0.62} />
      </mesh>
      <mesh castShadow position={[0, 1.18, 0.29]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.76, 0.13, 0.2]} />
        <meshStandardMaterial color="#ef4444" roughness={0.55} />
      </mesh>
      <mesh ref={scarfRef} castShadow position={[0, 1.18, 0.55]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.22, 0.1, 0.55]} />
        <meshStandardMaterial color="#dc2626" roughness={0.55} />
      </mesh>
      <group ref={leftLegRef} position={[-0.42, 0.8, 0]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.11, 0.5, 6, 12]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, -0.62, 0.08]}>
          <boxGeometry args={[0.24, 0.13, 0.38]} />
          <meshStandardMaterial color="#422006" roughness={0.8} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.42, 0.8, 0]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.11, 0.5, 6, 12]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, -0.62, 0.08]}>
          <boxGeometry args={[0.24, 0.13, 0.38]} />
          <meshStandardMaterial color="#422006" roughness={0.8} />
        </mesh>
      </group>
      <group ref={leftArmRef} position={[-0.45, 1.05, 0]} rotation={[0, 0, 0.2]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.08, 0.42, 6, 12]} />
          <meshStandardMaterial color="#f7c99d" roughness={0.7} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.45, 1.05, 0]} rotation={[0, 0, -0.2]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.08, 0.42, 6, 12]} />
          <meshStandardMaterial color="#f7c99d" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}
