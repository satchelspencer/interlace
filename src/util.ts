import { TAU, PI } from './constants'
import { Point } from './types'

export function angleBetween(a: Point, b: Point): number {
  const dx = b.x - a.x,
    dy = b.y - a.y
  return Math.atan2(dy, dx)
}

export function norm(angle: number): number {
  return (angle + TAU) % TAU
}

export function snorm(angle: number): number {
  if (Math.abs(angle) > PI) {
    const t = -1 * (angle % PI)
    return t > 0 ? PI - t : -PI - t
  } else return angle
}

export const sin = Math.sin,
  cos = Math.cos,
  tan = Math.tan

export function sortBy(arr: any[], pred) {
  return arr.sort((a, b) => pred(a) - pred(b))
}
