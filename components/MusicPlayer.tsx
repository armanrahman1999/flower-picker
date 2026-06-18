"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  isMusicPlaying,
  pauseMusic,
  resumeAndPlay,
  resumeMusic,
} from "../lib/musicEngine";

const STORAGE_KEY = "musicPlaying";

export default function MusicPlayer() {
  const userPausedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    userPausedRef.current = false;
    resumeAndPlay();
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {}

    const sync = () => {
      if (userPausedRef.current) {
        setIsPlaying(isMusicPlaying());
        return;
      }
      setIsPlaying(true);
      if (!isMusicPlaying()) {
        resumeAndPlay();
      }
    };

    const interval = window.setInterval(sync, 300);
    sync();

    const handleReset = () => {
      userPausedRef.current = false;
      resumeAndPlay();
      setIsPlaying(true);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    };
    window.addEventListener("musicReset", handleReset as EventListener);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("musicReset", handleReset as EventListener);
    };
  }, []);

  const toggle = useCallback(() => {
    if (userPausedRef.current) {
      userPausedRef.current = false;
      resumeMusic();
      setIsPlaying(true);
      try {
        window.localStorage.setItem(STORAGE_KEY, "true");
      } catch {}
      return;
    }

    pauseMusic();
    userPausedRef.current = true;
    setIsPlaying(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "false");
    } catch {}
  }, []);

  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const d = document.createElement("div");
    document.body.appendChild(d);
    setPortalHost(d);
    return () => {
      document.body.removeChild(d);
    };
  }, []);

  const node = (
    <div
      role="button"
      aria-pressed={isPlaying}
      onClick={toggle}
      title={isPlaying ? "Pause music" : "Play music"}
      style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        width: 64,
        height: 64,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          background: "#1a1a2e",
          border: "4px solid #3d2410",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isPlaying ? "scale(1.03)" : "none",
          boxShadow: isPlaying ? "0 6px 0 rgba(0,0,0,0.25)" : "none",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M3 9v6h4l5 4V5L7 9H3z" fill="#ffd040" />

          {!isPlaying && (
            <g stroke="#ffd040" strokeWidth="2" strokeLinecap="round">
              <path d="M16 8l4 4M20 8l-4 4" />
            </g>
          )}

          {isPlaying && (
            <g
              stroke="#ffd040"
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{ transition: "opacity 200ms" }}
            >
              <path d="M14 9c1 1 1 3 0 4" opacity="1" />
              <path d="M16 7c2 2 2 6 0 8" opacity="0.9" />
              <path d="M18 5c3 3 3 11 0 14" opacity="0.7" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );

  if (!portalHost) return null;
  return createPortal(node, portalHost);
}
