import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { GameScene } from '@/game/GameScene'
import { useKeyboardControls } from '@/hooks/useKeyboardControls'
import { Hud } from '@/components/Hud'
import { IntroOverlay } from '@/components/IntroOverlay'
import { ProjectModal } from '@/components/ProjectModal'
import { BackgroundMusic } from '@/components/BackgroundMusic'
import { useGameStore } from '@/store/gameStore'

export default function Home() {
  const openNearbyProject = useGameStore((state) => state.openNearbyProject)
  const requestRespawn = useGameStore((state) => state.requestRespawn)
  const toggleHelp = useGameStore((state) => state.toggleHelp)
  const toggleMuted = useGameStore((state) => state.toggleMuted)
  const achievement = useGameStore((state) => state.achievement)
  const clearAchievement = useGameStore((state) => state.clearAchievement)
  const quality = useGameStore((state) => state.quality)

  const keysRef = useKeyboardControls((code) => {
    if (code === 'KeyE') openNearbyProject()
    if (code === 'KeyR') requestRespawn()
    if (code === 'KeyH') toggleHelp()
    if (code === 'KeyM') toggleMuted()
  })

  useEffect(() => {
    if (!achievement) return
    const timer = window.setTimeout(clearAchievement, 2600)
    return () => window.clearTimeout(timer)
  }, [achievement, clearAchievement])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-skyToy">
      <Canvas
        shadows={quality === 'high'}
        dpr={quality === 'high' ? [1, 2] : [1, 1]}
        camera={{ position: [0, 6, 11], fov: 48, near: 0.1, far: 80 }}
      >
        <Suspense fallback={null}>
          <GameScene keysRef={keysRef} />
        </Suspense>
      </Canvas>
      <IntroOverlay />
      <Hud />
      <ProjectModal />
      <BackgroundMusic />
      <div className="grain-overlay" />
    </main>
  )
}
