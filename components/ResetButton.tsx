"use client";

import React, { useCallback } from "react";
import { MdRefresh } from "react-icons/md";
import { Howler } from "howler";

const BASKET_KEY = "flowerPickStack";
const MUSIC_KEY = "musicPlaying";
const TRANSITION_KEY = "flowerStemSkyTransitionDone";

export default function ResetButton() {
  const handleReset = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.confirm("Clear all saved data and reset the experience?"))
      return;

    try { window.localStorage.removeItem(BASKET_KEY); } catch {}
    try { window.localStorage.removeItem(MUSIC_KEY); } catch {}
    try { window.localStorage.removeItem(TRANSITION_KEY); } catch {}

    try { Howler.stop(); Howler.mute(false); } catch {}

    try { window.dispatchEvent(new CustomEvent("flowerBasketReset")); } catch {}
    try { window.dispatchEvent(new CustomEvent("musicReset")); } catch {}
    try { window.dispatchEvent(new CustomEvent("flowerSkyTransitionReset")); } catch {}

    try {
      setTimeout(() => { window.location.reload(); }, 80);
    } catch {}
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 132,
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <button
        onClick={handleReset}
        title="Reset experience"
        aria-label="Reset experience"
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "#1a1a2e",
          color: "#ffd040",
          border: "2px solid #ffd04055",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
          transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#2a2a4e";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffd040aa";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#1a1a2e";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffd04055";
        }}
      >
        <MdRefresh size={20} color="#ffd040" aria-hidden="true" />
      </button>
    </div>
  );
}