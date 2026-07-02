import { useEffect, useMemo, useState } from 'react'
import { useProgress } from '@react-three/drei'

type LoadingScreenProps = {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { active, progress, loaded, total } = useProgress()
  const [isLeaving, setIsLeaving] = useState(false)
  const displayProgress = Math.min(100, Math.max(0, Math.round(progress)))
  const loadedLabel = useMemo(() => {
    if (total <= 0) return '准备资源中'
    return `${loaded}/${total} 个资源`
  }, [loaded, total])

  useEffect(() => {
    if (active || displayProgress < 100) return

    const leaveTimer = window.setTimeout(() => setIsLeaving(true), 280)
    const completeTimer = window.setTimeout(onComplete, 780)
    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(completeTimer)
    }
  }, [active, displayProgress, onComplete])

  return (
    <div className={`loading-screen ${isLeaving ? 'is-leaving' : ''}`}>
      <div className="loading-card">
        <div className="loading-badge">ZAI ZAI ADVENTURE</div>
        <h1 className="loading-title">仔仔冒险岛</h1>
        <p className="loading-subtitle">正在搭建低多边形小岛，请稍等一下...</p>
        <div className="loading-percent">{displayProgress}%</div>
        <div className="loading-track" aria-label="加载进度">
          <div className="loading-fill" style={{ width: `${displayProgress}%` }} />
        </div>
        <div className="loading-meta">
          <span>{loadedLabel}</span>
          <span>{displayProgress >= 100 ? '准备进入' : '加载中'}</span>
        </div>
      </div>
    </div>
  )
}
