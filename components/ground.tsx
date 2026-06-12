'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

export default function Ground({ width = 800, height = 600 }: { width?: number, height?: number }) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    // dark ground base
    g.setFillStyle({ color: 0x245008 })
    g.drawRect(0, height * 0.6, width, height * 0.4)
    g.fill()

    // mid ground strip
    g.setFillStyle({ color: 0x2D5810 })
    g.drawRect(0, height * 0.55, width, 20)
    g.fill()

    // top ground highlight strip
    g.setFillStyle({ color: 0x3A7018 })
    g.drawRect(0, height * 0.58, width, 10)
    g.fill()

  }, [width, height])

  return <pixiGraphics draw={draw} x={0} y={0} />
}