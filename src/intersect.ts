import { checkIntersection } from 'line-intersect'
import { Graph, Point, Node } from './types'
import { join } from 'path'
import { equalPoints } from './util'

interface Intersection {
  a: (string | number)[]
  b: (string | number)[]
  point: Point
}

function findIntersection(graph: Graph): Intersection {
  for (let id in graph) {
    const node = graph[id]
    for (let n in node.n) {
      const aid = node.n[n],
        adj = graph[aid]
      for (let otherId in graph) {
        if (otherId == id || otherId == aid) continue
        const other = graph[otherId]
        for (let nn in other.n) {
          const aotherId = other.n[nn],
            aother = graph[aotherId]
          if (aotherId != id && aotherId != aid) {
            const intersect = checkIntersection(
              node.x,
              node.y,
              adj.x,
              adj.y,
              other.x,
              other.y,
              aother.x,
              aother.y
            )
            if (intersect.point) {
              const overlap = !![node, adj, other, aother].filter(p =>
                equalPoints(intersect.point, p)
              ).length
              if (!overlap)
                return {
                  a: [id, aid],
                  b: [otherId, aotherId],
                  point: intersect.point,
                }
            }
          }
        }
      }
    }
  }
  return null
}

export default function(graph: Graph) {
  //console.log('int', graph)
  let int,
    i = 0
  while ((int = findIntersection(graph)) && i++ < 10000) {
    const neighbors = int.a.concat(int.b),
      newId = i + 1000 + '' //`(${int.a})-(${int.b})`
    //console.log(i, int)
    graph[newId] = {
      ...int.point,
      n: neighbors,
    }
    ;[int.a, int.b].forEach(pair => {
      pair.forEach(nid => {
        graph[nid].n.push(newId)
        graph[nid].n = graph[nid].n.filter(nnid => nnid != pair[0] && nnid != pair[1])
      })
    })
  }

  //console.log(graph)
}
