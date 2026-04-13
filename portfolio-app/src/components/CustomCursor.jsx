import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const followerX = useMotionValue(0)
  const followerY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 }
  const followerSpringConfig = { damping: 20, stiffness: 400, mass: 1 }

  const cursorSpringX = useSpring(cursorX, springConfig)
  const cursorSpringY = useSpring(cursorY, springConfig)
  const followerSpringX = useSpring(followerX, followerSpringConfig)
  const followerSpringY = useSpring(followerY, followerSpringConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e

      cursorX.set(clientX - 6)
      cursorY.set(clientY - 6)
      followerX.set(clientX - 20)
      followerY.set(clientY - 20)

      // Hide cursor when not moving
      setIsVisible(true)

      // Calculate velocity for additional effects
      const velocity = Math.sqrt(
        Math.pow(clientX - lastMousePos.x, 2) + Math.pow(clientY - lastMousePos.y, 2)
      )

      setLastMousePos({ x: clientX, y: clientY })
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseDown = () => setIsHovering(true)
    const handleMouseUp = () => setIsHovering(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [data-hover]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => setIsHovering(true))
      el.addEventListener('mouseleave', () => setIsHovering(false))
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [cursorX, cursorY, followerX, followerY, lastMousePos])

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="custom-cursor fixed w-3 h-3 bg-accent rounded-full z-50"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          scale: isHovering ? 2.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Follower ring */}
      <motion.div
        className="custom-cursor fixed w-10 h-10 border-2 border-accent/40 rounded-full z-40"
        style={{
          x: followerSpringX,
          y: followerSpringY,
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Trailing particles on hover */}
      {isHovering && (
        <>
          <motion.div
            className="custom-cursor fixed w-1 h-1 bg-accent/30 rounded-full"
            style={{
              x: followerSpringX,
              y: followerSpringY,
              opacity: isVisible ? 1 : 0,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </>
      )}
    </>
  )
}
