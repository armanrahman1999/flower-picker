'use client'

import { extend, useApplication } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

export default function Sky() {
  const { app } = useApplication()
  const width = app?.renderer?.width ?? 800
  const height = app?.renderer?.height ?? 600

  const draw = useCallback((g: Graphics) => {
    g.clear()

    const bands = [
      { color: 0x1A0E3A, h: 40 },
      { color: 0x2D1B5E, h: 35 },
      { color: 0x5B1F7A, h: 35 },
      { color: 0x8B2080, h: 30 },
      { color: 0xBE2060, h: 30 },
      { color: 0xD93828, h: 30 },
      { color: 0xE85020, h: 28 },
      { color: 0xF06818, h: 28 },
      { color: 0xF58018, h: 26 },
      { color: 0xF9A020, h: 26 },
      { color: 0xFBB830, h: 24 },
      { color: 0xFDCC50, h: 22 },
      { color: 0xFEDA70, h: 20 },
      { color: 0xFEE890, h: 18 },
      { color: 0xFFF0B0, h: 16 },
    ]

    const totalBandHeight = bands.reduce((s, b) => s + b.h, 0)
    const scaleFactor = height / totalBandHeight

    let currentY = 0
    for (const band of bands) {
      const h = Math.max(1, Math.round(band.h * scaleFactor))
      g.setFillStyle({ color: band.color })
      g.drawRect(0, currentY, width, h)
      g.fill()
      currentY += h
    }

  }, [width, height])

  const drawSun = useCallback((g: Graphics) => {
    g.clear()

    const P = 8  // pixel block size
    // position sun center — horizontally centered, low in sky near horizon
    const cx = Math.round(width * 0.5)
    const cy = Math.round(height * 0.55)

    // sun glow (outermost, faint yellow)
    const glowCells = [
      [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
      [0,1],[6,1],
      [0,2],[6,2],
      [0,3],[6,3],
      [0,4],[6,4],
      [0,5],[6,5],
      [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
    ]
    for (const [col, row] of glowCells) {
      g.rect(cx + (col - 3) * P, cy + (row - 3) * P, P, P)
    }
    g.fill(0xFFF5C0)

    // sun body (bright white-yellow)
    const bodyRows = [
      [0,0,1,1,1,0,0],
      [0,1,1,1,1,1,0],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [0,1,1,1,1,1,0],
      [0,0,1,1,1,0,0],
    ]
    for (let row = 0; row < bodyRows.length; row++) {
      for (let col = 0; col < bodyRows[row].length; col++) {
        if (bodyRows[row][col] === 1) {
          g.rect(cx + (col - 3) * P, cy + (row - 3) * P, P, P)
        }
      }
    }
    g.fill(0xFFE060)

    // sun core (brightest center)
    const coreCells = [
      [2,2],[3,2],[4,2],
      [2,3],[3,3],[4,3],
      [2,4],[3,4],[4,4],
    ]
    for (const [col, row] of coreCells) {
      g.rect(cx + (col - 3) * P, cy + (row - 3) * P, P, P)
    }
    g.fill(0xFFFFCC)

    // sun rays (pixel style, 8 directions)
    const rayColor = 0xFFE060

    // top ray
    g.rect(cx - P/2, cy - 5*P, P, P)
    g.fill(rayColor)

    // bottom ray
    g.rect(cx - P/2, cy + 4*P, P, P)
    g.fill(rayColor)

    // left ray
    g.rect(cx - 5*P, cy - P/2, P, P)
    g.fill(rayColor)

    // right ray
    g.rect(cx + 4*P, cy - P/2, P, P)
    g.fill(rayColor)

    // top-left ray
    g.rect(cx - 4*P, cy - 4*P, P, P)
    g.fill(rayColor)

    // top-right ray
    g.rect(cx + 3*P, cy - 4*P, P, P)
    g.fill(rayColor)

    // bottom-left ray
    g.rect(cx - 4*P, cy + 3*P, P, P)
    g.fill(rayColor)

    // bottom-right ray
    g.rect(cx + 3*P, cy + 3*P, P, P)
    g.fill(rayColor)

  }, [width, height])

  const drawClouds = useCallback((g: Graphics) => {
    g.clear()

    const P = 8

    const drawCloud = (cx: number, cy: number) => {
      g.rect(cx + P,  cy - P * 2, P * 3, P)
      g.rect(cx,      cy - P,     P * 5, P)
      g.rect(cx - P,  cy,         P * 7, P)
      g.rect(cx,      cy + P,     P * 5, P)
    }

    drawCloud(Math.round(width * 0.13), Math.round(height * 0.16))
    drawCloud(Math.round(width * 0.68), Math.round(height * 0.22))

    g.fill(0xF0C8D8)

  }, [width, height])

  return (
    <>
      <pixiGraphics draw={draw} x={0} y={0} />
      <pixiGraphics draw={drawSun} x={10} y={-200} />
      <pixiGraphics draw={drawClouds} x={0} y={0} />
    </>
  )
}