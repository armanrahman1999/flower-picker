"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Howl, Howler } from "howler";

const SRC = encodeURI("/Anemone Symphony.mp3");
const STORAGE_KEY = "musicPlaying";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [desiredPlay, setDesiredPlay] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      return window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const howl = useMemo(() => {
    return new Howl({
      src: [SRC],
      loop: true,
      volume: 0.6,
      onplay: () => {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onStop = () => setIsPlaying(false);

    howl.on("play", onPlay);
    howl.on("pause", onPause);
    howl.on("stop", onStop);

    // If the user previously opted to have music on, attempt to resume.
    if (desiredPlay) {
      try {
        try {
          Howler.unmute();
          // resume audio context if suspended (some browsers require a user gesture)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          Howler.ctx?.resume?.();
        } catch {}
        howl.play();
      } catch (err) {
        // ignore; user can toggle to start
        // keep a console hint for debugging
        // eslint-disable-next-line no-console
        console.debug("MusicPlayer: autoplay attempt failed", err);
      }
    }

    return () => {
      howl.off("play", onPlay);
      howl.off("pause", onPause);
      howl.off("stop", onStop);
      howl.unload();
    };
  }, [howl]);

  // Respond to external reset requests (clear storage and stop playback)
  useEffect(() => {
    const handleReset = () => {
      try {
        howl.stop();
      } catch {}
      try {
        setIsPlaying(false);
      } catch {}
      try {
        setDesiredPlay(false);
      } catch {}
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {}
    };
    window.addEventListener("musicReset", handleReset as EventListener);
    return () => window.removeEventListener("musicReset", handleReset as EventListener);
  }, [howl]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      howl.pause();
      setIsPlaying(false);
      setDesiredPlay(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, "false");
      } catch {}
    } else {
      try {
        try {
          Howler.unmute();
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          Howler.ctx?.resume?.();
        } catch {}
        howl.play();
        // actual isPlaying will be set by Howler's onplay handler
        setDesiredPlay(true);
        try {
          window.localStorage.setItem(STORAGE_KEY, "true");
        } catch {}
      } catch {
        // ignore
      }
    }
  }, [howl, isPlaying]);

  // Render control into a portal to guarantee it's plain DOM outside Pixi's tree.
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
        {/* SVG speaker icon: muted (X) when paused, waves when playing */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          {/* speaker body */}
          <path d="M3 9v6h4l5 4V5L7 9H3z" fill="#ffd040" />

          {/* muted: X overlay */}
          {!isPlaying && (
            <g stroke="#ffd040" strokeWidth="2" strokeLinecap="round">
              <path d="M16 8l4 4M20 8l-4 4" />
            </g>
          )}

          {/* playing: three wave arcs */}
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
