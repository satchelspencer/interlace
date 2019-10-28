import { Graph, Point, Node } from './types'
import { PI, sin, cos } from './util'
import intersect from './intersect'

export function star8(x: number, y: number, rad: number): Graph {
  const res: Graph = {},
    pcount = 9,
    skip = 3,
    pfrac = (2 * PI) / pcount

  for (let i = 0; i < pcount; i++) {
    const angle = pfrac * i,
      prev = (i - skip + pcount) % pcount,
      next = (i + skip + pcount) % pcount,
      p: Node = {
        x: x + cos(angle) * rad,
        y: y + sin(angle) * rad,
        n: [prev + '', next + ''],
      }
    res[i + ''] = p
  }
  // res['a'] = {
  //   x: 700,
  //   y: 1200,
  //   n: ['b'],
  // }
  // res['b'] = {
  //   x: 100,
  //   y: 0,
  //   n: ['a'],
  // }
  intersect(res)
  return res
}

export function randomize(graph: Graph, amount = 100) {
  for (let id in graph) {
    const node = graph[id]
    node.x += Math.random() * amount - amount / 2
    node.y += Math.random() * amount - amount / 2
  }
}

export function star(size = 100): Graph {
  return {
    1: { x: 1.0 * size, y: 1.0 * size, n: [9, 16] },
    2: { x: 2.0 * size, y: 1.0 * size, n: [10, 11] },
    3: { x: 2.0 * size, y: 2.0 * size, n: [12, 13] },
    4: { x: 1.0 * size, y: 2.0 * size, n: [14, 15] },
    5: { x: 1.5 * size, y: 0.75 * size, n: [9, 10] },
    6: { x: 2.25 * size, y: 1.5 * size, n: [11, 12] },
    7: { x: 1.5 * size, y: 2.25 * size, n: [13, 14] },
    8: { x: 0.75 * size, y: 1.5 * size, n: [15, 16] },
    9: { x: 1.25 * size, y: 1.0 * size, n: [1, 16, 5, 10] },
    10: { x: 1.75 * size, y: 1.0 * size, n: [5, 9, 2, 11] },
    11: { x: 2.0 * size, y: 1.25 * size, n: [10, 2, 12, 6] },
    12: { x: 2.0 * size, y: 1.75 * size, n: [11, 6, 13, 3] },
    13: { x: 1.75 * size, y: 2.0 * size, n: [3, 12, 7, 14] },
    14: { x: 1.25 * size, y: 2.0 * size, n: [7, 13, 4, 15] },
    15: { x: 1.0 * size, y: 1.75 * size, n: [4, 14, 8, 16] },
    16: { x: 1.0 * size, y: 1.25 * size, n: [15, 8, 1, 9] },
  }
}

export function doubleSquare(size = 100): Graph {
  return {
    1: { x: 1.0 * size, y: 1.0 * size, n: [2, 4] },
    2: { x: 2.0 * size, y: 1.0 * size, n: [9, 1] },
    3: { x: 2 * size, y: 2 * size, n: [9, 10] },
    4: { x: 1.0 * size, y: 2.0 * size, n: [10, 1] },
    5: { x: 1.5 * size, y: 1.5 * size, n: [9, 10] },
    6: { x: 2.5 * size, y: 1.5 * size, n: [9, 7] },
    7: { x: 2.5 * size, y: 2.5 * size, n: [8, 6] },
    8: { x: 1.5 * size, y: 2.5 * size, n: [7, 10] },
    9: { x: 2 * size, y: 1.5 * size, n: [5, 6, 3, 2] },
    10: { x: 1.5 * size, y: 2 * size, n: [4, 3, 5, 8] },
  }
}

export function tripleSquare(size = 100): Graph {
  return {
    a: { x: 0.25 * size, y: 1 * size, n: [1, 'c'] },
    b: { x: 1 * size, y: 0.25 * size, n: [1, 'c'] },
    c: { x: 0.25 * size, y: 0.25 * size, n: ['a', 'b'] },
    1: { x: 1.0 * size, y: 1.0 * size, n: [2, 4, 'a', 'b'] },
    2: { x: 2.0 * size, y: 1.0 * size, n: [13, 1] },
    3: { x: 1.75 * size, y: 1.75 * size, n: [13, 16] },
    4: { x: 1.0 * size, y: 2.0 * size, n: [16, 1] },
    5: { x: 1.5 * size, y: 1.5 * size, n: [13, 16] },
    6: { x: 2.5 * size, y: 1.5 * size, n: [13, 14, 8, 18] },
    7: { x: 2.5 * size, y: 2.5 * size, n: [14, 15] },
    8: { x: 1.5 * size, y: 2.5 * size, n: [15, 16, 17, 6] },
    9: { x: 2.25 * size, y: 2.25 * size, n: [14, 15] },
    10: { x: 3.0 * size, y: 2.0 * size, n: [14, 11] },
    11: { x: 3.0 * size, y: 3.0 * size, n: [10, 12] },
    12: { x: 2.0 * size, y: 3.0 * size, n: [11, 15] },
    13: { x: 2.0 * size, y: 1.5 * size, n: [5, 6, 3, 2] },
    14: { x: 2.5 * size, y: 2.0 * size, n: [6, 7, 9, 10] },
    15: { x: 2.0 * size, y: 2.5 * size, n: [8, 7, 9, 12] },
    16: { x: 1.5 * size, y: 2.0 * size, n: [3, 4, 8, 5] },
    17: { x: 1 * size, y: 3 * size, n: [8] },
    18: { x: 3 * size, y: 1 * size, n: [6] },
  }
}

export function gridKnot(gridSize, cellSize, clipFrac): Graph {
  const clipRand = () => {
    return Math.max(Math.min(Math.random(), 1 - clipFrac), clipFrac)
  }

  const grid = []

  /* init grid */
  let id = 0
  for (let x = 0; x < gridSize; x++) {
    grid[x] = []
    for (let y = 0; y < gridSize; y++) {
      grid[x][y] = [clipRand(), clipRand(), id++]
    }
  }

  const graph = {}

  // assign grid points
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const [xo, yo, id] = grid[x][y]
      graph[id] = {
        x: (x + xo) * cellSize,
        y: (y + yo) * cellSize,
        n: [],
      }
    }
  }

  // assign neighbors
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const [xo, yo, id] = grid[x][y]
      let dirs = [[0, 1], [1, 0]] //y % 2 === 0 ? [[1, 0], [0, 1]] : [[-1, 0], [0, 1]]
      if (y === 0 && x % 2 === 0) dirs.splice(1, 1)
      if (x === 0 && y % 2 === 0) dirs.splice(0, 1)
      if (y === gridSize - 1 && x % 2 === 1) dirs.splice(1, 1)
      if (x === gridSize - 1 && y % 2 === 1) dirs.splice(0, 1)

      dirs.map(([dx, dy]) => {
        const nx = x + dx,
          ny = y + dy
        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
          const nid = grid[nx][ny][2]
          graph[id].n.push(nid)
          graph[nid].n.push(id)
        }
      })
    }
  }
  // prune extras
  for (let id in graph) {
    if (graph[id].n.length === 0) delete graph[id]
  }
  return graph
}
