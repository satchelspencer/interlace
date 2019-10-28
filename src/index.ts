import { randomize, tripleSquare, gridKnot, star, star8 } from './tests'
import { findPaths } from './path'
import getDrawContext from './draw'

const canvas: any = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  draw = getDrawContext(ctx)

const graph = star8(600, 600, 400) //gridKnot(11, canvas.width / 11, 0.5),
//randomize(graph, 50)

const paths = findPaths(graph)
draw.paths(paths, graph, 50, 10)
//draw.graph(graph)
console.log(paths)
