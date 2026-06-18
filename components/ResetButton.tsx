"use client";

import React, { useCallback } from "react";
import { Howler } from "howler";

const BASKET_KEY = "flowerPickStack";
const MUSIC_KEY = "musicPlaying";
const TRANSITION_KEY = "flowerStemSkyTransitionDone";

export default function ResetButton() {
  const handleReset = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.confirm("Clear all saved data and reset the experience?")) return;

    try {
      window.localStorage.removeItem(BASKET_KEY);
    } catch {}
    try {
      window.localStorage.removeItem(MUSIC_KEY);
    } catch {}
    try {
      window.localStorage.removeItem(TRANSITION_KEY);
    } catch {}

    // Stop any playing audio immediately
    try {
      Howler.stop();
      Howler.unmute();
    } catch {}

    // Broadcast events so components can reset their UI/state
    try {
      window.dispatchEvent(new CustomEvent("flowerBasketReset"));
    } catch {}
    try {
      window.dispatchEvent(new CustomEvent("musicReset"));
    } catch {}
    try {
      window.dispatchEvent(new CustomEvent("flowerSkyTransitionReset"));
    } catch {}

    // Reload the page so the app restarts in a clean state
    try {
      // short timeout gives listeners a moment to update before reload
      setTimeout(() => {
        window.location.reload();
      }, 80);
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
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "#1a1a2e",
          color: "#ffd040",
          border: "3px solid #1a0d04",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 4,
        }}
      >
        {/* circular arrow icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 12a9 9 0 10-3.2 6.7L21 12z" fill="#ffd040" />
          <path d="M21 12l-4 4" stroke="#1a0d04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
