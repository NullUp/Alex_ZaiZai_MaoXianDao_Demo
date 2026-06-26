import { Sparkles } from 'lucide-react'

export function IntroOverlay() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-4 z-10 w-[min(430px,calc(100vw-32px))] -translate-x-1/2 rounded-3xl border border-white/70 bg-cream/72 px-4 py-3 text-center text-ink shadow-toy backdrop-blur-md">
      <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-xl bg-tomato text-white shadow-inner">
        <Sparkles size={15} />
      </div>
      <h1 className="font-display text-3xl leading-none md:text-4xl">仔仔冒险岛</h1>
      <p className="mx-auto mt-1 text-xs font-black tracking-[0.08em] text-ink/60 md:text-sm">快来多闪体验吧！</p>
    </div>
  )
}
