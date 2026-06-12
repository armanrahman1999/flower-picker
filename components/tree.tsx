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

    // trunk
    g.rect(-8, 0, 16, 60)
    g.fill(0x3D2010)

    // leaves bottom layer
    g.rect(-48, -40, 96, 24)
    g.fill(0x1A3A0A)

    // leaves middle layer
    g.rect(-40, -60, 80, 24)
    g.fill(0x2A4A0E)

    // leaves top layer
    g.rect(-32, -80, 64, 24)
    g.fill(0x304E10)

  }, [])

  return <pixiGraphics draw={draw} x={x} y={y} />
}