
'use client'

import { useRef, useState, useEffect } from 'react'
import { Application, extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import Sky from './sky'
import GrassField from './grass_field'
import Tree from './tree'

extend({ Container, Graphics })

export default function PixiScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [size, setSize] = useState({ width: 800, height: 600 })

  useEffect(() => {
    setMounted(true)

    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateSize()

    const resizeObserver = new ResizeObserver(updateSize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const groundY = size.height * 0.56
  const edgeMargin = Math.round(size.width * 0.07)

  return (
    <div ref={containerRef} className="fixed inset-0 w-screen h-screen">
      {mounted && containerRef.current && (
        <Application
          resizeTo={containerRef.current}
          antialias={false}
          background="#1a1a2e"
        >
          <Sky />
          <GrassField />
          <Tree x={edgeMargin} y={groundY} />
          <Tree x={Math.max(edgeMargin, size.width - edgeMargin)} y={groundY} />
        </Application>
      )}
    </div>
  )
}