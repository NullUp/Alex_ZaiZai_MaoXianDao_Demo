export type WorldObjectPosition = readonly [number, number, number]

export type TreeInstance = {
  id: string
  position: WorldObjectPosition
  rotation: number
  scale: number
  modelName: string
  radius: number
}

export type BuildingInstance = {
  id: string
  position: WorldObjectPosition
  rotation: number
  scale: number
  variant: 'small' | 'large'
}

export type GroundDecorationInstance = {
  id: string
  position: WorldObjectPosition
  rotation: number
  scale: number
  modelName: string
}

export const BUILDING_SCALE_MULTIPLIER = 2.5
export const TREE_SCALE_MULTIPLIER = 0.0175
export const GRASS_SCALE_MULTIPLIER = 0.32
export const ROCK_SCALE_MULTIPLIER = 0.0024

export const trees = [
  { id: 'studio-grove-1', position: [-4.9, 0, 1.1], rotation: 0.25, scale: 1.1, modelName: 'Lowpoly_Tree_08', radius: 0.24 },
  { id: 'studio-grove-2', position: [-5.2, 0, 3.6], rotation: 1.8, scale: 0.95, modelName: 'Lowpoly_Tree_03', radius: 0.2 },
  { id: 'studio-grove-3', position: [-2.4, 0, 3.9], rotation: -1.1, scale: 1.05, modelName: 'Lowpoly_Tree_12', radius: 0.22 },
  { id: 'studio-grove-4', position: [-1.6, 0, 0.5], rotation: 2.4, scale: 1, modelName: 'Lowpoly_Tree_14', radius: 0.22 },
  { id: 'studio-grove-5', position: [-6.1, 0, 0.6], rotation: -2.2, scale: 0.96, modelName: 'Lowpoly_Tree_05', radius: 0.24 },
  { id: 'gallery-grove-1', position: [2.8, 0, -0.4], rotation: -0.7, scale: 1.15, modelName: 'Lowpoly_Tree_07', radius: 0.25 },
  { id: 'gallery-grove-2', position: [5.9, 0, 0.2], rotation: 2.2, scale: 1, modelName: 'Lowpoly_Tree_11', radius: 0.2 },
  { id: 'gallery-grove-3', position: [6.1, 0, 2.7], rotation: 0.9, scale: 1.08, modelName: 'Lowpoly_Tree_15', radius: 0.25 },
  { id: 'gallery-grove-4', position: [2.1, 0, 2.9], rotation: -2.9, scale: 0.94, modelName: 'Lowpoly_Tree_04', radius: 0.23 },
  { id: 'gallery-grove-5', position: [6.9, 0, -1.2], rotation: 1.45, scale: 1.02, modelName: 'Lowpoly_Tree_01', radius: 0.23 },
  { id: 'cabin-grove-1', position: [-0.9, 0, 5.4], rotation: 2.8, scale: 1, modelName: 'Lowpoly_Tree_01', radius: 0.23 },
  { id: 'cabin-grove-2', position: [2.4, 0, 5.5], rotation: -2.2, scale: 0.92, modelName: 'Lowpoly_Tree_10', radius: 0.2 },
  { id: 'cabin-grove-3', position: [0.2, 0, 8.2], rotation: 0.55, scale: 1.12, modelName: 'Lowpoly_Tree_06', radius: 0.25 },
  { id: 'cabin-grove-4', position: [3.3, 0, 7.9], rotation: 2.05, scale: 1.02, modelName: 'Lowpoly_Tree_09', radius: 0.24 },
  { id: 'cabin-grove-5', position: [-2.0, 0, 7.5], rotation: -1.75, scale: 0.98, modelName: 'Lowpoly_Tree_13', radius: 0.21 },
  { id: 'bakery-grove-1', position: [-7.8, 0, -2.5], rotation: -0.25, scale: 1.1, modelName: 'Lowpoly_Tree_02', radius: 0.25 },
  { id: 'bakery-grove-2', position: [-5.1, 0, -5.2], rotation: 1.35, scale: 0.96, modelName: 'Lowpoly_Tree_13', radius: 0.21 },
  { id: 'bakery-grove-3', position: [-8.1, 0, -5.4], rotation: 2.6, scale: 1.04, modelName: 'Lowpoly_Tree_04', radius: 0.23 },
  { id: 'bakery-grove-4', position: [-3.7, 0, -2.4], rotation: -2.15, scale: 0.98, modelName: 'Lowpoly_Tree_08', radius: 0.24 },
  { id: 'bakery-grove-5', position: [-9.4, 0, -3.3], rotation: 0.95, scale: 1.03, modelName: 'Lowpoly_Tree_14', radius: 0.22 },
  { id: 'tower-grove-1', position: [5.8, 0, -6.1], rotation: -1.7, scale: 1.08, modelName: 'Lowpoly_Tree_09', radius: 0.24 },
  { id: 'tower-grove-2', position: [8.9, 0, -6.4], rotation: 0.35, scale: 1, modelName: 'Lowpoly_Tree_14', radius: 0.22 },
  { id: 'tower-grove-3', position: [9.2, 0, -3.2], rotation: 2.15, scale: 1.12, modelName: 'Lowpoly_Tree_05', radius: 0.24 },
  { id: 'tower-grove-4', position: [5.2, 0, -2.9], rotation: -0.45, scale: 0.95, modelName: 'Lowpoly_Tree_12', radius: 0.21 },
  { id: 'tower-grove-5', position: [10.2, 0, -5.1], rotation: 1.9, scale: 1.05, modelName: 'Lowpoly_Tree_06', radius: 0.25 },
  { id: 'market-grove-1', position: [-11.1, 0, 3.5], rotation: -2.6, scale: 1, modelName: 'Lowpoly_Tree_08', radius: 0.24 },
  { id: 'market-grove-2', position: [-9.1, 0, 6.8], rotation: 1.1, scale: 0.9, modelName: 'Lowpoly_Tree_12', radius: 0.21 },
  { id: 'market-grove-3', position: [-12.1, 0, 6.1], rotation: 2.55, scale: 1.02, modelName: 'Lowpoly_Tree_15', radius: 0.25 },
  { id: 'market-grove-4', position: [-7.3, 0, 3.1], rotation: -1.15, scale: 0.96, modelName: 'Lowpoly_Tree_10', radius: 0.2 },
  { id: 'garden-grove-1', position: [6.2, 0, 7.9], rotation: -0.95, scale: 1.05, modelName: 'Lowpoly_Tree_07', radius: 0.25 },
  { id: 'garden-grove-2', position: [9.8, 0, 5.2], rotation: 2.9, scale: 0.98, modelName: 'Lowpoly_Tree_03', radius: 0.2 },
  { id: 'garden-grove-3', position: [10.3, 0, 7.9], rotation: -2.45, scale: 1.08, modelName: 'Lowpoly_Tree_02', radius: 0.25 },
  { id: 'garden-grove-4', position: [6.3, 0, 4.6], rotation: 0.45, scale: 0.92, modelName: 'Lowpoly_Tree_11', radius: 0.2 },
  { id: 'edge-tree-1', position: [-12.8, 0, -3.7], rotation: 0.7, scale: 1.05, modelName: 'Lowpoly_Tree_06', radius: 0.25 },
  { id: 'edge-tree-2', position: [-3.5, 0, -10.6], rotation: -1.45, scale: 1, modelName: 'Lowpoly_Tree_15', radius: 0.25 },
  { id: 'edge-tree-3', position: [10.9, 0, -1.1], rotation: 1.95, scale: 0.94, modelName: 'Lowpoly_Tree_10', radius: 0.2 },
  { id: 'edge-tree-4', position: [4.4, 0, 10.6], rotation: -2.8, scale: 1.08, modelName: 'Lowpoly_Tree_01', radius: 0.23 },
  { id: 'edge-tree-5', position: [-10.7, 0, 7.7], rotation: 2.4, scale: 0.98, modelName: 'Lowpoly_Tree_11', radius: 0.2 },
  { id: 'edge-tree-6', position: [12.2, 0, 2.2], rotation: -0.35, scale: 0.96, modelName: 'Lowpoly_Tree_04', radius: 0.23 },
  { id: 'edge-tree-7', position: [0.4, 0, -11.5], rotation: 2.05, scale: 1.03, modelName: 'Lowpoly_Tree_05', radius: 0.24 },
  { id: 'edge-tree-8', position: [-13.4, 0, 0.6], rotation: -2.75, scale: 0.92, modelName: 'Lowpoly_Tree_13', radius: 0.21 },
] as const satisfies readonly TreeInstance[]

