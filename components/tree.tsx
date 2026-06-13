'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface TreeProps {
  x: number
  y: number
}

export default function Tree({ x, y }: TreeProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    // trunk (starts at y=0, extends down)
    g.setFillStyle({ color: 0x3D2010 })
    g.drawRect(-8, 0, 16, 60)
    g.fill()

    // leaves bottom layer: aligned so bottom meets trunk top (no gap)
    g.setFillStyle({ color: 0x1A3A0A })
    g.drawRect(-48, -24, 96, 24)
    g.fill()

    // leaves middle layer
    g.setFillStyle({ color: 0x2A4A0E })
    g.drawRect(-40, -48, 80, 24)
    g.fill()

    // leaves top layer
    g.setFillStyle({ color: 0x304E10 })
    g.drawRect(-32, -72, 64, 24)
    g.fill()

  }, [])

  return <pixiGraphics draw={draw} x={x} y={y} />
}