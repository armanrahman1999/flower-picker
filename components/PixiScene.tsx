// components/PixiScene.jsx
'use client'

import { Application, extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'

// You must extend the components you want to use
extend({ Container, Graphics })

export default function PixiScene() {
  return (
    <Application
      resizeTo={window}
      antialias={false}
      resolution={1}
      background="#1a1a2e"
    >
      {/* components go here */}
    </Application>
  )
}