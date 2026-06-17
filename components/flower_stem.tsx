"use client";

import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback } from "react";

extend({ Graphics });

interface FlowerStemProps {
  x: number;
  y: number;
}

export default function FlowerStem({ x, y }: FlowerStemProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear();

    const P = 8;

    // ── STEM ──
    g.setFillStyle({ color: 0x3a7820 });
    g.drawRect(-P, -22 * P, P, 22 * P);
    g.fill();

    g.setFillStyle({ color: 0x2d6018 });
    g.drawRect(0, -22 * P, P, 22 * P);
    g.fill();

    // left leaf
    g.setFillStyle({ color: 0x3a7820 });
    g.drawRect(-4 * P, -10 * P, 3 * P, P);
    g.fill();
    g.drawRect(-5 * P, -11 * P, 3 * P, P);
    g.fill();
    g.setFillStyle({ color: 0x4a8828 });
    g.drawRect(-4 * P, -11 * P, 2 * P, P);
    g.fill();

    // right leaf
    g.setFillStyle({ color: 0x3a7820 });
    g.drawRect(P, -14 * P, 3 * P, P);
    g.fill();
    g.drawRect(2 * P, -15 * P, 3 * P, P);
    g.fill();
    g.setFillStyle({ color: 0x4a8828 });
    g.drawRect(2 * P, -14 * P, 2 * P, P);
    g.fill();

    // ── FLOWER HEAD ──
    // petals are 20% bigger so use 1.2 multiplier
    const S = P * 1.2; // scaled pixel = 9.6px
    const fx = 0;
    const fy = -22 * P;

    // ── OUTER DARK PINK RING (outermost petal edges) ──

    // ── MAIN PETAL BODY (bright pink) ──
    const mainPink = 0xff7fa3;
    const midPink = 0xff6090;
    // const lightPink = 0xd987a2;
    // top petal block
    g.setFillStyle({ color: mainPink });
    g.drawRect(fx - 2 * S, fy - 4.8 * S, 4 * S, 1.7 * S);
    g.fill();
    // bottom petal block
    g.drawRect(fx - 2 * S, fy + 0.6 * S, 4 * S, 2 * S);
    g.fill();
    // left petal block
    g.drawRect(fx - 5.2 * S, fy - 3.5 * S, 2 * S, 4 * S);
    g.fill();
    // right petal block
    g.drawRect(fx + 3.2 * S, fy - 3.5 * S, 2 * S, 4 * S);
    g.fill();
    // corner petals
    g.setFillStyle({ color: midPink });

    g.drawRect(fx - 4 * S, fy - 5.2 * S, 2 * S, 2 * S);
    g.fill();
    g.drawRect(fx + 2 * S, fy - 5.2 * S, 2 * S, 2 * S);
    g.fill();
    g.drawRect(fx - 4 * S, fy + 0.6 * S, 2 * S, 2 * S);
    g.fill();
    g.drawRect(fx + 2 * S, fy + 0.6 * S, 2 * S, 2 * S);
    g.fill();

    // outa layer ///

    const outerPink = 0xe8407a;

    g.setFillStyle({ color: outerPink });
    g.drawRect(fx - 4.4 * S, fy - 4.2 * S, 1.3 * S, 2 * S);
    g.drawRect(fx - 4.4 * S, fy - 0.5 * S, 1.3 * S, 2 * S);
    g.drawRect(fx - 3.8 * S, fy - 2.6 * S, 1.3 * S, 2.5 * S);
    g.drawRect(fx + 3.2 * S, fy - 4.2 * S, 1.3 * S, 2 * S);
    g.drawRect(fx + 3.2 * S, fy - 0.5 * S, 1.3 * S, 2 * S);
    g.drawRect(fx + 2.5 * S, fy - 2.6 * S, 1.3 * S, 2.5 * S);
    g.drawRect(fx - 1.4 * S, fy - 6.3 * S, 2.8 * S, 1.5 * S);
    g.drawRect(fx - 1.4 * S, fy + 2.6 * S, 2.8 * S, 1.5 * S);
    g.fill();

    // ── INNER LIGHT PINK (petal highlight/inner ring) ──

    // top inner
    // g.setFillStyle({ color: lightPink });
    // g.drawRect(fx - S, fy - 4 * S, 2 * S, S);
    // g.fill();
    // // left inner
    // g.drawRect(fx - 4 * S, fy - S, S, 2 * S);
    // g.fill();
    // // right inner
    // g.drawRect(fx + 3 * S, fy - S, S, 2 * S);
    // g.fill();
    const lightYellow = 0xffdc58;
    const darkYellow = 0xffd040;
    const darkrYellow = 0xfac838;
    // ── BIG SQUARE YELLOW CENTER ──
    g.setFillStyle({ color: darkrYellow });
    g.drawRect(fx - 2.5 * S, fy - 3.8 * S, 5 * S, 5 * S);
    g.fill();

    // center highlight (top-left of center is lighter)
    g.setFillStyle({ color: darkYellow });
    g.drawRect(fx - 1.85 * S, fy - 3.4 * S, 3.7 * S, 4.3 * S);
    g.fill();
    g.setFillStyle({ color: lightYellow });
    g.drawRect(fx - 1.3 * S, fy - 3.05 * S, 2.6 * S, 3.5 * S);
    g.fill();

    // ── DOT GRID inside center (3x3 dark amber dots), centered on light yellow
    const dot = 0xc87010;
    const dotSize = S * 0.5;
    const dotGap = S * 1.1;

    // compute grid start so the grid is centered at the light-yellow center (fx, fy - 1.3*S)
    const gridSpan = 2 * dotGap + dotSize; // total span of 3 dots
    const startX = fx - gridSpan / 2;
    const startY = fy - 1.3 * S - gridSpan / 2;

    g.setFillStyle({ color: dot });
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        g.drawRect(
          startX + col * dotGap,
          startY + row * dotGap,
          dotSize,
          dotSize,
        );
        g.fill();
      }
    }
  }, []);

  return <pixiGraphics draw={draw} x={x} y={y} />;
}
