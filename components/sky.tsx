"use client";

import { extend, useApplication } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback, useRef, useEffect } from "react";

extend({ Graphics });

// Sky color bands for the three key moments of the cycle. Each array has the
// same band heights/order so they line up; only color shifts between them.
const BANDS_DUSK = [
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

const BANDS_NIGHT = [
  { color: 0x05040f, h: 26 },
  { color: 0x080a1c, h: 24 },
  { color: 0x0b1228, h: 20 },
  { color: 0x0e1a36, h: 18 },
  { color: 0x121f40, h: 17 },
  { color: 0x152646, h: 16 },
  { color: 0x182c4c, h: 14 },
  { color: 0x1b3252, h: 12 },
  { color: 0x1e3858, h: 10 },
  { color: 0x213e5e, h: 8 },
  { color: 0x142038, h: 130 },
];

const BANDS_MORNING = [
  { color: 0x3a4a7a, h: 26 },
  { color: 0x5c6a96, h: 24 },
  { color: 0x8d8fae, h: 20 },
  { color: 0xc9a0a0, h: 18 },
  { color: 0xf0b088, h: 17 },
  { color: 0xfac890, h: 16 },
  { color: 0xfdd9a0, h: 14 },
  { color: 0xfde8b8, h: 12 },
  { color: 0xfdf0c8, h: 10 },
  { color: 0xfdf6dc, h: 8 },
  { color: 0xeaf2fb, h: 130 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(c1: number, c2: number, t: number) {
  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;
  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const b = Math.round(lerp(b1, b2, t));
  return (r << 16) | (g << 8) | b;
}

// Eases 0..1 with a slow start/end and faster middle — feels more natural
// for a sun crossing the sky than constant-speed linear motion.
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function Sky() {
  const { app } = useApplication();
  const width = app?.renderer?.width ?? 800;
  const height = app?.renderer?.height ?? 600;
  const cloudRef = useRef<Graphics | null>(null);
  const cloudTimeRef = useRef(0);

  const skyRef = useRef<Graphics | null>(null);
  const sunRef = useRef<Graphics | null>(null);
  const transitionRequestedRef = useRef(false);

  // Drives the one-shot sunset -> night -> sunrise transition.
  // 0 = starting state (sun up at its original spot, dusk palette).
  // 1 = finished (sun risen, centered in the sky, morning palette) — it
  // holds there permanently and never restarts or loops back.
  const cycleProgressRef = useRef(0);
  const cycleDoneRef = useRef(false);

  // Total duration of the whole sunset -> night -> sunrise transition, seconds.
  const CYCLE_DURATION = 14 / 5;

  // --- Sun position keyframes (fractions of screen width/height) --------
  // Phase A (progress 0 -> 0.45): sun sinks down toward the bottom-left, fading out.
  // Phase B (progress 0.45 -> 0.55): night hold, sun hidden.
  // Phase C (progress 0.55 -> 1): sun rises in from the top-right corner and
  // settles centered in the sky, where it stops for good.
  const sunStart = { xf: 0.42, yf: 0.56 };
  const sunSetTarget = { xf: 0.15, yf: 0.92 };
  const sunRiseFrom = { xf: 1.08, yf: -0.16 };
  const sunRiseTarget = { xf: 0.5, yf: 0.34 };

  // Draws the sky bands for a given progress value directly onto a Graphics
  // instance. Pure function of (g, progress) — no React state involved, so
  // it's safe to call every tick from inside the animation loop.
  const drawSkyAtProgress = useCallback(
    (g: Graphics, progress: number) => {
      g.clear();

      let bandsLow: typeof BANDS_DUSK;
      let bandsHigh: typeof BANDS_DUSK;
      let localT: number;

      if (progress < 0.5) {
        bandsLow = BANDS_DUSK;
        bandsHigh = BANDS_NIGHT;
        localT = easeInOutCubic(Math.min(1, progress / 0.5));
      } else {
        bandsLow = BANDS_NIGHT;
        bandsHigh = BANDS_MORNING;
        localT = easeInOutCubic(Math.min(1, (progress - 0.5) / 0.5));
      }

      const totalH = bandsLow.reduce((s, b) => s + b.h, 0);
      const scale = height / totalH;

      let currentY = 0;
      for (let i = 0; i < bandsLow.length; i++) {
        const color = lerpColor(bandsLow[i].color, bandsHigh[i].color, localT);
        let h = Math.max(1, Math.round(bandsLow[i].h * scale));
        if (i === bandsLow.length - 1) h = Math.max(1, height - currentY);
        g.setFillStyle({ color });
        g.drawRect(0, currentY, width, h);
        g.fill();
        currentY += h;
      }
    },
    [width, height],
  );

  const drawSunShape = useCallback((g: Graphics, cx: number, cy: number, alpha: number) => {
    if (alpha <= 0.01) return;
    const P = 8;

    const haloRadius = 6 * P;
    for (let oy = -haloRadius; oy <= haloRadius; oy += P) {
      for (let ox = -haloRadius; ox <= haloRadius; ox += P) {
        const dist = Math.sqrt(ox * ox + oy * oy);
        if (dist > haloRadius) continue;
        const factor = 1 - dist / haloRadius;
        const a = Math.max(0, 0.6 * factor) * alpha;
        if (a < 0.02) continue;
        g.setFillStyle({ color: 0xfff5c0, alpha: a });
        g.drawRect(cx + ox, cy + oy, P, P);
        g.fill();
      }
    }

    g.setFillStyle({ color: 0xffe060, alpha });
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

    g.setFillStyle({ color: 0xffffcc, alpha });
    g.drawRect(cx, cy, P, P);
    g.drawRect(cx - P, cy, P, P);
    g.drawRect(cx + P, cy, P, P);
    g.drawRect(cx, cy - P, P, P);
    g.drawRect(cx, cy + P, P, P);
    g.fill();
  }, []);

  // Draws the sun for a given progress value. Same idea as drawSkyAtProgress:
  // pure, called directly every tick, no dependency on the draw prop.
  const drawSunAtProgress = useCallback(
    (g: Graphics, progress: number) => {
      g.clear();

      const SET_END = 0.45;
      const RISE_START = 0.55;

      if (progress <= SET_END) {
        const t = easeInOutCubic(progress / SET_END);
        const x = Math.round(lerp(sunStart.xf * width, sunSetTarget.xf * width, t));
        const y = Math.round(lerp(sunStart.yf * height, sunSetTarget.yf * height, t));
        const alpha = Math.max(0, 1 - t * 1.15);
        drawSunShape(g, x, y, alpha);
      } else if (progress >= RISE_START) {
        const t = easeInOutCubic((progress - RISE_START) / (1 - RISE_START));
        const x = Math.round(lerp(sunRiseFrom.xf * width, sunRiseTarget.xf * width, t));
        const y = Math.round(lerp(sunRiseFrom.yf * height, sunRiseTarget.yf * height, t));
        const alpha = Math.min(1, t * 1.3);
        drawSunShape(g, x, y, alpha);
      }
      // Between SET_END and RISE_START: night hold, sun stays hidden (nothing drawn).
    },
    [width, height, drawSunShape],
  );

  const drawSky = useCallback(
    (g: Graphics) => drawSkyAtProgress(g, cycleProgressRef.current),
    [drawSkyAtProgress],
  );

  const drawSun = useCallback(
    (g: Graphics) => drawSunAtProgress(g, cycleProgressRef.current),
    [drawSunAtProgress],
  );

  useEffect(() => {
    if (!app || !(app as any).ticker) return;

    const baseX = 0;
    const cloudAmplitude = Math.max(32, width * 0.12);
    const cloudSpeed = 0.14;

    const storedDone = window.localStorage.getItem("flowerStemSkyTransitionDone") === "true";
    if (storedDone) {
      transitionRequestedRef.current = true;
      cycleProgressRef.current = 1;
      cycleDoneRef.current = true;
    }

    // Paint the very first frame immediately so the scene isn't blank while
    // waiting for the first ticker callback.
    if (skyRef.current) drawSkyAtProgress(skyRef.current, cycleProgressRef.current);
    if (sunRef.current) drawSunAtProgress(sunRef.current, cycleProgressRef.current);

    const onTransitionRequested = () => {
      if (!cycleDoneRef.current) transitionRequestedRef.current = true;
    };

    window.addEventListener("flowerSkyTransitionRequested", onTransitionRequested);

    const tick = (delta: any) => {
      const dt = typeof delta === "number" ? delta / 60 : (delta.deltaTime ?? delta.delta ?? 16) / 1000;

      cloudTimeRef.current += dt;
      const offset = -Math.sin(cloudTimeRef.current * cloudSpeed) * cloudAmplitude;
      if (cloudRef.current) cloudRef.current.position.set(baseX + offset, 0);

      if (!cycleDoneRef.current && transitionRequestedRef.current) {
        cycleProgressRef.current = Math.min(1, cycleProgressRef.current + dt / CYCLE_DURATION);
        if (skyRef.current) drawSkyAtProgress(skyRef.current, cycleProgressRef.current);
        if (sunRef.current) drawSunAtProgress(sunRef.current, cycleProgressRef.current);
        if (cycleProgressRef.current >= 1) cycleDoneRef.current = true;
      }
    };

    (app as any).ticker.add(tick as any);
    return () => {
      (app as any).ticker.remove(tick as any);
      window.removeEventListener("flowerSkyTransitionRequested", onTransitionRequested);
      if (cloudRef.current) cloudRef.current.position.set(baseX, 0);
    };
  }, [app, width, drawSkyAtProgress, drawSunAtProgress]);

  const drawClouds = useCallback(
    (g: Graphics) => {
      g.clear();

      const drawCloudWide = (cx: number, cy: number, p: number) => {
        g.rect(cx + p, cy - p * 2, p * 3, p);
        g.rect(cx, cy - p, p * 5, p);
        g.rect(cx - p, cy, p * 7, p);
        g.rect(cx, cy + p, p * 5, p);
      };

      const drawCloudPuffy = (cx: number, cy: number, p: number) => {
        g.rect(cx, cy - p * 3, p * 2, p);
        g.rect(cx + p * 3, cy - p * 3, p * 2, p);
        g.rect(cx - p, cy - p * 2, p * 7, p);
        g.rect(cx - p * 2, cy - p, p * 9, p);
        g.rect(cx - p, cy, p * 7, p);
      };

      const drawCloudWisp = (cx: number, cy: number, p: number) => {
        g.rect(cx, cy - p, p * 3, p);
        g.rect(cx - p, cy, p * 5, p);
        g.rect(cx + p, cy + p, p * 2, p);
      };

      const drawCloudStreak = (cx: number, cy: number, p: number) => {
        g.rect(cx + p * 2, cy - p, p * 3, p);
        g.rect(cx - p * 2, cy, p * 10, p);
        g.rect(cx, cy + p, p * 4, p);
      };

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
      <pixiGraphics ref={skyRef} draw={drawSky} x={0} y={0} />
      <pixiGraphics ref={sunRef} draw={drawSun} x={0} y={-100} />
      <pixiGraphics ref={cloudRef} draw={drawClouds} x={0} y={0} />
    </>
  );
}