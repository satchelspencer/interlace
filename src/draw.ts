import { TAU, DEBUG } from './constants'
import { angleBetween } from './util'
import { getThickLinePoly, pathIndex } from './interlace'
import { Point, CrossAngles, Path, Graph } from './types'

export default function(ctx: CanvasRenderingContext2D) {
  const draw = {
    drawLine(
      a: Point,
      b: Point,
      style: string = 'black',
      start: number = 0,
      end: number = 1
    ) {
      const dx = b.x - a.x,
        dy = b.y - a.y
      ctx.strokeStyle = style
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(a.x + dx * start, a.y + dy * start)
      ctx.lineTo(a.x + dx * end, a.y + dy * end)
      ctx.stroke()
    },
    drawMarker(point: Point) {
      ctx.beginPath()
      ctx.strokeStyle = 'red'
      ctx.ellipse(point.x, point.y, 5, 5, 0, 0, TAU)
      ctx.stroke()
    },
    drawPoints(points: Point[], style: string) {
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
    drawThickLine(
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

      draw.drawPoints(points, 'black')
    },
    drawPaths(paths: Path[], graph: Graph, size: number, gap: number) {
      paths.forEach(path => {
        path.nodes.forEach((node, i) => {
          const prevNode = pathIndex(path, i - 1),
            nextNode = pathIndex(path, i + 1)

          if (node.prev)
            draw.drawThickLine(
              graph[node.prev],
              graph[node.id],
              prevNode ? graph[prevNode.prev] : null,
              nextNode ? graph[nextNode.id] : null,
              node.startCross,
              node.endCross,
              size,
              gap
            )
        })
      })
    },
  }
  return draw
}
