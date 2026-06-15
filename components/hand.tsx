'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface HandProps {
  x: number
  y: number
}

export default function Hand({ x, y }: HandProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    const P = 10  // pixel size
    const skin     = 0xD4956A
    const skinDark = 0xB87845
    const skinLight = 0xE2A77E

    // ── ARM ──
    g.setFillStyle({ color: skin })
    g.drawRect(-4*P, 8*P, 8*P, 10*P)
    g.fill()

    // arm shadow left
    g.setFillStyle({ color: skinDark })
    g.drawRect(-4*P, 8*P, P, 10*P)
    g.fill()

    // arm highlight right
    g.setFillStyle({ color: skinLight })
    g.drawRect(2*P, 8*P, P, 10*P)
    g.fill()

    // ── PALM ──
    g.setFillStyle({ color: skin })
    g.drawRect(-4*P, 3*P, 9*P, 6*P)
    g.fill()

    // palm highlight
    g.setFillStyle({ color: skinLight })
    g.drawRect(-3*P, 3*P, 6*P, 2*P)
    g.fill()

// ── THUMB ──

// thumb base connected to palm
g.setFillStyle({ color: skin })
g.drawRect(-6 * P, 4 * P, 2 * P, 4 * P)
g.fill()

g.setFillStyle({ color: skinDark })
g.drawRect(-6 * P, 4 * P, P, 4 * P)
g.fill()

g.setFillStyle({ color: skinLight })
g.drawRect(-5 * P, 4 * P, P, 2 * P)
g.fill()

// thumb extension
g.setFillStyle({ color: skin })
g.drawRect(-8 * P, 3 * P, 2 * P, 5 * P)
g.fill()

g.setFillStyle({ color: skinDark })
g.drawRect(-8 * P, 2 * P, P, 6 * P)
g.fill()

g.setFillStyle({ color: skinLight })
g.drawRect(-7 * P, 3 * P, P, 2 * P)
g.fill()

// rounded thumb tip
g.setFillStyle({ color: skin })
g.drawRect(-7 * P, 2 * P, P, P)
g.fill()

    // ── FINGERS ──
    // index finger
    g.setFillStyle({ color: skin })
    g.drawRect(-4*P, -4*P, 2*P, 8*P)
    g.fill()
    g.setFillStyle({ color: skinDark })
    g.drawRect(-4*P, -4*P, P, 8*P)
    g.fill()
    g.setFillStyle({ color: skinLight })
    g.drawRect(-3*P, -4*P, P, 2*P)
    g.fill()
    // fingertip
    g.setFillStyle({ color: skin })
    g.drawRect(-4*P, -5*P, 2*P, P)
    g.fill()

    // middle finger (tallest)
    g.setFillStyle({ color: skin })
    g.drawRect(-1.5*P, -6*P, 2*P, 10*P)
    g.fill()
    g.setFillStyle({ color: skinDark })
    g.drawRect(-1.5*P, -6*P, P, 10*P)
    g.fill()
    g.setFillStyle({ color: skinLight })
    g.drawRect(-0.5*P, -6*P, P, 2*P)
    g.fill()
    // fingertip
    g.setFillStyle({ color: skin })
    g.drawRect(-1.5*P, -7*P, 2*P, P)
    g.fill()

    // ring finger
    g.setFillStyle({ color: skin })
    g.drawRect(1*P, -5*P, 2*P, 9*P)
    g.fill()
    g.setFillStyle({ color: skinDark })
    g.drawRect(1*P, -5*P, P, 9*P)
    g.fill()
    g.setFillStyle({ color: skinLight })
    g.drawRect(2*P, -5*P, P, 2*P)
    g.fill()
    // fingertip
    g.setFillStyle({ color: skin })
    g.drawRect(1*P, -6*P, 2*P, P)
    g.fill()

    // pinky finger (shortest)
    g.setFillStyle({ color: skin })
    g.drawRect(3.5*P, -3*P, 2*P, 7*P)
    g.fill()
    g.setFillStyle({ color: skinDark })
    g.drawRect(3.5*P, -3*P, P, 7*P)
    g.fill()
    g.setFillStyle({ color: skinLight })
    g.drawRect(4.5*P, -3*P, P, 2*P)
    g.fill()
    // fingertip
    g.setFillStyle({ color: skin })
    g.drawRect(3.5*P, -4*P, 2*P, P)
    g.fill()

    // knuckle highlights
    g.setFillStyle({ color: skinLight })
    g.drawRect(-4*P, 2*P, 2*P, P)
    g.fill()
    g.setFillStyle({ color: skinLight })
    g.drawRect(-1.5*P, 2*P, 2*P, P)
    g.fill()
    g.setFillStyle({ color: skinLight })
    g.drawRect(1*P, 2*P, 2*P, P)
    g.fill()
    g.setFillStyle({ color: skinLight })
    g.drawRect(3.5*P, 2*P, 2*P, P)
    g.fill()

  }, [])

  return <pixiGraphics draw={draw} x={x} y={y} />
}