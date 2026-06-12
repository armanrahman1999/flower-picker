'use client'

import { Application, extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'
import Sky from './sky'
import GrassField from './grass_field'
import Tree from './tree'


extend({ Container, Graphics })

export default function PixiScene() {
  return (
    <Application
      width={800}
      height={600}
      antialias={false}
      background="#1a1a2e"
    >
      <Sky width={800} height={600} />
      <GrassField />
      <Tree x={100} y={400} />
      <Tree x={650} y={400} />
    </Application>
  )
}