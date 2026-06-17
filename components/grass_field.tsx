"use client";

import { useMemo } from "react";
import { useApplication } from "@pixi/react";
import Flower from "./flower";
import GrassBlade from "./grass_blade";
import Ground from "./ground";

const GRASS_COLORS = [0x3a7018, 0x2c5c10, 0x488020, 0x345810];
const FLOWER_COLORS = [0xff6090, 0xff80a8, 0x80c0ff, 0xffb0e0, 0xffd040];

interface GrassFieldProps {
  renderGround?: boolean;
  groundY?: number; // pass the same y trees sit on, so everything lines up
}

// deterministic seeded PRNG so layout is stable across re-renders
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function GrassField({
  renderGround = true,
  groundY,
}: GrassFieldProps) {
  const { app } = useApplication();
  const width = app?.renderer?.width ?? 800;
  const height = app?.renderer?.height ?? 600;

  // field band: starts at the tree/horizon line, runs to near the bottom
  const fieldTop = groundY ?? height * 0.56;
  const fieldBottom = height * 0.97;

  const bladeCount = Math.max(80, Math.floor(width / 5));
  const flowerCount = Math.max(14, Math.floor(width / 45));

  const grassBlades = useMemo(() => {
    const rand = mulberry32(1337);
    const blades: { x: number; y: number; height: number; color: number }[] =
      [];

    // depth bands from back (0) to front (1), each with its own share of
    // the total count and its own size range — guarantees coverage everywhere
    const bands = [
      { depthRange: [0.0, 0.25], share: 0.18 }, // far back: sparse, small
      { depthRange: [0.25, 0.5], share: 0.22 },
      { depthRange: [0.5, 0.75], share: 0.28 },
      { depthRange: [0.75, 1.0], share: 0.32 }, // front: densest, biggest
    ];

    for (const band of bands) {
      const count = Math.round(bladeCount * band.share);
      const [dMin, dMax] = band.depthRange;
      for (let i = 0; i < count; i++) {
        const depth = dMin + rand() * (dMax - dMin);
        const y = fieldTop + depth * (fieldBottom - fieldTop);
        blades.push({
          x: Math.round(rand() * width),
          y: Math.round(y),
          height: Math.round(6 + depth * 26 + rand() * 5),
          color: GRASS_COLORS[Math.floor(rand() * GRASS_COLORS.length)],
        });
      }
    }

    return blades;
  }, [bladeCount, width, fieldTop, fieldBottom]);

  const flowers = useMemo(() => {
    const rand = mulberry32(4242);
    const result: {
      x: number;
      y: number;
      scale: number;
      petalColor: number;
    }[] = [];

    const bands = [
      { depthRange: [0.0, 0.3], share: 0.2 },
      { depthRange: [0.3, 0.6], share: 0.3 },
      { depthRange: [0.6, 1.0], share: 0.5 },
    ];

    for (const band of bands) {
      const count = Math.max(1, Math.round(flowerCount * band.share));
      const [dMin, dMax] = band.depthRange;
      for (let i = 0; i < count; i++) {
        const depth = dMin + rand() * (dMax - dMin);
        const y = fieldTop + depth * (fieldBottom - fieldTop);
        result.push({
          x: Math.round(rand() * width),
          y: Math.round(y),
          scale: 0.6 + depth * 0.7,
          petalColor: FLOWER_COLORS[Math.floor(rand() * FLOWER_COLORS.length)],
        });
      }
    }

    return result;
  }, [flowerCount, width, fieldTop, fieldBottom]);

  return (
    <>
      {renderGround && <Ground width={width} height={height} />}

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
  );
}