export const buildings = [
  {
    id: 'studio',
    position: [-3.4, 0, 2.1],
    rotation: 0.35,
    scale: 0.12,
    variant: 'small',
  },
  {
    id: 'gallery',
    position: [4.2, 0, 1.2],
    rotation: -0.65,
    scale: 0.11,
    variant: 'large',
  },
  {
    id: 'cabin',
    position: [0.6, 0, 6.6],
    rotation: 2.4,
    scale: 0.1,
    variant: 'small',
  },
  {
    id: 'bakery',
    position: [-6.2, 0, -3.8],
    rotation: 1.2,
    scale: 0.095,
    variant: 'large',
  },
  {
    id: 'tower',
    position: [7.4, 0, -4.5],
    rotation: -1.9,
    scale: 0.085,
    variant: 'large',
  },
  {
    id: 'market',
    position: [-9.5, 0, 4.8],
    rotation: -0.25,
    scale: 0.09,
    variant: 'small',
  },
  {
    id: 'garden',
    position: [7.8, 0, 6.5],
    rotation: 0.85,
    scale: 0.09,
    variant: 'small',
  },
] as const satisfies readonly BuildingInstance[]

export const grassPatches = [
  { id: 'grass-01', position: [-5.7, 0, 1.9], rotation: 0.2, scale: 1.1, modelName: 'Plant_01' },
  { id: 'grass-02', position: [-4.3, 0, 4.4], rotation: 1.7, scale: 0.9, modelName: 'Plant_02' },
  { id: 'grass-03', position: [-1.8, 0, 3.1], rotation: -0.8, scale: 1, modelName: 'Plant_03' },
  { id: 'grass-04', position: [2.5, 0, 0.9], rotation: 2.1, scale: 1.1, modelName: 'Plant_01' },
  { id: 'grass-05', position: [5.6, 0, -0.8], rotation: -1.2, scale: 0.95, modelName: 'Plant_03' },
  { id: 'grass-06', position: [6.4, 0, 2.4], rotation: 0.7, scale: 1.05, modelName: 'Plant_02' },
  { id: 'grass-07', position: [-1.8, 0, 5.2], rotation: -2.5, scale: 1.1, modelName: 'Plant_01' },
  { id: 'grass-08', position: [2.7, 0, 7.4], rotation: 2.6, scale: 1, modelName: 'Plant_02' },
  { id: 'grass-09', position: [-2.3, 0, 7.9], rotation: -0.4, scale: 0.95, modelName: 'Plant_03' },
  { id: 'grass-10', position: [-7.5, 0, -1.5], rotation: 0.9, scale: 1.05, modelName: 'Plant_01' },
  { id: 'grass-11', position: [-4.2, 0, -5.8], rotation: -1.9, scale: 0.9, modelName: 'Plant_02' },
  { id: 'grass-12', position: [-8.8, 0, -4.7], rotation: 2.9, scale: 1.08, modelName: 'Plant_03' },
  { id: 'grass-13', position: [5.1, 0, -6.7], rotation: -0.3, scale: 1, modelName: 'Plant_01' },
  { id: 'grass-14', position: [9.5, 0, -5.8], rotation: 1.4, scale: 0.92, modelName: 'Plant_02' },
  { id: 'grass-15', position: [10.0, 0, -2.7], rotation: -2.7, scale: 1.1, modelName: 'Plant_03' },
  { id: 'grass-16', position: [-10.8, 0, 3.0], rotation: 0.5, scale: 1, modelName: 'Plant_01' },
  { id: 'grass-17', position: [-8.6, 0, 7.4], rotation: -1.1, scale: 0.95, modelName: 'Plant_02' },
  { id: 'grass-18', position: [-12.2, 0, 6.7], rotation: 2.2, scale: 1.06, modelName: 'Plant_03' },
  { id: 'grass-19', position: [6.1, 0, 8.5], rotation: -0.7, scale: 1.1, modelName: 'Plant_01' },
  { id: 'grass-20', position: [10.7, 0, 5.0], rotation: 1.8, scale: 0.9, modelName: 'Plant_02' },
  { id: 'grass-21', position: [9.5, 0, 8.8], rotation: -2.9, scale: 1.02, modelName: 'Plant_03' },
  { id: 'grass-22', position: [-12.6, 0, -3.0], rotation: 2.5, scale: 0.95, modelName: 'Plant_01' },
  { id: 'grass-23', position: [-4.8, 0, -10.2], rotation: -1.5, scale: 1.08, modelName: 'Plant_02' },
  { id: 'grass-24', position: [0.8, 0, -10.6], rotation: 0.6, scale: 0.92, modelName: 'Plant_03' },
  { id: 'grass-25', position: [11.2, 0, 1.8], rotation: -0.9, scale: 1, modelName: 'Plant_01' },
  { id: 'grass-26', position: [4.2, 0, 10.3], rotation: 1.25, scale: 0.96, modelName: 'Plant_02' },
  { id: 'grass-27', position: [-10.6, 0, 8.9], rotation: -2.1, scale: 1.04, modelName: 'Plant_03' },
  { id: 'stump-01', position: [-6.5, 0, 2.9], rotation: 0.35, scale: 0.7, modelName: 'Tree_Stump_01' },
  { id: 'stump-02', position: [8.7, 0, -3.0], rotation: -1.4, scale: 0.65, modelName: 'Tree_Stump_02' },
] as const satisfies readonly GroundDecorationInstance[]

export const rockDecorations = [
  { id: 'rock-01', position: [-7.0, 0, 1.2], rotation: 0.4, scale: 0.85, modelName: 'Stone_low' },
  { id: 'rock-02', position: [3.2, 0, -2.5], rotation: 1.8, scale: 0.72, modelName: 'Stone_low' },
  { id: 'rock-03', position: [9.9, 0, 3.7], rotation: -0.9, scale: 0.65, modelName: 'Stone_low' },
  { id: 'rock-04', position: [-11.5, 0, -5.7], rotation: 2.3, scale: 0.78, modelName: 'Stone_low' },
  { id: 'rock-05', position: [1.8, 0, 10.8], rotation: -2.5, scale: 0.6, modelName: 'Stone_low' },
  { id: 'rock-06', position: [-3.3, 0, -9.3], rotation: 0.95, scale: 0.7, modelName: 'Stone_low' },
] as const satisfies readonly GroundDecorationInstance[]
