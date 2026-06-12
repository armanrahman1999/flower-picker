'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

export default function Ground({ width = 800, height = 600 }: { width?: number, height?: number }) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    // sky
    g.rect(0, 0, width, height * 0.6)
    g.fill(0x1a1a2e)

    // dark ground base
    g.rect(0, height * 0.6, width, height * 0.4)
    g.fill(0x245008)

    // mid ground strip
    g.rect(0, height * 0.55, width, 20)
    g.fill(0x2D5810)

    // top ground highlight strip
    g.rect(0, height * 0.58, width, 10)
    g.fill(0x3A7018)

  }, [width, height])

  return <pixiGraphics draw={draw} x={0} y={0} />
}