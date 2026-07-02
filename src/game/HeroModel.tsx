import { RefObject, useMemo, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AnimationAction, AnimationClip, Group, LoopOnce, LoopRepeat } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import idleUrl from '../../assets/hero_idle.glb?url'
import jumpUrl from '../../assets/hero_jumpNew.glb?url'
import runUrl from '../../assets/hero_run.glb?url'
import slideUrl from '../../assets/hero_slide.glb?url'
import walkUrl from '../../assets/hero_walk.glb?url'

type HeroMotion = {
  stride: number
  running: boolean
  grounded: boolean
  moving: boolean
  verticalVelocity?: number
  sliding?: boolean
}

type HeroModelProps = {
  motionRef: RefObject<HeroMotion>
}

const renameClip = (clip: AnimationClip, name: string) => {
  const nextClip = clip.clone()
  nextClip.name = name
  return nextClip
}

const isOneShotAction = (name: string) => name === 'jumpStart' || name === 'jumpEnd' || name === 'slide'

const playAction = (action?: AnimationAction, fade = 0.18, loop: typeof LoopRepeat | typeof LoopOnce = LoopRepeat) => {
  if (!action) return
  action.clampWhenFinished = loop === LoopOnce
  action
    .reset()
    .setLoop(loop, loop === LoopOnce ? 1 : Infinity)
    .setEffectiveWeight(1)
    .fadeIn(fade)
    .play()
}

export function HeroModel({ motionRef }: HeroModelProps) {
  const groupRef = useRef<Group>(null)
  const activeActionRef = useRef('idle')
  const idle = useGLTF(idleUrl)
  const walk = useGLTF(walkUrl)
  const run = useGLTF(runUrl)
  const slide = useGLTF(slideUrl)
  const jump = useGLTF(jumpUrl)

  const scene = useMemo(() => clone(idle.scene), [idle.scene])
  const clips = useMemo(
    () => [
      renameClip(idle.animations[0], 'idle'),
      renameClip(walk.animations[0], 'walk'),
      renameClip(run.animations[0], 'run'),
      renameClip(slide.animations[0], 'slide'),
      renameClip(jump.animations[0], 'jumpStart'),
      renameClip(jump.animations[1] ?? jump.animations[0], 'jumpEnd'),
    ],
    [idle.animations, walk.animations, run.animations, slide.animations, jump.animations],
  )
  const { actions } = useAnimations(clips, groupRef)

  useFrame(() => {
    const motion = motionRef.current
    const jumpAction = (motion?.verticalVelocity ?? 0) > 0 ? 'jumpStart' : 'jumpEnd'
    const nextAction = !motion?.grounded
      ? jumpAction
      : motion.sliding
        ? 'slide'
        : motion.moving
          ? (motion.running ? 'run' : 'walk')
          : 'idle'

    if (nextAction !== activeActionRef.current) {
      actions[activeActionRef.current]?.fadeOut(0.18)
      playAction(actions[nextAction], 0.18, isOneShotAction(nextAction) ? LoopOnce : LoopRepeat)
      activeActionRef.current = nextAction
    }

    const action = actions[nextAction]
    if (action && !action.isRunning() && !isOneShotAction(nextAction)) {
      playAction(action, 0.05)
    }
    if (actions.run) actions.run.timeScale = 1.12
    if (actions.walk) actions.walk.timeScale = 1.45
    if (actions.slide) actions.slide.timeScale = 1.69
    if (actions.jumpStart) actions.jumpStart.timeScale = 1
    if (actions.jumpEnd) actions.jumpEnd.timeScale = 1
  })

  return (
    <group ref={groupRef} scale={1.25}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(idleUrl)
useGLTF.preload(walkUrl)
useGLTF.preload(runUrl)
useGLTF.preload(slideUrl)
useGLTF.preload(jumpUrl)
