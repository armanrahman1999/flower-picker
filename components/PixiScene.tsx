'use client'

import { Application, extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import Tree from './tree'

// You must extend the components you want to use
extend({ Container, Graphics })

export default function PixiScene() {
  return (
       <Application
      width={800}
      height={600}
      antialias={false}
      background="#1a1a2e"
    >
      <Tree x={100} y={400} />
      <Tree x={650} y={400} />
    </Application>
  )
}