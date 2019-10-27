import { tripleSquare, gridKnot } from './tests'
import { findPaths } from './interlace'
import getDrawContext from './draw'

const canvas: any = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  draw = getDrawContext(ctx)

const graph = tripleSquare(300),//gridKnot(11, canvas.width / 11, 0.5),
  paths = findPaths(graph)

draw.drawPaths(paths, graph, 70, 20)
console.log(paths)
