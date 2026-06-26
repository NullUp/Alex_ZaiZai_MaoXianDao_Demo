import { RefObject, useRef } from 'react'
import { Environment, Float, Sky } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Group } from 'three'
import { BoyController } from '@/game/BoyController'
import { Collectible } from '@/game/Collectible'
import { FollowCamera } from '@/game/FollowCamera'
import { InteractivePoint } from '@/game/InteractivePoint'
import { World } from '@/game/World'
import { collectibles, projects } from '@/data/projects'
import type { KeyMap } from '@/hooks/useKeyboardControls'
import { useGameStore } from '@/store/gameStore'

type GameSceneProps = {
  keysRef: RefObject<KeyMap>
}

export function GameScene({ keysRef }: GameSceneProps) {
  const playerRef = useRef<Group>(null)
  const quality = useGameStore((state) => state.quality)

  return (
    <>
      <color attach="background" args={['#a7d8ff']} />
      <fog attach="fog" args={['#b8e1ff', 18, 38]} />
      <Sky sunPosition={[8, 14, 5]} turbidity={6} rayleigh={1.5} mieCoefficient={0.004} />
      <ambientLight intensity={1.2} />
      <directionalLight
        castShadow={quality === 'high'}
        position={[8, 12, 6]}
        intensity={2.5}
        shadow-mapSize-width={1536}
        shadow-mapSize-height={1536}
      />
      <Environment preset="city" environmentIntensity={0.25} />

      <World />
      {projects.map((project) => (
        <InteractivePoint key={project.id} project={project} />
      ))}
      {collectibles.map((item) => (
        <Float key={item.id} speed={1.2} floatIntensity={0.25}>
          <Collectible item={item} />
        </Float>
      ))}
      <BoyController playerRef={playerRef} keysRef={keysRef} />
      <FollowCamera targetRef={playerRef} />

      {quality === 'high' && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.28} luminanceThreshold={0.65} luminanceSmoothing={0.24} />
          <Vignette offset={0.22} darkness={0.45} />
        </EffectComposer>
      )}
    </>
  )
}

