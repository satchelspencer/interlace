import { angleBetween, norm, snorm, sortBy, PI } from './util'
import { Path, Graph, PathNode } from './types'

const MAX_LEN = 1000,
  MAX_PATHS = 100

export function getPath(graph: Graph, root: string | number): Path {
  let prev = root,
    next = graph[prev].n[0],
    len = 0

  const path = [{ id: prev }]

  while (next && next != root && len++ < MAX_LEN) {
    const possibleNext = graph[next].n.filter(id => id != prev)
    let newNext = null
    path.push({ id: next })

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

export function pathIndex(path: Path, index: number) {
  return path.loop
    ? path.nodes[(index + path.nodes.length) % path.nodes.length]
    : path.nodes[index]
}

export function findPaths(graph: Graph): Path[] {
  //check if graph is valid
  for (let id in graph) {
    const len = graph[id].n.length
    if (len !== 2 && len !== 4 && len !== 1) return []
  }

  let pcount = 0
  const visited = {},
    paths: Path[] = []

  // compute loop paths
  while (
    pcount++ < MAX_PATHS &&
    Object.keys(visited).length < Object.keys(graph).length
  ) {
    const root = Object.keys(graph).filter(
        id => !visited[id] && graph[id].n.length !== 4
      )[0],
      path = getPath(graph, root)
    path.nodes.forEach(node => {
      visited[node.id] = true
    })
    paths.push(path)
  }
  if (pcount >= MAX_PATHS) throw 'too many paths'


  //console.log(paths)
  //compute interlaces
  const lastInterlaceState = {},
    ipaths: Path[] = paths.map(path => {
      const existingStart =
          path.nodes.filter(node => lastInterlaceState[node.id] !== undefined)[0] ||
          path.nodes[0],
        startIndex = path.nodes.indexOf(existingStart),
        initOver =
          lastInterlaceState[existingStart.id] !== undefined
            ? !lastInterlaceState[existingStart.id]
            : true

      //console.log(existingStart, initOver, lastInterlaceState[existingStart.id])

      let over = initOver

      const ipath: PathNode[] = []
      // go forward
      for (let i = startIndex; i < path.nodes.length; i++) {
        const node = path.nodes[i],
          prev = pathIndex(path, i - 1),
          isCross = graph[node.id].n.length === 4,
          prevIsCross = !!(prev && graph[prev.id].n.length === 4)
        const res: PathNode = {
          id: node.id,
          startCross: (!prevIsCross || !over) ? null : [0, 0],
          endCross: (!isCross || over) ? null : [0, 0],
        }
        lastInterlaceState[node.id] = over
        if (isCross) over = !over
        ipath.push(res)
      }

      // go backward
      if (startIndex > 0) {
        over = initOver //reset over
        for (let i = startIndex - 1; i >= 0; i--) {
          const node = path.nodes[i],
            prev = pathIndex(path, i - 1),
            isCross = graph[node.id].n.length === 4,
            prevIsCross = !!(prev && graph[prev.id].n.length === 4)
          const res: PathNode = {
            id: node.id,
            startCross: (!prevIsCross || !over) ? null : [0, 0],
            endCross: (!isCross || over) ? null : [0, 0],
          }
          lastInterlaceState[node.id] = over
          if (isCross) over = !over

          ipath.unshift(res)
        }
      }

      path.nodes = ipath

      // compute cross angles data
      const nodesWithCrossData = path.nodes.map((node, i) => {
        const prev = pathIndex(path, i - 1),
          prevPrev = pathIndex(path, i - 2),
          next = pathIndex(path, i + 1)

        const resNode: PathNode = {
          id: node.id,
          prev: prev ? prev.id : null,
          startCross: null,
          endCross: null,
        }

        if (prev && (node.startCross || node.endCross)) {
          const thisAngle = angleBetween(graph[prev.id], graph[node.id])
          if (node.endCross)
            resNode.endCross = graph[node.id].n
              .filter(nid => nid != (next && next.id) && nid != prev.id && nid != node.id)
              .map(nid => snorm(angleBetween(graph[node.id], graph[nid]) - thisAngle))
              .sort((a, b) => b - a)
          if (node.startCross)
            resNode.startCross = graph[prev.id].n
              .filter(
                nid =>
                  nid != (prevPrev && prevPrev.id) && nid != prev.id && nid != node.id
              )
              .map(nid => snorm(angleBetween(graph[prev.id], graph[nid]) - thisAngle))
              .sort((a, b) => b - a)
        }

        if (prev) resNode.prev = prev.id
        return resNode
      })

      return {
        nodes: nodesWithCrossData,
        loop: path.loop,
      }
    })

  return ipaths
}
