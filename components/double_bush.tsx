'use client'

import { extend } from '@pixi/react'
import { Graphics } from 'pixi.js'
import { useCallback } from 'react'

extend({ Graphics })

interface BushDoubleProps {
  x?: number
  y?: number
  width?: number
  height?: number
  flip?: boolean
}

function BushDouble({
  x = 0,
  y = 0,
  width: bw = 300,
  height: bh = 220,
  flip = false,
}: BushDoubleProps) {
  const draw = useCallback((g: Graphics) => {
    g.clear()

    const shadow    = 0x0E2206
    const body      = 0x0E2F05
    const mid       = 0x1A5C09
    const highlight = 0x1E6B0A

    const drawHump = (hx: number, hw: number, hh: number, stepSide: 'left' | 'right') => {
      // Base layer — full width, bottom quarter
      g.setFillStyle({ color: shadow })
    //   g.drawRect(hx, bh - hh * 0.28, hw, hh * 0.28)
      g.fill()

      // Main body — slightly narrowed
      const bodyX = stepSide === 'right' ? hx : hx + hw * 0.12
      const bodyW = hw * 0.88
      g.setFillStyle({ color: body })
      g.drawRect(bodyX, bh - hh * 0.72, bodyW + 20, hh * 0.48)
      g.fill()

      // Mid step — steps inward on the outer side
      const midW = hw * 0.70
      const midX = stepSide === 'right' ? hx : hx + hw * 0.30
    //   g.setFillStyle({ color: mid })
      g.drawRect(midX, bh - hh * 0.88, midW + 10, hh * 0.20)
      g.fill()

      // Top cap — narrow
      const capW = hw * 0.48
      g.drawRect(midX, bh - hh-2 * 0.88, midW - 30, hh * 0.20)
      g.fill()

      // Highlight notch on top cap
    
    }

    const totalW = bw
    const leftW  = Math.round(totalW * 0.58)
    const leftH  = Math.round(bh * 0.82)
    drawHump(0, leftW, leftH, 'right')

    // const rightW = Math.round(totalW * 0.52)
    // const rightH = Math.round(bh * 0.68)
    // const rightX = Math.round(totalW * 0.48)
    // drawHump(rightX, rightW, rightH, 'left')

    // // Shared base rectangle that ties both humps together at the bottom
    // g.setFillStyle({ color: shadow })
    // // g.drawRect(0, bh - Math.round(bh * 0.14), totalW, Math.round(bh * 0.14))
    // g.fill()

  }, [bw, bh])

  const scaleX = flip ? -1 : 1
  const offsetX = flip ? bw : 0

  return (
    <pixiGraphics
      draw={draw}
      x={x + offsetX}
      y={y - bh}
      scale={{ x: scaleX, y: 1 }}
    />
  )
}

interface ScreenBushesProps {
  /** Total pixel width of the stage / screen */
  screenWidth?: number
  /** Total pixel height of the stage / screen */
  screenHeight?: number
  /** How wide each bush should be (px) */
  bushWidth?: number
  /** How tall each bush should be (px) */
  bushHeight?: number
}

/**
 * Renders two BushDouble instances hugging both screen edges.
 * Left bush is normal (flip=false), right bush is mirrored (flip=true).
 * Both sit on the bottom of the screen.
 */
export default function ScreenBushes({
  screenWidth  = 800,
  screenHeight = 600,
  bushWidth    = 300,
  bushHeight   = 220,
}: ScreenBushesProps) {
  // y is passed as screenHeight so that y - bh = screenHeight - bushHeight (bottom-aligned)
  return (
    <>
      {/* Left edge — normal orientation */}
      <BushDouble
        x={0}
        y={screenHeight}
        width={bushWidth}
        height={bushHeight}
        flip={false}
      />

      {/* Right edge — flipped: x + offsetX (= x + bw) = screenWidth, so x = screenWidth - bw */}
      <BushDouble
        x={screenWidth - bushWidth}
        y={screenHeight}
        width={bushWidth}
        height={bushHeight}
        flip={true}
      />
    </>
  )
}
