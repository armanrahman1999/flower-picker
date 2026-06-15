'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface FlowerStemProps {
  x: number
  y: number
}

export default function FlowerStem({ x, y }: FlowerStemProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    const P = 8

    // stem
    g.setFillStyle({ color: 0x3A7820 })
    g.drawRect(-P, 0, P, -18*P)
    g.fill()

    g.setFillStyle({ color: 0x2D6018 })
    g.drawRect(0, 0, P, -18*P)
    g.fill()

    // left leaf
    g.setFillStyle({ color: 0x3A7820 })
    g.drawRect(-4*P, -8*P, 3*P, P)
    g.fill()
    g.drawRect(-5*P, -9*P, 3*P, P)
    g.fill()

    g.setFillStyle({ color: 0x4A8828 })
    g.drawRect(-4*P, -9*P, 2*P, P)
    g.fill()

    // right leaf
    g.setFillStyle({ color: 0x3A7820 })
    g.drawRect(P, -12*P, 3*P, P)
    g.fill()
    g.drawRect(2*P, -13*P, 3*P, P)
    g.fill()

    g.setFillStyle({ color: 0x4A8828 })
    g.drawRect(2*P, -12*P, 2*P, P)
    g.fill()

    // ── FLOWER HEAD ──
    const P2 = P
    const fx = 0
    const fy = -19*P

    // petals
    g.setFillStyle({ color: 0xFF6090 })
    // top
    g.drawRect(fx - P2,     fy - 3*P2, 2*P2, 2*P2)
    g.fill()
    // bottom
    g.drawRect(fx - P2,     fy + 2*P2, 2*P2, 2*P2)
    g.fill()
    // left
    g.drawRect(fx - 3*P2,   fy - P2,   2*P2, 2*P2)
    g.fill()
    // right
    g.drawRect(fx + P2,     fy - P2,   2*P2, 2*P2)
    g.fill()

    // diagonal petals
    g.setFillStyle({ color: 0xFF80A8 })
    g.drawRect(fx - 3*P2,   fy - 3*P2, 2*P2, 2*P2)
    g.fill()
    g.drawRect(fx + P2,     fy - 3*P2, 2*P2, 2*P2)
    g.fill()
    g.drawRect(fx - 3*P2,   fy + P2,   2*P2, 2*P2)
    g.fill()
    g.drawRect(fx + P2,     fy + P2,   2*P2, 2*P2)
    g.fill()

    // center yellow
    g.setFillStyle({ color: 0xFFD040 })
    g.drawRect(fx - P2, fy - P2, 2*P2, 2*P2)
    g.fill()

    // center dots
    g.setFillStyle({ color: 0xE8A020 })
    g.drawRect(fx - P2/2, fy - P2/2, P2/2, P2/2)
    g.fill()
    g.drawRect(fx,        fy - P2/2, P2/2, P2/2)
    g.fill()
    g.drawRect(fx - P2/2, fy,        P2/2, P2/2)
    g.fill()
    g.drawRect(fx,        fy,        P2/2, P2/2)
    g.fill()

  }, [])

  return <pixiGraphics draw={draw} x={x} y={y} />
}