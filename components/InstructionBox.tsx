"use client";

import React from "react";

export default function InstructionBox() {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        width: 180,
        minHeight: 92,
        background: "#ffffff",
        color: "#d00",
        padding: "16px 12px",
        border: "4px solid #000",
        borderRadius: 6,
        fontFamily: "monospace, system-ui, -apple-system",
        fontSize: 14,
        lineHeight: 1.2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        zIndex: 1000,
        userSelect: "none",
      }}
      aria-live="polite"
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>INSTRUCTIONS</div>
      <div style={{ color: "#d00" }}>
        To pick a flower, click or tap it. Collect flowers to progress.
      </div>
    </div>
  );
}
