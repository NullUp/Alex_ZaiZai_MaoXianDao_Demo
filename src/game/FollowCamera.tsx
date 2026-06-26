import { RefObject } from 'react'
import { Group, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'

type FollowCameraProps = {
  targetRef: RefObject<Group>
}

const desiredPosition = new Vector3()
const lookTarget = new Vector3()

export function FollowCamera({ targetRef }: FollowCameraProps) {
  const camera = useThree((state) => state.camera)

  useFrame((_, delta) => {
    const target = targetRef.current
    if (!target) return

    desiredPosition.set(target.position.x, target.position.y + 5.2, target.position.z + 8.4)
    lookTarget.set(target.position.x, target.position.y + 1.1, target.position.z)

    camera.position.lerp(desiredPosition, 1 - Math.pow(0.002, delta))
    camera.lookAt(lookTarget)
  })

  return null
}

