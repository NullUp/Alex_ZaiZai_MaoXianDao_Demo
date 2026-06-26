export type VectorTuple = [number, number, number]

export type ProjectItem = {
  id: string
  title: string
  category: string
  description: string
  highlights: string[]
  url: string
  position: VectorTuple
  color: string
  action?: 'crossy-road'
  displayModel?: 'panel' | 'chicken'
}

export type CollectibleItem = {
  id: string
  position: VectorTuple
}

export type QualityMode = 'low' | 'high'
