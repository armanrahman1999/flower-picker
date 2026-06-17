'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface GrassTuftProps {
  x: number
  y: number
  depth: number
  variant: number
}

const GRASS_BASE = [0x2c5c10, 0x345810, 0x3a7018, 0x488020] as const
const GRASS_HIGHLIGHT = [0x3a7820, 0x4a8828, 0x52a030, 0x5cb038] as const

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function GrassTuft({ x, y, depth, variant }: GrassTuftProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    const rand = mulberry32(variant)
    const alpha = 0.5 + depth * 0.5
    const baseH = Math.round(7 + depth * 24)

    // choose single-blade with ~60% probability
    const singleBladeRoll = rand()
    let blades = [] as { ox: number; h: number; w: number }[]

    if (singleBladeRoll < 0.6) {
      // single tall blade centered
      blades = [
        { ox: 0, h: Math.round(baseH * (1.05 + rand() * 0.25)), w: 3 },
      ]
    } else {
      blades = [
        { ox: 0, h: baseH, w: 3 },
        { ox: -4 - Math.round(rand() * 2), h: Math.round(baseH * (0.62 + rand() * 0.12)), w: 2 },
        { ox: 4 + Math.round(rand() * 2), h: Math.round(baseH * (0.68 + rand() * 0.1)), w: 2 },
      ]

      if (depth > 0.45 && rand() > 0.35) {
        blades.push({
          ox: -7 + Math.round(rand() * 2),
          h: Math.round(baseH * 0.5),
          w: 2,
        })
      }
    }

    for (const blade of blades) {
      const colorIdx = Math.floor(rand() * GRASS_BASE.length)
      const base = GRASS_BASE[colorIdx]
      const highlight = GRASS_HIGHLIGHT[colorIdx]

      g.setFillStyle({ color: base, alpha })
      g.drawRect(blade.ox, -blade.h, blade.w, blade.h)
      g.fill()

      g.setFillStyle({ color: highlight, alpha: alpha * 0.85 })
      g.drawRect(blade.ox, -blade.h, 1, blade.h)
      g.fill()
    }
  }, [depth, variant])

  return <pixiGraphics draw={draw} x={x} y={y} />
}
