'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface BushSingleProps {
  x?: number
  y?: number
  width?: number
  height?: number
}

export default function BushSingle({
  x = 0,
  y = 0,
  width: bw = 130,
  height: bh = 50,
}: BushSingleProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    const color = 0x0E2F05

    // Bottom rect — widest
    g.setFillStyle({ color })
    g.drawRect(0, Math.round(bh * 0.66), bw, Math.round(bh * 0.34))
    g.fill()

    // Middle rect
    g.setFillStyle({ color })
    g.drawRect(Math.round(bw * 0.12), Math.round(bh * 0.33), Math.round(bw * 0.76), Math.round(bh * 0.34))
    g.fill()

    // Top rect — narrowest
    g.setFillStyle({ color })
    g.drawRect(Math.round(bw * 0.28), 0, Math.round(bw * 0.44), Math.round(bh * 0.34))
    g.fill()

  }, [bw, bh])

  return (
    <pixiGraphics
      draw={draw}
      x={x}
      y={y - bh}
    />
  )
}