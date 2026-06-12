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

    // each band matches the image top to bottom (scaled to current height)
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

    // scale bands to fill height proportionally
    const totalBandHeight = bands.reduce((s, b) => s + b.h, 0)
    const scale = height / totalBandHeight

    let currentY = 0
    for (const band of bands) {
      const h = Math.max(1, Math.round(band.h * scale))
      g.setFillStyle({ color: band.color })
      g.drawRect(0, currentY, width, h)
      g.fill()
      currentY += h
    }

  }, [width, height])

  // clouds
  const drawClouds = useCallback((g: Graphics) => {
    g.clear()
    g.setFillStyle({ color: 0xF0C8D8 })

    // position clouds as fractions of width/height
    const lx = Math.round(width * 0.18)
    const ly = Math.round(height * 0.16)
    const rx = Math.round(width * 0.78)
    const ry = Math.round(height * 0.22)

    g.drawCircle(lx - 8, ly, Math.round(Math.max(6, width * 0.01)))
    g.drawCircle(lx + 8, ly - 3, Math.round(Math.max(8, width * 0.012)))
    g.drawCircle(lx + 24, ly - 3, Math.round(Math.max(8, width * 0.012)))
    g.drawCircle(lx + 40, ly - 3, Math.round(Math.max(8, width * 0.012)))
    g.drawCircle(lx + 56, ly, Math.round(Math.max(6, width * 0.01)))
    g.drawRect(lx + 8, ly, Math.round(width * 0.06), Math.round(height * 0.03))

    g.drawCircle(rx - 8, ry, Math.round(Math.max(6, width * 0.01)))
    g.drawCircle(rx + 8, ry - 3, Math.round(Math.max(8, width * 0.012)))
    g.drawCircle(rx + 24, ry - 3, Math.round(Math.max(8, width * 0.012)))
    g.drawCircle(rx + 40, ry - 3, Math.round(Math.max(8, width * 0.012)))
    g.drawCircle(rx + 56, ry, Math.round(Math.max(6, width * 0.01)))
    g.drawRect(rx + 8, ry, Math.round(width * 0.06), Math.round(height * 0.03))

    g.fill()

  }, [width, height])

  return (
    <>
      <pixiGraphics draw={draw} x={0} y={0} />
      <pixiGraphics draw={drawClouds} x={0} y={0} />
    </>
  )
}