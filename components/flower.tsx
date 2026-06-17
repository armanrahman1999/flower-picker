'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface FlowerProps {
  x: number
  y: number
  scale?: number
  petalColor?: number
}

export default function Flower({ x, y, scale = 1, petalColor = 0xFF6090 }: FlowerProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    const s = scale
    // stem
    g.setFillStyle({ color: 0x3A7820 })
    g.drawRect(-2 * s, -24 * s, 4 * s, 24 * s)
    g.fill()

    // petals (4 directions)
    g.setFillStyle({ color: petalColor })
    g.drawRect(-8 * s, -36 * s, 6 * s, 6 * s)
    g.drawRect(2 * s, -36 * s, 6 * s, 6 * s)
    g.drawRect(-2 * s, -42 * s, 6 * s, 6 * s)
    g.drawRect(-2 * s, -30 * s, 6 * s, 6 * s)
    g.fill()

    // center
    g.setFillStyle({ color: 0xFFD040 })
    g.drawRect(-2 * s, -38 * s, 6 * s, 6 * s)
    g.fill()

  }, [petalColor, scale])

  return <pixiGraphics draw={draw} x={x} y={y} />
}