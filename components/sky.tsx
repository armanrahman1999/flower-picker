"use client";

import { extend, useApplication } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback } from "react";

extend({ Graphics });

export default function Sky() {
  const { app } = useApplication();
  const width = app?.renderer?.width ?? 800;
  const height = app?.renderer?.height ?? 600;

  const draw = useCallback(
    (g: Graphics) => {
      g.clear();

      const bands = [
        // { color: 0x1a0e3a, h: 30 },
        { color: 0x2d1b5e, h: 26 },
        { color: 0x5b1f7a, h: 24 },
        { color: 0x8b2080, h: 20 },
        { color: 0xbe2060, h: 18 },
        // { color: 0xd93828, h: 18 },
        { color: 0xe85020, h: 17 },
        { color: 0xf06818, h: 16 },
        { color: 0xf58018, h: 14 },
        // { color: 0xf9a020, h: 6 },
        { color: 0xfbb830, h: 12 },
        { color: 0xfdcc50, h: 10 },
        { color: 0xfeda70, h: 8 },
        // { color: 0xfee890, h: 13 },
        // { color: 0xfff0b0, h: 12 },
        // { color: 0xfff0b0, h: 12 },
        // { color: 0xfff0b0, h: 12 },
        // { color: 0xfff0b0, h: 12 },
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

      const P = 8;

      const drawCloud = (cx: number, cy: number) => {
        g.rect(cx + P, cy - P * 2, P * 3, P);
        g.rect(cx, cy - P, P * 5, P);
        g.rect(cx - P, cy, P * 7, P);
        g.rect(cx, cy + P, P * 5, P);
      };

      drawCloud(Math.round(width * 0.13), Math.round(height * 0.16));
      drawCloud(Math.round(width * 0.68), Math.round(height * 0.22));

      g.fill(0xf0c8d8);
    },
    [width, height],
  );

  return (
    <>
      <pixiGraphics draw={draw} x={0} y={0} />
      <pixiGraphics draw={drawSun} x={0} y={-100} />
      <pixiGraphics draw={drawClouds} x={0} y={0} />
    </>
  );
}
