import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/gameStore'
import backgroundMusicUrl from '../../assets/bursanchank-pixelated-game-vibe-music-450640.mp3?url'

export function BackgroundMusic() {
  const muted = useGameStore((state) => state.muted)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const userInteractedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(backgroundMusicUrl)
    audio.loop = true
    audio.volume = 0.36
    audio.preload = 'auto'
    audioRef.current = audio

    const tryPlay = () => {
      userInteractedRef.current = true
      if (audio.muted) return
      void audio.play().catch(() => {
        // Browsers may still block playback until the next user gesture.
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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = muted
    if (muted) {
      audio.pause()
      return
    }

    if (userInteractedRef.current) {
      void audio.play().catch(() => {
        // Playback will resume after a subsequent user gesture.
      })
    }
  }, [muted])

  return null
}
