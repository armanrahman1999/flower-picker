'use client'

import Flower from "./flower"
import GrassBlade from "./grass_blade"
import Ground from "./ground"



const GRASS_COLORS = [0x3A7018, 0x2C5C10, 0x488020, 0x345810]
const FLOWER_COLORS = [0xFF6090, 0xFF80A8, 0x80C0FF, 0xFFB0E0, 0xFFD040]

// generate grass blades
const grassBlades = Array.from({ length: 80 }, (_, i) => ({
  x: (i * 23 + (i % 3) * 11) % 800,
  y: 360 + (i % 5) * 8,
  height: 12 + (i % 4) * 6,
  color: GRASS_COLORS[i % GRASS_COLORS.length]
}))

// generate flowers
const flowers = Array.from({ length: 12 }, (_, i) => ({
  x: 40 + i * 62,
  y: 350 + (i % 3) * 12,
  petalColor: FLOWER_COLORS[i % FLOWER_COLORS.length]
}))

export default function GrassField() {
  return (
    <>
      <Ground width={800} height={600} />

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