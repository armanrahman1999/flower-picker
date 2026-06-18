"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";

const STORAGE_KEY = "flowerPickCount";

// How many flowers can actually be "shown" sitting in the basket before
// it's considered full. Past this, the count badge keeps climbing but no
// new flower is drawn (there's no more room to visually represent it).
const MAX_VISIBLE_FLOWERS = 8;

// Slot positions for flowers poking up out of the basket, hand-placed so
// they look like they're resting against each other rather than on a grid.
// y values are intentionally low (above the rim) so each flower is clearly
// visible rather than hidden behind the basket's front edge.
const SLOTS: { x: number; y: number; rotate: number }[] = [
  { x: 40, y: 12, rotate: -6 },
  { x: 50, y: 9, rotate: 5 },
  { x: 30, y: 11, rotate: -4 },
  { x: 60, y: 13, rotate: 7 },
  { x: 45, y: 5, rotate: 10 },
  { x: 35, y: 6, rotate: -10 },
  { x: 55, y: 4, rotate: 2 },
  { x: 25, y: 8, rotate: -6 },
];

// Petal/center colors lifted from the field's own flowers so the basket
// reads as "made of the same flowers you're picking."
const FLOWER_PALETTE: { petal: string; center: string }[] = [
  { petal: "#f06c87", center: "#ffd84a" }, // pink bloom, yellow center
  { petal: "#ffd84a", center: "#f06c87" }, // yellow bloom, pink center
  { petal: "#8fc7ec", center: "#ffd84a" }, // light blue bloom
  { petal: "#f4a3c0", center: "#ffe18a" }, // soft pink
];

function PixelFlower({
  size,
  petal,
  center,
}: {
  size: number;
  petal: string;
  center: string;
}) {
  // Tiny 5x5 pixel-grid flower, scaled up via viewBox. Matches the blocky
  // look of the big flower in the scene (square petals, square center).
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 5 5"
      style={{ display: "block", imageRendering: "pixelated" }}
    >
      <rect x={1} y={0} width={3} height={1} fill={petal} />
      <rect x={0} y={1} width={1} height={3} fill={petal} />
      <rect x={4} y={1} width={1} height={3} fill={petal} />
      <rect x={1} y={4} width={3} height={1} fill={petal} />
      <rect x={1} y={1} width={3} height={3} fill={center} />
    </svg>
  );
}

export default function FlowerBasket() {
  const [count, setCount] = useState<number>(() => {
    try {
      if (typeof window === "undefined") return 0;
      const v = window.localStorage.getItem(STORAGE_KEY);
      return v ? parseInt(v, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [bump, setBump] = useState(false);

  const save = useCallback((n: number) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(n));
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setCount((c) => {
        const n = c + 1;
        save(n);
        return n;
      });
      setBump(true);
      window.setTimeout(() => setBump(false), 220);
    };
    window.addEventListener("flowerPicked", handler as EventListener);
    return () =>
      window.removeEventListener("flowerPicked", handler as EventListener);
  }, [save]);

  // Deterministic flower-per-slot based on slot index, so the same slot
  // always gets the same flower once filled (no flicker on re-render).
  const visibleFlowers = useMemo(() => {
    const shown = Math.min(count, MAX_VISIBLE_FLOWERS);
    return SLOTS.slice(0, shown).map((slot, i) => ({
      ...slot,
      colors: FLOWER_PALETTE[i % FLOWER_PALETTE.length],
    }));
  }, [count]);

  const isFull = count >= MAX_VISIBLE_FLOWERS;

  return (
    <div
      aria-live="polite"
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 100,
        height: 64,
        zIndex: 1000,
        pointerEvents: "none",
        userSelect: "none",
        fontFamily: "monospace, system-ui, -apple-system",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          pointerEvents: "auto",
          transform: bump ? "scale(1.08)" : "scale(1)",
          transition: "transform 150ms ease-out",
        }}
      >
        <svg
          width={100}
          height={64}
          viewBox="0 0 100 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: "pixelated" }}
        >
          {/* handle, behind the basket body */}
          <path
            d="M14 24 C14 6, 86 6, 86 24"
            stroke="#3d2410"
            strokeWidth="5"
            fill="none"
            strokeLinecap="square"
          />
          <path
            d="M14 24 C14 9, 86 9, 86 24"
            stroke="#6e4114"
            strokeWidth="2"
            fill="none"
            strokeLinecap="square"
          />

          {/* flowers sitting inside, drawn before the front rim so the
              rim overlaps their stems like they're tucked into the basket */}
          <g>
            {visibleFlowers.map((f, i) => (
              <g
                key={i}
                transform={`translate(${f.x}, ${f.y}) rotate(${f.rotate})`}
              >
                {/* stem running down from the petals into the basket bed */}
                <rect x={6} y={12} width={2} height={9} fill="#2f5d1e" />
                <PixelFlower
                  size={14}
                  petal={f.colors.petal}
                  center={f.colors.center}
                />
              </g>
            ))}
          </g>

          {/* basket body */}
          <rect
            x="10"
            y="26"
            width="80"
            height="30"
            rx="3"
            fill="#7a4d22"
            stroke="#1a0d04"
            strokeWidth="3"
          />
          {/* woven texture: alternating light/dark vertical slats */}
          <g>
            <rect x="14" y="29" width="6" height="24" fill="#8b5a2c" />
            <rect x="24" y="29" width="6" height="24" fill="#6e4114" />
            <rect x="34" y="29" width="6" height="24" fill="#8b5a2c" />
            <rect x="44" y="29" width="6" height="24" fill="#6e4114" />
            <rect x="54" y="29" width="6" height="24" fill="#8b5a2c" />
            <rect x="64" y="29" width="6" height="24" fill="#6e4114" />
            <rect x="74" y="29" width="6" height="24" fill="#8b5a2c" />
          </g>
          {/* horizontal weave bands */}
          <rect
            x="10"
            y="34"
            width="80"
            height="3"
            fill="#1a0d04"
            opacity="0.35"
          />
          <rect
            x="10"
            y="44"
            width="80"
            height="3"
            fill="#1a0d04"
            opacity="0.35"
          />

          {/* front rim, drawn last so flower stems appear tucked behind it */}
          <rect
            x="10"
            y="26"
            width="80"
            height="7"
            rx="3"
            fill="#5c3a1a"
            stroke="#1a0d04"
            strokeWidth="3"
          />
        </svg>

        {/* count badge */}
        <div
          style={{
            position: "absolute",
            right: -8,
            top: -8,
            minWidth: 28,
            height: 28,
            padding: "0 6px",
            background: "#d2342d",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            border: "3px solid #1a0d04",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 0 rgba(0,0,0,0.3)",
            pointerEvents: "none",
          }}
        >
          {count}
        </div>

        {/* small "full" indicator once the basket can't visually hold more */}
        {isFull && (
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: -16,
              width: 100,
              textAlign: "center",
              fontSize: 9,
              color: "#fff8e8",
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
              letterSpacing: 0.5,
            }}
          >
            FULL
          </div>
        )}
      </div>
    </div>
  );
}
