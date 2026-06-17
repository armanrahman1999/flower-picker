"use client";

import { extend, useApplication } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback, useRef, useEffect } from "react";

extend({ Graphics });

export default function Sky() {
  const { app } = useApplication();
  const width = app?.renderer?.width ?? 800;
  const height = app?.renderer?.height ?? 600;
  const cloudRef = useRef<Graphics | null>(null);
  const cloudTimeRef = useRef(0);

  useEffect(() => {
    if (!app || !(app as any).ticker) return;

    const baseX = 0;
    const cloudAmplitude = Math.max(32, width * 0.12);
    const cloudSpeed = 0.14;

    const tick = (delta: any) => {
      const dt = typeof delta === "number" ? delta / 60 : (delta.deltaTime ?? delta.delta ?? 16) / 1000;
      cloudTimeRef.current += dt;
      const offset = -Math.sin(cloudTimeRef.current * cloudSpeed) * cloudAmplitude;
      if (cloudRef.current) cloudRef.current.position.set(baseX + offset, 0);
    };

    (app as any).ticker.add(tick as any);
    return () => {
      (app as any).ticker.remove(tick as any);
      if (cloudRef.current) cloudRef.current.position.set(baseX, 0);
    };
  }, [app, width]);

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();

      const bands = [
        { color: 0x2d1b5e, h: 26 },
        { color: 0x5b1f7a, h: 24 },
        { color: 0x8b2080, h: 20 },
        { color: 0xbe2060, h: 18 },
        { color: 0xe85020, h: 17 },
        { color: 0xf06818, h: 16 },
        { color: 0xf58018, h: 14 },
        { color: 0xfbb830, h: 12 },
        { color: 0xfdcc50, h: 10 },
        { color: 0xfeda70, h: 8 },
        { color: 0xfff0b0, h: 130 },
      ];

      const totalH = bands.reduce((s, b) => s + b.h, 0);
      const scale = height / totalH;

      let currentY = 0;
      for (let i = 0; i < bands.length; i++) {
        const band = bands[i];
        let h = Math.max(1, Math.round(band.h * scale));
        if (i === bands.length - 1) h = Math.max(1, height - currentY);
        g.setFillStyle({ color: band.color });
        g.drawRect(0, currentY, width, h);
        g.fill();
        currentY += h;
      }
    },
    [width, height],
  );

  const drawSun = useCallback(
    (g: Graphics) => {
      g.clear();

      const P = 8;
      const cx = Math.round(width * 0.42);
      const cy = Math.round(height * 0.56);

      const haloRadius = 6 * P;
      for (let oy = -haloRadius; oy <= haloRadius; oy += P) {
        for (let ox = -haloRadius; ox <= haloRadius; ox += P) {
          const dist = Math.sqrt(ox * ox + oy * oy);
          if (dist > haloRadius) continue;
          const factor = 1 - dist / haloRadius;
          const alpha = Math.max(0, 0.6 * factor);
          if (alpha < 0.02) continue;
          g.setFillStyle({ color: 0xfff5c0, alpha });
          g.drawRect(cx + ox, cy + oy, P, P);
          g.fill();
        }
      }

      g.setFillStyle({ color: 0xffe060 });
      for (let ry = -1; ry <= 1; ry++) {
        for (let rx = -1; rx <= 1; rx++) {
          g.drawRect(cx + rx * P, cy + ry * P, P, P);
        }
      }
      g.drawRect(cx - 2 * P, cy, P, P);
      g.drawRect(cx + 2 * P, cy, P, P);
      g.drawRect(cx, cy - 2 * P, P, P);
      g.drawRect(cx, cy + 2 * P, P, P);
      g.fill();

      g.setFillStyle({ color: 0xffffcc });
      g.drawRect(cx, cy, P, P);
      g.drawRect(cx - P, cy, P, P);
      g.drawRect(cx + P, cy, P, P);
      g.drawRect(cx, cy - P, P, P);
      g.drawRect(cx, cy + P, P, P);
      g.fill();
    },
    [width, height],
  );

  const drawClouds = useCallback(
    (g: Graphics) => {
      g.clear();

      // Each cloud shape is built from its own pixel unit (p) so size variation
      // changes the blockiness too, not just a uniform scale — small clouds
      // read as "further away" with chunkier relative pixels.

      // Wide, low, gently lobed silhouette (the original shape, slightly tuned).
      const drawCloudWide = (cx: number, cy: number, p: number) => {
        g.rect(cx + p, cy - p * 2, p * 3, p);
        g.rect(cx, cy - p, p * 5, p);
        g.rect(cx - p, cy, p * 7, p);
        g.rect(cx, cy + p, p * 5, p);
      };

      // Tall, puffier silhouette with a stacked double-bump top.
      const drawCloudPuffy = (cx: number, cy: number, p: number) => {
        g.rect(cx, cy - p * 3, p * 2, p);
        g.rect(cx + p * 3, cy - p * 3, p * 2, p);
        g.rect(cx - p, cy - p * 2, p * 7, p);
        g.rect(cx - p * 2, cy - p, p * 9, p);
        g.rect(cx - p, cy, p * 7, p);
      };

      // Small, compact wisp — fewer lobes, reads as distant/thin.
      const drawCloudWisp = (cx: number, cy: number, p: number) => {
        g.rect(cx, cy - p, p * 3, p);
        g.rect(cx - p, cy, p * 5, p);
        g.rect(cx + p, cy + p, p * 2, p);
      };

      // Stretched, flat streak — long and low, good for filling horizontal gaps.
      const drawCloudStreak = (cx: number, cy: number, p: number) => {
        g.rect(cx + p * 2, cy - p, p * 3, p);
        g.rect(cx - p * 2, cy, p * 10, p);
        g.rect(cx, cy + p, p * 4, p);
      };

      // Staggered across varied heights and x-positions, with size scaled
      // to suggest depth and avoid an even, grid-like distribution.
      drawCloudWide(Math.round(width * 0.12), Math.round(height * 0.14), 7);
      drawCloudWisp(Math.round(width * 0.34), Math.round(height * 0.09), 5);
      drawCloudPuffy(Math.round(width * 0.62), Math.round(height * 0.2), 7);
      drawCloudStreak(Math.round(width * 0.85), Math.round(height * 0.12), 6);

      g.fill(0xf0c8d8);
    },
    [width, height],
  );

  return (
    <>
      <pixiGraphics draw={draw} x={0} y={0} />
      <pixiGraphics draw={drawSun} x={0} y={-100} />
      <pixiGraphics ref={cloudRef} draw={drawClouds} x={0} y={0} />
    </>
  );
}