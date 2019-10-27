import { PI, MAX_LEN, MAX_PATHS } from './constants'
import { angleBetween, norm, snorm, sin, cos, tan, sortBy } from './util'
import { Point, CrossAngles, Path, Graph } from './types'

export function getThickLinePoly(
  a,
  b,
  prevCorner,
  nextCorner,
  crossStart,
  crossEnd,
  rad,
  srad
) {
  const thisAngle = angleBetween(a, b),
    upAngle = thisAngle + PI / 2,
    downAngle = thisAngle - PI / 2,
    xUp = cos(upAngle) * rad,
    yUp = sin(upAngle) * rad,
    xDown = cos(downAngle) * rad,
    yDown = sin(downAngle) * rad

  /* offesets based on corner rotations */
  let nextExt = tan(nextCorner / 2) * rad,
    prevExt = tan(prevCorner / 2) * rad,
    topNextCrossExt = -nextExt,
    bottomNextCrossExt = nextExt,
    topPrevCrossExt = prevExt,
    bottomPrevCrossExt = -prevExt,
    nextCenter = null,
    prevCenter = null

  /* crossingOffsets */
  function getCrossOffsets(crossing, start): any {
    const [topAngle, bottomAngle] = crossing,
      startFac = start ? -1 : 1,
      cbase = start ? a : b,
      crossUpAngle = topAngle + PI / 2 + thisAngle,
      crossX = cos(crossUpAngle) * srad,
      crossY = sin(crossUpAngle) * srad,
      crossExt = tan(PI / 2 - (topAngle - bottomAngle) / 2) * srad,
      crossExtX = cos(topAngle + thisAngle) * crossExt,
      crossExtY = sin(topAngle + thisAngle) * crossExt

    return [
      {
        x: cbase.x + startFac * (crossX - crossExtX),
        y: cbase.y + startFac * (crossY - crossExtY),
      },
      rad / tan(-bottomAngle) - (startFac * srad) / sin(-bottomAngle), //bottom cross ext
      rad / tan(topAngle) - (startFac * srad) / sin(topAngle),
    ]
  }

  if (crossEnd)
    [nextCenter, bottomNextCrossExt, topNextCrossExt] = getCrossOffsets(crossEnd, false)

  if (crossStart)
    [prevCenter, bottomPrevCrossExt, topPrevCrossExt] = getCrossOffsets(crossStart, true)

  const topNextExtX = cos(thisAngle) * topNextCrossExt,
    topNextExtY = sin(thisAngle) * topNextCrossExt

  const bottomNextExtX = cos(thisAngle) * bottomNextCrossExt,
    bottomNextExtY = sin(thisAngle) * bottomNextCrossExt

  const topPrevExtX = cos(thisAngle) * topPrevCrossExt,
    topPrevExtY = sin(thisAngle) * topPrevCrossExt

  const bottomPrevExtX = cos(thisAngle) * bottomPrevCrossExt,
    bottomPrevExtY = sin(thisAngle) * bottomPrevCrossExt

  const pt = { x: a.x + xUp + topPrevExtX, y: a.y + yUp + topPrevExtY },
    pb = { x: a.x + xDown + bottomPrevExtX, y: a.y + yDown + bottomPrevExtY },
    nt = { x: b.x + xUp + topNextExtX, y: b.y + yUp + topNextExtY },
    nb = { x: b.x + xDown + bottomNextExtX, y: b.y + yDown + bottomNextExtY }

  return [pt, prevCenter, pb, nb, nextCenter, nt].filter(a => a)
}

export function getPath(graph, root) {
  let prev = root,
    next = graph[prev].n[0],
    len = 0

  const path = [prev]

  while (next && next != root && len++ < MAX_LEN) {
    const possibleNext = graph[next].n.filter(id => id != prev)
    let newNext = null
    path.push(next)

    if (graph[next].n.length == 2) {
      //if at joint, just continue
      newNext = possibleNext[0]
    } else if (graph[next].n.length == 4) {
      //if at cross pick the middle option
      const thisAngle = angleBetween(graph[prev], graph[next]),
        rootAngle = thisAngle - PI,
        sopt = sortBy(possibleNext, n =>
          norm(angleBetween(graph[next], graph[n]) - rootAngle)
        )
      newNext = sopt[1]
    }
    // if at termination, newNext will still be null so shall term.
    prev = next
    next = newNext
  }
  if (len >= MAX_LEN) throw 'could not find path'
  return {
    nodes: path,
    loop: next == root,
  }
}

