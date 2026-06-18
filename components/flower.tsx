"use client";

import { extend, useApplication } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback, useRef, useEffect } from "react";

extend({ Graphics });

type TickerDelta = number | { deltaTime?: number; delta?: number };

interface FlowerProps {
  x: number;
  y: number;
  scale?: number;
  petalColor?: number;
}

// Asymmetric wind curve: fast snap toward the left (negative), slow elastic return.
// Returns a value in roughly [-1, 0.25] so motion is biased leftward, not symmetric.
function windCurve(phase: number) {
  const p = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const s = Math.sin(p);
  // Bias the curve: square the negative (leftward) half to make it sharper/faster,
  // and dampen the positive (rightward) half so the return is gentler.
  if (s >= 0) {
    return -Math.pow(s, 2) * 0.35; // small rightward ease-back
  }
  return -Math.pow(-s, 0.7); // sharper leftward snap
}

export default function Flower({
  x,
  y,
  scale = 1,
  petalColor = 0xff6090,
}: FlowerProps) {
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
    const width = app.renderer.width || 800;

    // Wave speed: how fast the gust travels across the field, in px/sec.
    // Larger = gust sweeps from right to left faster.
    const travelSpeed = 220;
    const gustSpeed = 1.6;
    const gustAmplitude = 10 * scale;

    const tick = (delta: TickerDelta) => {
      const dt =
        typeof delta === "number"
          ? delta / 60
          : (delta.deltaTime ?? delta.delta ?? 16) / 1000;
      timeRef.current += dt;

      // Phase offset based on x: plants further right lead the motion,
      // plants further left lag behind — so the bend visibly travels right -> left.
      const travelPhase = (baseX / travelSpeed) * gustSpeed;

      const sideFactor = 1 - Math.min(Math.max(baseX / width, 0), 1);
      const amplitude = gustAmplitude * (0.4 + sideFactor * 1.4);
      const speed = gustSpeed + sideFactor * 0.6;

      const phase = timeRef.current * speed - travelPhase;
      const sway = windCurve(phase) * amplitude;

      if (graphicsRef.current) {
        graphicsRef.current.position.set(baseX + sway, y);
        graphicsRef.current.rotation =
          windCurve(phase) * 0.18 * (0.6 + sideFactor * 0.8);
      }
    };

    ticker.add(tick as unknown as (d: number) => void);
    // capture the graphics ref so cleanup uses the same instance
    const gRef = graphicsRef.current;
    return () => {
      ticker.remove(tick as unknown as (d: number) => void);
      if (gRef) {
        gRef.position.set(baseX, y);
        gRef.rotation = 0;
      }
    };
  }, [app, x, scale]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();

      const s = scale;
      // stem
      g.setFillStyle({ color: 0x3a7820 });
      g.drawRect(-2 * s, -24 * s, 4 * s, 24 * s);
      g.fill();

      // petals (4 directions)
      g.setFillStyle({ color: petalColor });
      g.drawRect(-8 * s, -36 * s, 6 * s, 6 * s);
      g.drawRect(2 * s, -36 * s, 6 * s, 6 * s);
      g.drawRect(-2 * s, -42 * s, 6 * s, 6 * s);
      g.drawRect(-2 * s, -30 * s, 6 * s, 6 * s);
      g.fill();

      // center
      g.setFillStyle({ color: 0xffd040 });
      g.drawRect(-2 * s, -38 * s, 6 * s, 6 * s);
      g.fill();
    },
    [petalColor, scale],
  );

  return <pixiGraphics ref={graphicsRef} draw={draw} x={x} y={y} />;
}
