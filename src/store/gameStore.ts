import { create } from 'zustand'
import { collectibles, projects } from '@/data/projects'
import type { ProjectItem, QualityMode, VectorTuple } from '@/types/game'

type GameState = {
  playerPosition: VectorTuple
  nearbyProjectId: string | null
  selectedProjectId: string | null
  collectedIds: string[]
  muted: boolean
  quality: QualityMode
  showHelp: boolean
  achievement: string | null
  respawnSignal: number
  setPlayerPosition: (position: VectorTuple) => void
  openNearbyProject: () => void
  closeProject: () => void
  collect: (id: string) => void
  toggleMuted: () => void
  toggleQuality: () => void
  toggleHelp: () => void
  requestRespawn: () => void
  clearAchievement: () => void
}

const distance2D = (a: VectorTuple, b: VectorTuple) => {
  const dx = a[0] - b[0]
  const dz = a[2] - b[2]
  return Math.sqrt(dx * dx + dz * dz)
}

const findNearbyProject = (position: VectorTuple) => {
  const item = projects.find((project) => distance2D(position, project.position) < 2.4)
  return item?.id ?? null
}

export const useGameStore = create<GameState>((set, get) => ({
  playerPosition: [0, 0, 4],
  nearbyProjectId: null,
  selectedProjectId: null,
  collectedIds: [],
  muted: false,
  quality: 'high',
  showHelp: true,
  achievement: null,
  respawnSignal: 0,
  setPlayerPosition: (position) => {
    set({
      playerPosition: position,
      nearbyProjectId: findNearbyProject(position),
    })
  },
  openNearbyProject: () => {
    const nearbyProjectId = get().nearbyProjectId
    if (nearbyProjectId) {
      set({
        selectedProjectId: nearbyProjectId,
        showHelp: false,
      })
    }
  },
  closeProject: () => set({ selectedProjectId: null }),
  collect: (id) => {
    const state = get()
    if (state.collectedIds.includes(id)) return

    const nextCollected = [...state.collectedIds, id]
    const isComplete = nextCollected.length === collectibles.length
    set({
      collectedIds: nextCollected,
      achievement: isComplete ? '全部星星已收集，隐藏徽章解锁！' : '收集到一颗星星！',
    })
  },
  toggleMuted: () => set((state) => ({ muted: !state.muted })),
  toggleQuality: () => set((state) => ({ quality: state.quality === 'high' ? 'low' : 'high' })),
  toggleHelp: () => set((state) => ({ showHelp: !state.showHelp })),
  requestRespawn: () => set((state) => ({ respawnSignal: state.respawnSignal + 1 })),
  clearAchievement: () => set({ achievement: null }),
}))

export const selectProjectById = (id: string | null): ProjectItem | null =>
  projects.find((project) => project.id === id) ?? null
