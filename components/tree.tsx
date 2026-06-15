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
    g.drawRect(-10.4, 0, 20.8, 78)
    g.fill()

    // leaves bottom layer: aligned so bottom meets trunk top (no gap)
    g.setFillStyle({ color: 0x1A3A0A })
    g.drawRect(-62.4, -31.2, 124.8, 31.2)
    g.fill()

    // leaves middle layer
    g.setFillStyle({ color: 0x2A4A0E })
    g.drawRect(-52, -62.4, 104, 31.2)
    g.fill()

    // leaves top layer
    g.setFillStyle({ color: 0x304E10 })
    g.drawRect(-41.6, -93.6, 83.2, 31.2)
    g.fill()

  }, [])

  return <pixiGraphics draw={draw} x={x} y={y} />
}