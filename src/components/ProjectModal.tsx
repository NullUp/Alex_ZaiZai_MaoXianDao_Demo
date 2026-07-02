import { ExternalLink, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { selectProjectById, useGameStore } from '@/store/gameStore'

export function ProjectModal() {
  const selectedProjectId = useGameStore((state) => state.selectedProjectId)
  const closeProject = useGameStore((state) => state.closeProject)
  const navigate = useNavigate()
  const project = selectProjectById(selectedProjectId)

  if (!project) return null

  const isCrossyRoad = project.action === 'crossy-road'
  const isRunner = project.action === 'runner'
  const isMiniGame = isCrossyRoad || isRunner
  const startProject = () => {
    closeProject()
    navigate(project.url)
  }

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-indigoNight/45 px-5 backdrop-blur-sm">
      <article className="relative max-w-xl overflow-hidden rounded-[36px] border border-white/70 bg-cream text-ink shadow-modal">
        <div className="h-28 border-b border-white/70" style={{ backgroundColor: project.color }} />
        <button className="absolute right-5 top-5 rounded-full bg-white/85 p-2 shadow-toy" onClick={closeProject} aria-label="关闭项目">
          <X size={20} />
        </button>
        <div className="p-7">
          <p className="mb-2 inline-flex rounded-full bg-indigoNight px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-cream">
            {project.category}
          </p>
          <h2 className="font-display text-5xl leading-none">{project.title}</h2>
          <p className="mt-4 text-base leading-7 text-ink/72">{project.description}</p>
          <div className="mt-5 grid gap-2">
            {project.highlights.map((highlight) => (
              <div key={highlight} className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 font-semibold">
                {highlight}
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {isMiniGame ? (
              <button className="primary-action" onClick={startProject}>
                {isRunner ? '玩仔仔跑酷' : '玩过马路'}
                <ExternalLink size={17} />
              </button>
            ) : (
              <a className="primary-action" href={project.url} target="_blank" rel="noreferrer">
                打开链接
                <ExternalLink size={17} />
              </a>
            )}
            <button className="secondary-action" onClick={closeProject}>
              {isMiniGame ? '先不玩' : '继续探索'}
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}
