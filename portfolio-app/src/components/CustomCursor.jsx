import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleMove = useCallback((e) => {
    setPos({ x: e.clientX, y: e.clientY })
    setVisible(true)
  }, [])

  useEffect(() => {
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)
    const onOver = (e) => {
      if (e.target.closest('[data-hoverable], button, a, [role="button"], .hoverable')) {
        setHovering(true)
      }
    }
    const onOut = (e) => {
      if (e.target.closest('[data-hoverable], button, a, [role="button"], .hoverable')) {
        setHovering(false)
      }
    }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [handleMove])

  if (!visible) return null

  const ringSize = hovering ? 60 : clicking ? 16 : 28

  return (
    <>
      {/* Outer ring with spring follow */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference"
        style={{
          zIndex: 99999,
          border: '1.5px solid #fff',
          backgroundColor: 'transparent',
        }}
        animate={{
          x: pos.x - ringSize / 2,
          y: pos.y - ringSize / 2,
          width: ringSize,
          height: ringSize,
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 25,
          mass: 0.5,
        }}
      />

      {/* Center dot — hardcoded #fff so mix-blend-difference always works */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference"
        style={{ zIndex: 99999, backgroundColor: '#fff' }}
        animate={{
          x: pos.x - 2.5,
          y: pos.y - 2.5,
          width: 5,
          height: 5,
          opacity: hovering ? 0 : 1,
          scale: clicking ? 0.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 30,
        }}
      />
    </>
  )
}
