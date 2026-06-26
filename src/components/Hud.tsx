import { HelpCircle, RotateCcw, Settings, Star, Volume2, VolumeX, Zap } from 'lucide-react'
import { collectibles } from '@/data/projects'
import { useGameStore } from '@/store/gameStore'

export function Hud() {
  const collectedIds = useGameStore((state) => state.collectedIds)
  const nearbyProjectId = useGameStore((state) => state.nearbyProjectId)
  const muted = useGameStore((state) => state.muted)
  const quality = useGameStore((state) => state.quality)
  const showHelp = useGameStore((state) => state.showHelp)
  const achievement = useGameStore((state) => state.achievement)
  const toggleHelp = useGameStore((state) => state.toggleHelp)
  const toggleMuted = useGameStore((state) => state.toggleMuted)
  const toggleQuality = useGameStore((state) => state.toggleQuality)
  const requestRespawn = useGameStore((state) => state.requestRespawn)

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-ink">
      <div className="pointer-events-auto absolute left-5 top-5 flex items-center gap-3 rounded-3xl border border-white/70 bg-cream/85 px-4 py-3 shadow-toy backdrop-blur">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold text-ink shadow-inner">
          <Star size={22} fill="currentColor" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-ink/55">收集进度</p>
          <p className="font-display text-2xl leading-none">
            {collectedIds.length}/{collectibles.length} 星星
          </p>
        </div>
      </div>

      <div className="pointer-events-auto absolute right-5 top-5 flex gap-2">
        <button className="toy-button" onClick={toggleMuted} aria-label="切换音效">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button className="toy-button" onClick={toggleQuality} aria-label="切换画质">
          <Zap size={18} />
          {quality === 'high' ? '高' : '低'}
        </button>
        <button className="toy-button" onClick={requestRespawn} aria-label="重生">
          <RotateCcw size={18} />
        </button>
        <button className="toy-button" onClick={toggleHelp} aria-label="打开帮助">
          {showHelp ? <Settings size={18} /> : <HelpCircle size={18} />}
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className={`hint-card ${nearbyProjectId ? 'is-visible' : ''}`}>
          <span className="keycap">E</span>
          <span>查看这个作品展台</span>
        </div>
      </div>

      {showHelp && (
        <div className="pointer-events-auto absolute bottom-5 left-5 max-w-sm rounded-[28px] border border-white/70 bg-indigoNight/88 p-5 text-cream shadow-toy backdrop-blur">
          <p className="mb-3 font-display text-3xl leading-none text-gold">控制小男孩</p>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
            <span className="keycap dark">WASD</span>
            <span>行走探索</span>
            <span className="keycap dark">Shift</span>
            <span>奔跑</span>
            <span className="keycap dark">Space</span>
            <span>跳跃</span>
            <span className="keycap dark">E</span>
            <span>查看展台</span>
            <span className="keycap dark">R</span>
            <span>回到出生点</span>
          </div>
        </div>
      )}

      {achievement && (
        <div className="achievement-card">
          <Star size={20} fill="currentColor" />
          <span>{achievement}</span>
        </div>
      )}
    </div>
  )
}

