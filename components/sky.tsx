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
      g.rect(0, currentY, width, band.h)
      g.fill(band.color)
      currentY += band.h
    }

  }, [width, height])

  // clouds
  const drawClouds = useCallback((g: Graphics) => {
    g.clear()

    // left cloud
    g.rect(140, 95, 8, 8)
    g.rect(148, 90, 8, 8)
    g.rect(156, 90, 8, 8)
    g.rect(164, 90, 8, 8)
    g.rect(172, 95, 8, 8)
    g.rect(148, 95, 24, 8)
    g.fill(0xF0C8D8)

    // right cloud
    g.rect(620, 135, 8, 8)
    g.rect(628, 130, 8, 8)
    g.rect(636, 130, 8, 8)
    g.rect(644, 130, 8, 8)
    g.rect(652, 135, 8, 8)
    g.rect(628, 135, 24, 8)
    g.fill(0xF0C8D8)

  }, [])

  return (
    <>
      <pixiGraphics draw={draw} x={0} y={0} />
      <pixiGraphics draw={drawClouds} x={0} y={0} />
    </>
  )
}