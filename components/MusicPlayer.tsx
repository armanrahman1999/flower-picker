"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Howl } from "howler";

const SRC = encodeURI("/Anemone Symphony.mp3");

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
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

    // Try to autoplay — will only succeed if browser allows it.
    try {
      howl.play();
    } catch {
      // ignore; user can toggle to start
    }

    return () => {
      howl.off("play", onPlay);
      howl.off("pause", onPause);
      howl.off("stop", onStop);
      howl.unload();
    };
  }, [howl]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      howl.pause();
      setIsPlaying(false);
    } else {
      try {
        howl.play();
        setIsPlaying(true);
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
        <div style={{ display: "inline-block" }} aria-hidden>
          <span
            style={{
              display: "inline-block",
              width: 6,
              margin: "0 2px",
              background: "#ffd040",
              verticalAlign: "bottom",
              height: isPlaying ? 20 : 8,
              transition: "height 160ms linear",
            }}
          />
          <span
            style={{
              display: "inline-block",
              width: 6,
              margin: "0 2px",
              background: "#ffd040",
              verticalAlign: "bottom",
              height: isPlaying ? 18 : 8,
              transition: "height 160ms linear",
            }}
          />
          <span
            style={{
              display: "inline-block",
              width: 6,
              margin: "0 2px",
              background: "#ffd040",
              verticalAlign: "bottom",
              height: isPlaying ? 16 : 8,
              transition: "height 160ms linear",
            }}
          />
        </div>
      </div>
    </div>
  );

  if (!portalHost) return null;
  return createPortal(node, portalHost);
}
