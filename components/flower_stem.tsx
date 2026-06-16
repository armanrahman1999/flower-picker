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

    const P = 12

    // stem
    g.rect(-P/2, -14*P, P/2, 14*P)
    g.fill({ color: 0x1E3F10 })

    g.rect(0, -14*P, P/2, 14*P)
    g.fill({ color: 0x2D6018 })

    // left leaf
    g.rect(-4*P, -8*P, 3*P, P)
    g.fill({ color: 0x3A7820 })

    g.rect(-5*P, -9*P, 3*P, P)
    g.fill({ color: 0x3A7820 })

    g.rect(-4*P, -9*P, 2*P, P)
    g.fill({ color: 0x4A8828 })

    // right leaf
    g.rect(P, -6*P, 3*P, P)
    g.fill({ color: 0x3A7820 })

    g.rect(2*P, -6*P, 3*P, P)
    g.fill({ color: 0x3A7820 })

    g.rect(P, -7*P, 2*P, P)
    g.fill({ color: 0x4A8828 })

    // ── FLOWER HEAD ──
    const fx = 0
    const fy = -13 * P

    // each petal: a tall box + a wider box at the base, stacked outward
    // top petal
    g.rect(fx - P,     fy - 4*P,  2*P,   P)
    g.fill({ color: 0xFF4A7A })
    g.rect(fx - P,     fy - 3*P,  2*P,   P)
    g.fill({ color: 0xFF5C8A })
    g.rect(fx - P/2,   fy - 5*P,  P,     P)
    g.fill({ color: 0xFF80A8 })

    // bottom petal
    g.rect(fx - P,     fy + 2*P,  2*P,   P)
    g.fill({ color: 0xFF4A7A })
    g.rect(fx - P,     fy + 3*P,  2*P,   P)
    g.fill({ color: 0xFF5C8A })
    g.rect(fx - P/2,   fy + 4*P,  P,     P)
    g.fill({ color: 0xFF80A8 })

    // left petal
    g.rect(fx - 4*P,   fy - P,    P,     2*P)
    g.fill({ color: 0xFF4A7A })
    g.rect(fx - 3*P,   fy - P,    P,     2*P)
    g.fill({ color: 0xFF5C8A })
    g.rect(fx - 5*P,   fy - P/2,  P,     P)
    g.fill({ color: 0xFF80A8 })

    // right petal
    g.rect(fx + 2*P,   fy - P,    P,     2*P)
    g.fill({ color: 0xFF4A7A })
    g.rect(fx + 3*P,   fy - P,    P,     2*P)
    g.fill({ color: 0xFF5C8A })
    g.rect(fx + 4*P,   fy - P/2,  P,     P)
    g.fill({ color: 0xFF80A8 })

    // top-left diagonal petal
    g.rect(fx - 3*P,   fy - 3*P,  2*P,   2*P)
    g.fill({ color: 0xFF5C8A })
    g.rect(fx - 5*P,   fy - 5*P,  3*P,   3*P)
    g.fill({ color: 0xFF80A8 })

    // top-right diagonal petal
    g.rect(fx + P,     fy - 3*P,  2*P,   2*P)
    g.fill({ color: 0xFF5C8A })
    g.rect(fx + 2*P,   fy - 5*P,  3*P,   3*P)
    g.fill({ color: 0xFF80A8 })

    // bottom-left diagonal petal
    g.rect(fx - 3*P,   fy + P,    2*P,   2*P)
    g.fill({ color: 0xFF5C8A })
    g.rect(fx - 5*P,   fy + 2*P,  3*P,   3*P)
    g.fill({ color: 0xFF80A8 })

    // bottom-right diagonal petal
    g.rect(fx + P,     fy + P,    2*P,   2*P)
    g.fill({ color: 0xFF5C8A })
    g.rect(fx + 2*P,   fy + 2*P,  3*P,   3*P)
    g.fill({ color: 0xFF80A8 })

    // center yellow
    g.rect(fx - P,   fy - P,   2*P,  2*P)
    g.fill({ color: 0xFFD040 })

    // center detail dots
    g.rect(fx - P/2, fy - P/2, P/2, P/2)
    g.fill({ color: 0xE8A020 })
    g.rect(fx,       fy - P/2, P/2, P/2)
    g.fill({ color: 0xE8A020 })
    g.rect(fx - P/2, fy,       P/2, P/2)
    g.fill({ color: 0xE8A020 })
    g.rect(fx,       fy,       P/2, P/2)
    g.fill({ color: 0xE8A020 })

  }, [])

  return <pixiGraphics draw={draw} x={x} y={y} />
}