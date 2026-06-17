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

    // ── STEM ──
    g.setFillStyle({ color: 0x3A7820 })
    g.drawRect(-P, -22*P, P, 22*P)
    g.fill()

    g.setFillStyle({ color: 0x2D6018 })
    g.drawRect(0, -22*P, P, 22*P)
    g.fill()

    // left leaf
    g.setFillStyle({ color: 0x3A7820 })
    g.drawRect(-4*P, -10*P, 3*P, P)
    g.fill()
    g.drawRect(-5*P, -11*P, 3*P, P)
    g.fill()
    g.setFillStyle({ color: 0x4A8828 })
    g.drawRect(-4*P, -11*P, 2*P, P)
    g.fill()

    // right leaf
    g.setFillStyle({ color: 0x3A7820 })
    g.drawRect(P,   -14*P, 3*P, P)
    g.fill()
    g.drawRect(2*P, -15*P, 3*P, P)
    g.fill()
    g.setFillStyle({ color: 0x4A8828 })
    g.drawRect(2*P, -14*P, 2*P, P)
    g.fill()

   

    // ── FLOWER HEAD ──
    // petals are 20% bigger so use 1.2 multiplier
    const S = P * 1.2   // scaled pixel = 9.6px
    const fx = 0
    const fy = -22*P

    // ── OUTER DARK PINK RING (outermost petal edges) ──
    const outerPink = 0xE8407A

    // top
    g.setFillStyle({ color: outerPink })
    g.drawRect(fx - S,       fy - 5*S, 2*S, S)
    g.fill()
    // bottom
    g.drawRect(fx - S,       fy + 3*S, 2*S, S)
    g.fill()
    // left
    g.drawRect(fx - 5*S,     fy - S,   S,   2*S)
    g.fill()
    // right
    g.drawRect(fx + 3*S,     fy - S,   S,   2*S)
    g.fill()
    // top-left corner
    g.drawRect(fx - 4*S,     fy - 4*S, S,   S)
    g.fill()
    // top-right corner
    g.drawRect(fx + 2*S,     fy - 4*S, S,   S)
    g.fill()
    // bottom-left corner
    g.drawRect(fx - 4*S,     fy + 2*S, S,   S)
    g.fill()
    // bottom-right corner
    g.drawRect(fx + 2*S,     fy + 2*S, S,   S)
    g.fill()

    // ── MAIN PETAL BODY (bright pink) ──
    const mainPink = 0xFF6090

    // top petal block
    g.setFillStyle({ color: mainPink })
    g.drawRect(fx - 2*S, fy - 5*S, 4*S, 2*S)
    g.fill()
    // bottom petal block
    g.drawRect(fx - 2*S, fy + 2*S, 4*S, 2*S)
    g.fill()
    // left petal block
    g.drawRect(fx - 5*S, fy - 2*S, 2*S, 4*S)
    g.fill()
    // right petal block
    g.drawRect(fx + 3*S, fy - 2*S, 2*S, 4*S)
    g.fill()
    // corner petals
    g.drawRect(fx - 4*S, fy - 4*S, 2*S, 2*S)
    g.fill()
    g.drawRect(fx + 2*S, fy - 4*S, 2*S, 2*S)
    g.fill()
    g.drawRect(fx - 4*S, fy + 2*S, 2*S, 2*S)
    g.fill()
    g.drawRect(fx + 2*S, fy + 2*S, 2*S, 2*S)
    g.fill()

    // ── INNER LIGHT PINK (petal highlight/inner ring) ──
    const lightPink = 0xFF9FBF

    // top inner
    g.setFillStyle({ color: lightPink })
    g.drawRect(fx - S,   fy - 4*S, 2*S, S)
    g.fill()
    // left inner
    g.drawRect(fx - 4*S, fy - S,   S,   2*S)
    g.fill()
    // right inner
    g.drawRect(fx + 3*S, fy - S,   S,   2*S)
    g.fill()

    // ── BIG SQUARE YELLOW CENTER ──
    g.setFillStyle({ color: 0xFFD040 })
    g.drawRect(fx - 2*S, fy - 2*S, 4*S, 4*S)
    g.fill()

    // center highlight (top-left of center is lighter)
    g.setFillStyle({ color: 0xFFE878 })
    g.drawRect(fx - 2*S, fy - 2*S, 2*S, S)
    g.fill()

    // ── DOT GRID inside center (3x3 dark amber dots) ──
    const dot = 0xC87010
    const dotSize = S * 0.5
    const dotGap  = S * 1.1

    g.setFillStyle({ color: dot })
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        g.drawRect(
          fx - S + col * dotGap,
          fy - S + row * dotGap,
          dotSize,
          dotSize
        )
        g.fill()
      }
    }

  }, [])

  return <pixiGraphics draw={draw} x={x} y={y} />
}