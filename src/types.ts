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

export type CrossAngles = number[]

export interface PathNode{
  id: string | number,
  prev?: string | number,
  startCross?: CrossAngles,
  endCross?: CrossAngles
}

export interface Path{
  loop: boolean
  nodes: PathNode[]
}