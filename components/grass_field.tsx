"use client";

import { useMemo } from "react";
import { useApplication } from "@pixi/react";
import Flower from "./flower";
import GrassTuft from "./grass_blade";
import Ground from "./ground";

const FLOWER_COLORS = [0xff6090, 0xff80a8, 0x80c0ff, 0xffb0e0, 0xffd040];

interface GrassFieldProps {
  renderGround?: boolean;
  groundY?: number;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type FieldItem =
  | { kind: "tuft"; x: number; y: number; depth: number; variant: number }
  | {
      kind: "flower";
      x: number;
      y: number;
      depth: number;
      scale: number;
      petalColor: number;
    };

export default function GrassField({
  renderGround = true,
  groundY,
}: GrassFieldProps) {
  const { app } = useApplication();
  const width = app?.renderer?.width ?? 800;
  const height = app?.renderer?.height ?? 600;

  const fieldTop = groundY ?? height * 0.56;
  const fieldBottom = height * 0.97;
  const fieldHeight = fieldBottom - fieldTop;

  const fieldItems = useMemo(() => {
    const rand = mulberry32(1337);
    const items: FieldItem[] = [];

    const centerX = width * 0.5;
    const excludeHalfW = width * 0.16;
    const excludeTopY = fieldBottom - fieldHeight * 0.24;

    const inClearZone = (x: number, y: number) =>
      Math.abs(x - centerX) < excludeHalfW && y > excludeTopY;

    // Scatter sparse tufts across the entire field height, not in rows
    // Total tuft count: roughly 1 per 11,000 sq px — sparse but present everywhere
    const totalTufts = Math.round((width * fieldHeight) / 11000);
    let variant = 0;

    for (let i = 0; i < totalTufts; i++) {
      const x = Math.round(rand() * width);
      // y distributed across the full field, weighted slightly toward back (top)
      // using a sqrt curve so the front isn't totally empty
      const rawT = rand();
      const t = Math.pow(rawT, 0.75); // slight bias toward top of field
      const y = Math.round(fieldTop + t * fieldHeight);

      if (inClearZone(x, y)) continue;

      // Depth derived from y position: higher up = further back = smaller/darker
      const depthT = (y - fieldTop) / fieldHeight;
      const depth = 0.12 + depthT * 0.75;

      items.push({ kind: "tuft", x, y, depth, variant: variant++ });
    }

    // Scatter a handful of flowers across the whole field too
    const flowerRand = mulberry32(4242);
    const placedFlowers: { x: number; y: number }[] = [];
    const totalFlowers = Math.max(4, Math.round(width / 180));

    for (let i = 0; i < totalFlowers * 3; i++) {
      if (placedFlowers.length >= totalFlowers) break;

      const x = Math.round(flowerRand() * width);
      const rawT = flowerRand();
      const t = Math.pow(rawT, 0.7);
      const y = Math.round(fieldTop + t * fieldHeight);

      if (inClearZone(x, y)) continue;

      const tooClose = placedFlowers.some((f) => {
        const dx = f.x - x;
        const dy = f.y - y;
        return dx * dx + dy * dy < 110 * 110;
      });
      if (tooClose) continue;

      placedFlowers.push({ x, y });

      const depthT = (y - fieldTop) / fieldHeight;
      const depth = 0.12 + depthT * 0.75;

      items.push({
        kind: "flower",
        x,
        y,
        depth,
        scale: 0.35 + depth * 0.55,
        petalColor:
          FLOWER_COLORS[Math.floor(flowerRand() * FLOWER_COLORS.length)],
      });
    }

    // Sort by y so closer tufts render on top of farther ones
    return items.sort((a, b) => a.y - b.y);
  }, [width, fieldTop, fieldHeight]);

  return (
    <>
      {renderGround && <Ground width={width} height={height} />}

      {fieldItems.map((item) =>
        item.kind === "tuft" ? (
          <GrassTuft
            key={`tuft-${item.x}-${item.y}-${item.variant}`}
            x={item.x}
            y={item.y}
            depth={item.depth}
            variant={item.variant}
          />
        ) : (
          <Flower
            key={`flower-${item.x}-${item.y}`}
            x={item.x}
            y={item.y}
            scale={item.scale}
            petalColor={item.petalColor}
          />
        )
      )}
    </>
  );
}