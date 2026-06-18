"use client";

import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback, useMemo } from "react";

// Deterministic PRNG (pure) — given the same seed it returns same sequence.
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

extend({ Graphics });

interface TreeProps {
  x: number;
  y: number;
}

export default function Tree({ x, y }: TreeProps) {
  // Pre-compute grass blade positions once so they don't reshuffle on
  // every re-render.
  const grassBlades = useMemo(() => {
    const width = 140; // a bit wider than the leaf canopy
    // smaller gap -> blades closer together
    const gap = 8;
    const count = Math.floor(width / gap);
    const startX = -width / 2;
    const result: { x: number; height: number }[] = [];

    // Use a deterministic RNG seeded from the tree position so
    // blade placement is stable and still visually varied.
    const seed = Math.floor((x * 73856093) ^ (y * 19349663)) >>> 0;
    const rng = mulberry32(seed);

    for (let i = 0; i < count; i++) {
      const bx = startX + i * gap + (rng() * 4 - 2);
      // taller blades (height increased): 28-48px
      const bHeight = 28 + rng() * 20;
      result.push({ x: bx, height: bHeight });
    }

    return result;
  }, [x, y]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();

      // trunk (starts at y=0, extends down)
      g.setFillStyle({ color: 0x3d2010 });
      g.drawRect(-10.4, 0, 24, 84);
      g.fill();

      // leaves bottom layer: aligned so bottom meets trunk top (no gap)
      g.setFillStyle({ color: 0x1a3a0a });
      g.drawRect(-62.4, -31.2, 124.8, 31.2);
      g.fill();

      // leaves middle layer
      g.setFillStyle({ color: 0x2a4a0e });
      g.drawRect(-52, -62.4, 104, 31.2);
      g.fill();

      // leaves upper-middle layer
      g.setFillStyle({ color: 0x304e10 });
      g.drawRect(-41.6, -93.6, 83.2, 31.2);
      g.fill();

      // leaves top layer
      g.setFillStyle({ color: 0x3a5a14 });
      g.drawRect(-31.2, -124.8, 62.4, 31.2);
      g.fill();

      // grass at the base of the tree (drawn last so it sits on top
      // of the trunk's bottom edge, like in the reference image)
      g.setFillStyle({ color: 0x3b6718 });
      for (const blade of grassBlades) {
        // skip blades that would overlap the trunk itself
        if (blade.x > -14 && blade.x < 14) continue;
        g.drawRect(blade.x, 84 - blade.height, 4, blade.height);
      }
      g.fill();
    },
    [grassBlades],
  );

  return <pixiGraphics draw={draw} x={x} y={y} />;
}