export function pathIndex(path, index) {
  return path.loop
    ? path.nodes[(index + path.nodes.length) % path.nodes.length]
    : path.nodes[index]
}

export function findPaths(graph): Path[] {
  //check if graph is valid
  for (let id in graph) {
    const len = graph[id].n.length
    if (len !== 2 && len !== 4 && len !== 1) return
    // if (DEBUG) {
    //   ctx.font = '20px serif'
    //   ctx.fillText(id, graph[id].x, graph[id].y)
    //   graph[id].n.forEach(nid => drawLine(graph[id], graph[nid]))
    // }
  }

  let pcount = 0
  const visited = {},
    paths = []

  // compute loop paths
  while (
    pcount++ < MAX_PATHS &&
    Object.keys(visited).length < Object.keys(graph).length
  ) {
    const root = Object.keys(graph).filter(
        id => !visited[id] && graph[id].n.length !== 4
      )[0],
      path = getPath(graph, root)
    path.nodes.forEach(id => {
      visited[id] = true
    })
    paths.push(path)
  }
  if (pcount >= MAX_PATHS) throw 'too many paths'

  //compute interlaces
  const lastInterlaceState = {},
    ipaths = paths.map(path => {
      const existingStart =
          path.nodes.filter(id => lastInterlaceState[id] !== undefined)[0] ||
          path.nodes[0],
        startIndex = path.nodes.indexOf(existingStart),
        initOver =
          lastInterlaceState[existingStart] !== undefined
            ? !lastInterlaceState[existingStart]
            : true

      let over = initOver

      const ipath = []
      // go forward
      for (let i = startIndex; i < path.nodes.length; i++) {
        const id = path.nodes[i],
          prev = pathIndex(path, i - 1),
          isCross = graph[id].n.length === 4,
          prevIsCross = !!(prev && graph[prev].n.length === 4)
        const res = {
          id,
          overStart: !prevIsCross || !over,
          overEnd: !isCross || over,
        }
        lastInterlaceState[id] = over
        if (isCross) over = !over
        ipath.push(res)
      }

      // go backward
      if (startIndex > 0) {
        over = initOver //reset over
        for (let i = startIndex - 1; i >= 0; i--) {
          const id = path.nodes[i],
            prev = pathIndex(path, i - 1),
            isCross = graph[id].n.length === 4,
            prevIsCross = !!(prev && graph[prev].n.length === 4)
          const res = {
            id,
            overStart: !prevIsCross || !over,
            overEnd: !isCross || over,
          }
          lastInterlaceState[id] = over
          if (isCross) over = !over

          ipath.unshift(res)
        }
      }

      console.log(ipath)
      path.nodes = ipath

      // compute cross angles data
      const nodesWithCrossData = path.nodes.map((node, i) => {
        const prev = pathIndex(path, i - 1),
          prevPrev = pathIndex(path, i - 2),
          next = pathIndex(path, i + 1)

        const resNode = {
          id: node.id,
          prev,
          startCross: null,
          endCross: null,
        }

        if (prev && (!node.overStart || !node.overEnd)) {
          const thisAngle = angleBetween(graph[prev.id], graph[node.id])
          if (!node.overEnd)
            resNode.endCross = graph[node.id].n
              .filter(nid => nid != (next && next.id) && nid != prev.id && nid != node.id)
              .map(nid => snorm(angleBetween(graph[node.id], graph[nid]) - thisAngle))
              .sort((a, b) => b - a)
          if (!node.overStart)
            resNode.startCross = graph[prev.id].n
              .filter(
                nid =>
                  nid != (prevPrev && prevPrev.id) && nid != prev.id && nid != node.id
              )
              .map(nid => snorm(angleBetween(graph[prev.id], graph[nid]) - thisAngle))
              .sort((a, b) => b - a)
        }

        if (prev) resNode.prev = prev && prev.id
        return resNode
      })

      return {
        nodes: nodesWithCrossData,
        loop: path.loop,
      }
    })

  return ipaths
}
