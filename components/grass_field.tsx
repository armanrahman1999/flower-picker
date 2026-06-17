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

    const cols = Math.max(10, Math.floor(width / 72));
    const rows = Math.max(5, Math.floor(fieldHeight / 52));
    const cellW = width / cols;
    const cellH = fieldHeight / rows;

    // increase base chance to make the field noticeably denser
    const depthBands = [
      { rowStart: 0, rowEnd: Math.floor(rows * 0.3), chance: 0.48 },
      { rowStart: Math.floor(rows * 0.3), rowEnd: Math.floor(rows * 0.6), chance: 0.62 },
      { rowStart: Math.floor(rows * 0.6), rowEnd: rows, chance: 0.8 },
    ];

    let variant = 0;
    const centerX = width * 0.5;
    const excludeHalfW = width * 0.16;
    const excludeTopY = fieldBottom - fieldHeight * 0.24;

    const inClearZone = (x: number, y: number) =>
      Math.abs(x - centerX) < excludeHalfW && y > excludeTopY;

    for (const band of depthBands) {
      for (let row = band.rowStart; row < band.rowEnd; row++) {
        for (let col = 0; col < cols; col++) {
          if (rand() > band.chance) continue;

          const depth = (row + rand() * 0.6) / rows;
          const x = Math.round(col * cellW + cellW * 0.2 + rand() * cellW * 0.6);
          const y = Math.round(
            fieldTop + row * cellH + cellH * 0.25 + rand() * cellH * 0.5,
          );

          if (inClearZone(x, y)) continue;

          items.push({ kind: "tuft", x, y, depth, variant: variant++ });
        }
      }
    }

    const flowerRand = mulberry32(4242);
    const flowerSlots = Math.max(5, Math.floor(width / 140));
    const placedFlowers: { x: number; y: number }[] = [];

    for (let i = 0; i < flowerSlots; i++) {
      let placed = false;
      for (let attempt = 0; attempt < 12; attempt++) {
        const depth = 0.35 + flowerRand() * 0.55;
        const x = Math.round(60 + flowerRand() * (width - 120));
        const y = Math.round(fieldTop + depth * fieldHeight);

        const tooClose = placedFlowers.some((f) => {
          const dx = f.x - x;
          const dy = f.y - y;
          return dx * dx + dy * dy < 110 * 110;
        });
        if (tooClose || inClearZone(x, y)) continue;

        placedFlowers.push({ x, y });
        items.push({
          kind: "flower",
          x,
          y,
          depth,
          scale: 0.55 + depth * 0.55,
          petalColor:
            FLOWER_COLORS[Math.floor(flowerRand() * FLOWER_COLORS.length)],
        });
        placed = true;
        break;
      }
      if (!placed) break;
    }

    // add a few extra tufts near the top edge of the field to fill sparse area
    const extraTopCount = Math.max(4, Math.floor(cols * 0.42))
    for (let i = 0; i < extraTopCount; i++) {
      const x = Math.round(cellW * 0.2 + rand() * (width - cellW * 0.4))
      const y = Math.round(fieldTop + rand() * Math.max(8, cellH * 0.4))
      if (inClearZone(x, y)) continue
      const depth = 0.1 + rand() * 0.3
      items.push({ kind: "tuft", x, y, depth, variant: variant++ })
    }

    // add concentrated tufts near the center-top (closer to the flower stem)
    const extraCenterCount = Math.max(3, Math.floor(cols * 0.18))
    for (let i = 0; i < extraCenterCount; i++) {
      const x = Math.round(centerX - excludeHalfW * 0.5 + rand() * (excludeHalfW))
      const y = Math.round(fieldTop + rand() * Math.max(6, cellH * 0.35))
      const depth = 0.15 + rand() * 0.45
      items.push({ kind: "tuft", x, y, depth, variant: variant++ })
    }

    // add a few small extra flowers near the top-center to complement the stem
    const extraFlowers = Math.max(2, Math.floor(cols * 0.08))
    for (let i = 0; i < extraFlowers; i++) {
      for (let attempt = 0; attempt < 8; attempt++) {
        const fx = Math.round(centerX - Math.floor(width * 0.12) + flowerRand() * (Math.floor(width * 0.24)))
        const fy = Math.round(fieldTop + flowerRand() * Math.max(12, cellH * 0.45))
        const tooClose = placedFlowers.some((f) => {
          const dx = f.x - fx
          const dy = f.y - fy
          return dx * dx + dy * dy < 80 * 80
        })
        if (tooClose) continue
        placedFlowers.push({ x: fx, y: fy })
        const depth = 0.25 + flowerRand() * 0.45
        items.push({
          kind: "flower",
          x: fx,
          y: fy,
          depth,
          scale: 0.45 + depth * 0.55,
          petalColor: FLOWER_COLORS[Math.floor(flowerRand() * FLOWER_COLORS.length)],
        })
        break
      }
    }

    // scatter some additional flowers across the field to increase floral density
    const scatterFlowers = Math.max(2, Math.floor(width / 160))
    for (let i = 0; i < scatterFlowers; i++) {
      for (let attempt = 0; attempt < 10; attempt++) {
        const fx = Math.round(60 + flowerRand() * (width - 120))
        const fy = Math.round(fieldTop + flowerRand() * fieldHeight)
        if (inClearZone(fx, fy)) continue
        const tooClose = placedFlowers.some((f) => {
          const dx = f.x - fx
          const dy = f.y - fy
          return dx * dx + dy * dy < 90 * 90
        })
        if (tooClose) continue
        placedFlowers.push({ x: fx, y: fy })
        const depth = 0.3 + flowerRand() * 0.55
        items.push({
          kind: "flower",
          x: fx,
          y: fy,
          depth,
          scale: 0.5 + depth * 0.55,
          petalColor: FLOWER_COLORS[Math.floor(flowerRand() * FLOWER_COLORS.length)],
        })
        break
      }
    }

    return items.sort((a, b) => a.y - b.y);
  }, [width, fieldTop, fieldHeight]);

  return (
    <>
      {renderGround && <Ground width={width} height={height} />}

      {fieldItems.map((item, i) =>
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
        ),
      )}
    </>
  );
}
