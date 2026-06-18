"use client";

import { extend, useApplication } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback, useRef, useEffect } from "react";

type TickerDelta = number | { deltaTime?: number; delta?: number };

extend({ Graphics });

interface GrassTuftProps {
  x: number;
  y: number;
  depth: number;
  variant: number;
}

const GRASS_BASE = [0x2c5c10, 0x345810, 0x3a7018, 0x488020] as const;
const GRASS_HIGHLIGHT = [0x3a7820, 0x4a8828, 0x52a030, 0x5cb038] as const;

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Asymmetric wind curve: fast snap toward the left (negative), slow elastic return.
function windCurve(phase: number) {
  const p = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const s = Math.sin(p);
  if (s >= 0) {
    return -Math.pow(s, 2) * 0.35;
  }
  return -Math.pow(-s, 0.7);
}

export default function GrassTuft({ x, y, depth, variant }: GrassTuftProps) {
  const graphicsRef = useRef<Graphics | null>(null);
  const { app } = useApplication();
  const timeRef = useRef(0);

  useEffect(() => {
    if (!app) return;
    const ticker = (
      app as unknown as {
        ticker?: {
          add: (cb: (d: number) => void) => void;
          remove: (cb: (d: number) => void) => void;
        };
      }
    ).ticker;
    if (!ticker) return;

    const baseX = x;
    const width = app?.renderer?.width ?? 800;

    const baseAmp = 9;
    // Wave speed: how fast the gust travels across the field, in px/sec.
    const travelSpeed = 220;
    const gustSpeed = 2.0;
    const gRef = graphicsRef.current;
    const tick = (delta: TickerDelta) => {
      const dt =
        typeof delta === "number"
          ? delta / 60
          : (delta.deltaTime ?? delta.delta ?? 16) / 1000;
      timeRef.current += dt;

      // Phase offset based on x position: right side leads, left side lags,
      // so the bend visibly travels from right to left across the field.
      const travelPhase = (baseX / travelSpeed) * gustSpeed;

      const sideFactor = 1 - Math.min(Math.max(baseX / width, 0), 1);
      const amplitude =
        baseAmp * (0.35 + sideFactor * 1.2) * (0.5 + depth * 0.5);
      const speed = gustSpeed + sideFactor * 0.6;

      // variant adds slight per-tuft desync so it doesn't look perfectly mechanical
      const phase = timeRef.current * speed - travelPhase + variant * 0.15;

      const sway = windCurve(phase) * amplitude;

      if (graphicsRef.current)
        graphicsRef.current.position.set(baseX + sway, y);
    };

    ticker.add(tick as unknown as (d: number) => void);
    return () => {
      ticker.remove(tick as unknown as (d: number) => void);
      try {
        // guard against partially-destroyed Graphics instances
        if (gRef && gRef.position && typeof gRef.position.set === "function") {
          gRef.position.set(baseX, y);
        }
      } catch {
        // ignore cleanup errors
      }
    };
  }, [app, x, variant, depth, y]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();
      const rand = mulberry32(variant);
      const alpha = 0.5 + depth * 0.5;
      const baseH = Math.round(7 + depth * 24);

      const singleBladeRoll = rand();
      let blades = [] as { ox: number; h: number; w: number }[];

      if (singleBladeRoll < 0.6) {
        blades = [
          { ox: 0, h: Math.round(baseH * (1.05 + rand() * 0.25)), w: 3 },
        ];
      } else {
        blades = [
          { ox: 0, h: baseH, w: 3 },
          {
            ox: -4 - Math.round(rand() * 2),
            h: Math.round(baseH * (0.62 + rand() * 0.12)),
            w: 2,
          },
          {
            ox: 4 + Math.round(rand() * 2),
            h: Math.round(baseH * (0.68 + rand() * 0.1)),
            w: 2,
          },
        ];

        if (depth > 0.45 && rand() > 0.35) {
          blades.push({
            ox: -7 + Math.round(rand() * 2),
            h: Math.round(baseH * 0.5),
            w: 2,
          });
        }
      }

      for (const blade of blades) {
        const colorIdx = Math.floor(rand() * GRASS_BASE.length);
        const base = GRASS_BASE[colorIdx];
        const highlight = GRASS_HIGHLIGHT[colorIdx];

        g.setFillStyle({ color: base, alpha });
        g.drawRect(blade.ox, -blade.h, blade.w, blade.h);
        g.fill();

        g.setFillStyle({ color: highlight, alpha: alpha * 0.85 });
        g.drawRect(blade.ox, -blade.h, 1, blade.h);
        g.fill();
      }
    },
    [depth, variant],
  );

  return <pixiGraphics ref={graphicsRef} draw={draw} x={x} y={y} />;
}
