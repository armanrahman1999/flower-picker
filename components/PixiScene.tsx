"use client";

import { useRef, useState, useEffect } from "react";
import { Application, extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import Sky from "./sky";
import Ground from "./ground";
import GrassField from "./grass_field";
import Tree from "./tree";
import FlowerStem from "./flower_stem";
import Hand from "./hand";

extend({ Graphics });

export default function PixiScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [resizeTarget, setResizeTarget] = useState<HTMLDivElement | null>(null);
  const handX = size.width * 0.5;
  const handY = size.height * 0.78;
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    // store the ref.current in state so we don't read it during render
    setResizeTarget(containerRef.current);

    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const groundY = size.height * 0.56;
  const edgeMargin = Math.round(size.width * 0.07);

  return (
    <div ref={containerRef} className="fixed inset-0 w-screen h-screen">
      {resizeTarget && (
        <Application
          resizeTo={resizeTarget}
          antialias={false}
          background="#1a1a2e"
        >
          <Sky />
          <Ground width={size.width} height={size.height} />
          <Tree x={edgeMargin} y={groundY} />
          <Tree x={Math.max(edgeMargin, size.width - edgeMargin)} y={groundY} />
          <GrassField renderGround={false} />
          <FlowerStem x={handX} y={size.height * 0.7} />
          <Hand x={handX} y={handY} />
        </Application>
      )}
    </div>
  );
}
