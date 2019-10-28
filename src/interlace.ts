import { angleBetween, sin, cos, tan, PI } from './util'
import { Point, CrossAngles } from './types'

export function getThickLinePoly(
  a: Point,
  b: Point,
  prevCorner: number,
  nextCorner: number,
  crossStart: CrossAngles,
  crossEnd: CrossAngles,
  rad: number,
  srad: number
): Point[] {
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
    nextCenter: Point = null,
    prevCenter: Point = null

  /* crossingOffsets */
  function getCrossOffsets(
    crossing: CrossAngles,
    start: boolean
  ): [Point, number, number] {
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