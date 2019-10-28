import { angleBetween, TAU, DEBUG } from './util'
import { getThickLinePoly } from './interlace'
import { pathIndex } from './path'
import { Point, CrossAngles, Path, Graph } from './types'

export default function(ctx: CanvasRenderingContext2D) {
  const draw = {
    line(
      a: Point,
      b: Point,
      style: string = 'black',
      start: number = 0,
      end: number = 1
    ) {
      const dx = b.x - a.x,
        dy = b.y - a.y
      ctx.strokeStyle = style
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(a.x + dx * start, a.y + dy * start)
      ctx.lineTo(a.x + dx * end, a.y + dy * end)
      ctx.stroke()
    },
    marker(point: Point, style='red') {
      ctx.beginPath()
      ctx.strokeStyle = style
      ctx.ellipse(point.x, point.y, 5, 5, 0, 0, TAU)
      ctx.stroke()
    },
    points(points: Point[], style: string) {
      ctx.fillStyle = style
      ctx.strokeStyle = style
      ctx.lineWidth = 1
      points.forEach((point, i) => {
        if (i === 0) {
          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
        } else ctx.lineTo(point.x, point.y)
      })
      ctx.closePath()
      if (!DEBUG) ctx.fill()
      ctx.stroke()
    },
    thickLine(
      a: Point,
      b: Point,
      prev: Point,
      next: Point,
      crossStart: CrossAngles, //[topangle, bottomAngle]
      crossEnd: CrossAngles, //[topangle, bottomAngle]
      width: number,
      gap: number
    ) {
      const thisAngle = angleBetween(a, b),
        prevAngle = prev ? angleBetween(prev, a) : thisAngle,
        nextAngle = next ? angleBetween(b, next) : thisAngle,
        rad = width / 2,
        srad = rad + gap / 2

      const nextCorner = nextAngle - thisAngle,
        prevCorner = thisAngle - prevAngle

      const points = getThickLinePoly(
        a,
        b,
        prevCorner,
        nextCorner,
        crossStart,
        crossEnd,
        rad,
        srad
      )

      draw.points(points, 'black')
    },
    graph(graph: Graph){
      for(let id in graph){
        const node = graph[id]
        node.n.forEach(nid => draw.line(node, graph[nid]))
        draw.marker(node)
        ctx.font = '20px monospace'
        ctx.fillText(id + '', node.x, node.y)
      }
    },
    paths(paths: Path[], graph: Graph, size: number, gap: number) {
      paths.forEach(path => {
        path.nodes.forEach((node, i) => {
          const prevNode = pathIndex(path, i - 1),
            nextNode = pathIndex(path, i + 1)

          if (node.prev)
            draw.thickLine(
              graph[node.prev],
              graph[node.id],
              prevNode ? graph[prevNode.prev] : null,
              nextNode ? graph[nextNode.id] : null,
              node.startCross,
              node.endCross,
              size,
              gap
            )

          if (DEBUG) {
            ctx.font = '20px monospace'
            ctx.fillText(node.id + '', graph[node.id].x, graph[node.id].y)
            graph[node.id].n.forEach(nid => draw.line(graph[node.id], graph[nid], 'red'))
          }
        })
      })
    },
  }
  return draw
}
