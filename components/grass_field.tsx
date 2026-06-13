'use client'

import { useMemo } from 'react'
import { useApplication } from '@pixi/react'
import Flower from "./flower"
import GrassBlade from "./grass_blade"
import Ground from "./ground"


const GRASS_COLORS = [0x3A7018, 0x2C5C10, 0x488020, 0x345810]
const FLOWER_COLORS = [0xFF6090, 0xFF80A8, 0x80C0FF, 0xFFB0E0, 0xFFD040]

export default function GrassField() {
  const { app } = useApplication()
  const width = app?.renderer?.width ?? 800
  const height = app?.renderer?.height ?? 600

  const bladeCount = Math.max(40, Math.floor(width / 10))
  const flowerCount = Math.max(6, Math.floor(width / 70))

  const grassBlades = useMemo(() => Array.from({ length: bladeCount }, (_, i) => ({
    x: Math.round((i * (width / bladeCount)) + ((i % 3) * 6)),
    y: Math.round(height * 0.6 + (i % 5) * 6),
    height: 8 + (i % 4) * 4,
    color: GRASS_COLORS[i % GRASS_COLORS.length]
  })), [bladeCount, width, height])

  const flowers = useMemo(() => Array.from({ length: flowerCount }, (_, i) => ({
    x: Math.round((i + 0.5) * (width / flowerCount)),
    y: Math.round(height * 0.55 + (i % 3) * 8),
    petalColor: FLOWER_COLORS[i % FLOWER_COLORS.length]
  })), [flowerCount, width, height])

  return (
    <>
      <Ground width={width} height={height} />

      {grassBlades.map((blade, i) => (
        <GrassBlade
          key={i}
          x={blade.x}
          y={blade.y}
          height={blade.height}
          color={blade.color}
        />
      ))}

      {flowers.map((flower, i) => (
        <Flower
          key={i}
          x={flower.x}
          y={flower.y}
          petalColor={flower.petalColor}
        />
      ))}
    </>
  )
}