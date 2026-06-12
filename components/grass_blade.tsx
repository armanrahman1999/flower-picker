'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface GrassBladeProps {
  x: number
  y: number
  height?: number
  color?: number
}

export default function GrassBlade({ x, y, height = 20, color = 0x3A7018 }: GrassBladeProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()
    g.rect(0, -height, 4, height)
    g.fill(color)
  }, [height, color])

  return <pixiGraphics draw={draw} x={x} y={y} />
}