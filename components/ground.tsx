'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

export default function Ground({ width = 800, height = 600 }: { width?: number, height?: number }) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    // far distance strip (lightest)
    g.setFillStyle({ color: 0x3A6818 })
    g.drawRect(0, height * 0.48, width, height * 0.06)
    g.fill()

    // mid ground strip
    g.setFillStyle({ color: 0x2D5810 })
    g.drawRect(0, height * 0.52, width, height * 0.06)
    g.fill()

    // main dark ground — fills everything from 0.56 to bottom
    g.setFillStyle({ color: 0x245008 })
    g.drawRect(0, height * 0.56, width, height * 0.44)
    g.fill()

    // top highlight strip
    g.setFillStyle({ color: 0x3A7018 })
    g.drawRect(0, height * 0.56, width, 8)
    g.fill()

  }, [width, height])

  return <pixiGraphics draw={draw} x={0} y={0} />
}