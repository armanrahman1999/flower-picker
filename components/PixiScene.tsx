
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

  useEffect(() => {
    setMounted(true)
  }, [])

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
          <Tree x={100} y={400} />
          <Tree x={650} y={400} />
        </Application>
      )}
    </div>
  )
}