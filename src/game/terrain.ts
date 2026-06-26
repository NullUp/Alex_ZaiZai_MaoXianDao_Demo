export const ENVIRONMENT_SCALE = 2

export function getGroundHeight(x: number, z: number) {
  const island = (x * x) / (30 * 30) + (z * z) / (24 * 24)
  return island < 1 ? 0 : -8
}

export function clampToPlayArea(x: number, z: number) {
  return {
    x: Math.max(-30, Math.min(30, x)),
    z: Math.max(-24, Math.min(24, z)),
  }
}
