'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface SkyProps {
  width?: number
  height?: number
}

export default function Sky({ width = 800, height = 600 }: SkyProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    // each band matches the image top to bottom
    const bands = [
      { color: 0x1A0E3A, h: 40 },   // dark navy
      { color: 0x2D1B5E, h: 35 },   // deep indigo
      { color: 0x5B1F7A, h: 35 },   // purple
      { color: 0x8B2080, h: 30 },   // magenta purple
      { color: 0xBE2060, h: 30 },   // pink red
      { color: 0xD93828, h: 30 },   // red
      { color: 0xE85020, h: 28 },   // orange red
      { color: 0xF06818, h: 28 },   // orange
      { color: 0xF58018, h: 26 },   // amber orange
      { color: 0xF9A020, h: 26 },   // amber
      { color: 0xFBB830, h: 24 },   // golden amber
      { color: 0xFDCC50, h: 22 },   // golden yellow
      { color: 0xFEDA70, h: 20 },   // yellow
      { color: 0xFEE890, h: 18 },   // pale yellow
      { color: 0xFFF0B0, h: 16 },   // cream
    ]

    let currentY = 0
    for (const band of bands) {
      g.setFillStyle({ color: band.color })
      g.drawRect(0, currentY, width, band.h)
      g.fill()
      currentY += band.h
    }

  }, [width, height])

  // clouds
  const drawClouds = useCallback((g: Graphics) => {
    g.clear()

    g.setFillStyle({ color: 0xF0C8D8 })
    // left cloud (puffs)
    g.drawCircle(144, 99, 8)
    g.drawCircle(156, 96, 10)
    g.drawCircle(168, 96, 10)
    g.drawCircle(180, 96, 10)
    g.drawCircle(192, 99, 8)
    // base
    g.drawRect(148, 99, 48, 16)

    // right cloud (puffs)
    g.drawCircle(624, 139, 8)
    g.drawCircle(636, 136, 10)
    g.drawCircle(648, 136, 10)
    g.drawCircle(660, 136, 10)
    g.drawCircle(672, 139, 8)
    g.drawRect(628, 139, 48, 16)
    g.fill()

  }, [])

  return (
    <>
      <pixiGraphics draw={draw} x={0} y={0} />
      <pixiGraphics draw={drawClouds} x={0} y={0} />
    </>
  )
}