import { Point, Graph } from './types'

export const sin = Math.sin,
  cos = Math.cos,
  tan = Math.tan,
  PI = Math.PI,
  TAU = PI * 2,
  EPSILON = 1e-5,
  DEBUG = true

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

export function sortBy(arr: any[], pred) {
  return arr.sort((a, b) => pred(a) - pred(b))
}

export function join(graph: Graph, a: string | number, b: string | number) {
  graph[a].n.push(b)
  graph[b].n.push(a)
}

export function equalPoints(a: Point, b: Point) {
  return Math.abs(a.x - b.x) < EPSILON && Math.abs(a.y - b.y) < EPSILON
}
