'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface FlowerProps {
  x: number
  y: number
  petalColor?: number
}

export default function Flower({ x, y, petalColor = 0xFF6090 }: FlowerProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    // stem
    g.rect(-2, -24, 4, 24)
    g.fill(0x3A7820)

    // petals (4 directions)
    g.rect(-8, -36, 6, 6)   // left
    g.rect(2, -36, 6, 6)    // right
    g.rect(-2, -42, 6, 6)   // top
    g.rect(-2, -30, 6, 6)   // bottom
    g.fill(petalColor)

    // center
    g.rect(-2, -38, 6, 6)
    g.fill(0xFFD040)

  }, [petalColor])

  return <pixiGraphics draw={draw} x={x} y={y} />
}