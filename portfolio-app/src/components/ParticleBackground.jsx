import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function ParticleBackground() {
  const containerRef = useRef(null)
  const [particles] = useState(() => {
    const particleCount = 80;
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
  })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Track mouse for repel effect
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(!document.body.classList.contains('light-mode'))
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          {...particle}
          mousePos={mousePos}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  )
}

function Particle({ x, y, size, duration, delay, mousePos, isDarkMode }) {
  const particleRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!particleRef.current) return

    const rect = particleRef.current.getBoundingClientRect()
    const particleX = rect.left + rect.width / 2
    const particleY = rect.top + rect.height / 2

    const dx = mousePos.x - particleX
    const dy = mousePos.y - particleY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const repelRadius = 150

    if (distance < repelRadius) {
      const force = (repelRadius - distance) / repelRadius
      const angle = Math.atan2(dy, dx)
      const repelDistance = force * 80
      setOffset({
        x: -Math.cos(angle) * repelDistance,
        y: -Math.sin(angle) * repelDistance,
      })
    } else {
      setOffset({ x: 0, y: 0 })
    }
  }, [mousePos])

  return (
    <motion.div
      ref={particleRef}
      className="particle absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
        x: offset.x,
        y: offset.y,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
