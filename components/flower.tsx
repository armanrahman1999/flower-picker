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
    g.setFillStyle({ color: 0x3A7820 })
    g.drawRect(-2, -24, 4, 24)
    g.fill()

    // petals (4 directions)
    g.setFillStyle({ color: petalColor })
    g.drawRect(-8, -36, 6, 6)   // left
    g.drawRect(2, -36, 6, 6)    // right
    g.drawRect(-2, -42, 6, 6)   // top
    g.drawRect(-2, -30, 6, 6)   // bottom
    g.fill()

    // center
    g.setFillStyle({ color: 0xFFD040 })
    g.drawRect(-2, -38, 6, 6)
    g.fill()

  }, [petalColor])

  return <pixiGraphics draw={draw} x={x} y={y} />
}