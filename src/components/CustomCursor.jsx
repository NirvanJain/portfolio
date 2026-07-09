import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Zero-React-re-render cursor.
 * All position/state changes go through Framer MotionValues, bypassing
 * React's reconciler entirely. Moving the mouse never triggers a re-render.
 */
export default function CustomCursor() {
  // Raw mouse position
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Hover/click state as motion values (no setState → no re-renders)
  const isHovering = useMotionValue(0)   // 0 or 1
  const isClicking = useMotionValue(0)   // 0 or 1

  // Ring: spring-lag position
  const ringX = useSpring(rawX, { stiffness: 350, damping: 25, mass: 0.5 })
  const ringY = useSpring(rawY, { stiffness: 350, damping: 25, mass: 0.5 })

  // Ring size derived from hover state
  const ringSize = useTransform(isHovering, [0, 1], [28, 60])
  const ringOffsetX = useTransform(ringSize, (s) => -s / 2)
  const ringOffsetY = useTransform(ringSize, (s) => -s / 2)

  // Dot: fast spring position
  const dotX = useSpring(rawX, { stiffness: 600, damping: 30 })
  const dotY = useSpring(rawY, { stiffness: 600, damping: 30 })
  const dotOpacity = useTransform(isHovering, [0, 1], [1, 0])
  const dotScale = useTransform(isClicking, [0, 1], [1, 0.5])

  // Final ring x/y = spring position + offset
  const ringFinalX = useTransform([ringX, ringOffsetX], ([x, o]) => x + o)
  const ringFinalY = useTransform([ringY, ringOffsetY], ([y, o]) => y + o)

  // Dot final x/y
  const dotFinalX = useTransform(dotX, (x) => x - 2.5)
  const dotFinalY = useTransform(dotY, (y) => y - 2.5)

  useEffect(() => {
    const onMove = (e) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    const onDown = () => isClicking.set(1)
    const onUp = () => isClicking.set(0)
    const onOver = (e) => {
      if (e.target.closest('[data-hoverable], button, a, [role="button"], .hoverable')) {
        isHovering.set(1)
      }
    }
    const onOut = (e) => {
      if (e.target.closest('[data-hoverable], button, a, [role="button"], .hoverable')) {
        isHovering.set(0)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    window.addEventListener('mouseup', onUp, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [rawX, rawY, isHovering, isClicking])

  return (
    <>
      {/* Outer ring — spring-lagged, size reacts to hover */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference"
        style={{
          zIndex: 99999,
          border: '1.5px solid #fff',
          backgroundColor: 'transparent',
          x: ringFinalX,
          y: ringFinalY,
          width: ringSize,
          height: ringSize,
        }}
      />

      {/* Center dot — fast, disappears on hover */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference"
        style={{
          zIndex: 99999,
          backgroundColor: '#fff',
          width: 5,
          height: 5,
          x: dotFinalX,
          y: dotFinalY,
          opacity: dotOpacity,
          scale: dotScale,
        }}
      />
    </>
  )
}
