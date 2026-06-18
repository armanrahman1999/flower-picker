"use client";

import React, { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "flowerPickCount";

export default function FlowerBasket() {
  const [count, setCount] = useState<number>(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      return v ? parseInt(v, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });

  const save = useCallback((n: number) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(n));
    } catch (e) {
      // noop
    }
  }, []);

  useEffect(() => {
    const onPicked = () => {
      setCount((c) => {
        const n = c + 1;
        save(n);
        return n;
      });
    };

    const handler = (e: Event) => onPicked();
    window.addEventListener("flowerPicked", handler as EventListener);
    return () =>
      window.removeEventListener("flowerPicked", handler as EventListener);
  }, [save]);

  return (
    <div
      aria-live="polite"
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 88,
        height: 56,
        zIndex: 1000,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          transform: "translateY(0)",
          pointerEvents: "auto",
        }}
      >
        <svg
          width={88}
          height={56}
          viewBox="0 0 88 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* basket body (pixel style) */}
          <rect
            x="8"
            y="20"
            width="72"
            height="24"
            fill="#6b3f1a"
            stroke="#000"
            strokeWidth="2"
            rx="3"
          />
          <rect x="12" y="24" width="64" height="16" fill="#8b5a2b" />
          {/* handle */}
          <path
            d="M12 20 C20 6, 68 6, 76 20"
            stroke="#4a2d17"
            strokeWidth="4"
            fill="none"
          />
          {/* a couple of tiny pixel flowers inside the basket */}
          <rect x="24" y="28" width="6" height="6" fill="#ff6090" />
          <rect x="34" y="26" width="6" height="6" fill="#ffd040" />
          <rect x="44" y="30" width="6" height="6" fill="#e8407a" />
          <rect x="54" y="28" width="6" height="6" fill="#ff6090" />
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
            background: "#d00",
            color: "#fff",
            fontFamily: "monospace, system-ui, -apple-system",
            fontSize: 14,
            fontWeight: 700,
            border: "3px solid #000",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 0 rgba(0,0,0,0.25)",
            pointerEvents: "none",
          }}
        >
          {count}
        </div>
      </div>
    </div>
  );
}
