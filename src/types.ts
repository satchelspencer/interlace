export interface Point {
  x: number
  y: number
}

export interface Node extends Point {
  n: (string|number)[]
}

export interface Graph {
  [id: string]: Node,
  [id: number]: Node
}

export type CrossAngles = [number, number]

export interface PathNode{
  id: string,
  prev?: string,
  startCross?: CrossAngles,
  endCross?: CrossAngles
}

export interface Path{
  loop: boolean
  nodes: PathNode[]
}