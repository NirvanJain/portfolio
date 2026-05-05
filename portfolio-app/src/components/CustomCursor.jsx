import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

function SmokeTrail({ mousePos, visible }) {
  const canvasRef = useRef(null)
  const particles = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    let lastScrollY = window.scrollY

    const render = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollY
      lastScrollY = currentScrollY

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn particles if scrolling even if mouse is still
      if (Math.abs(scrollDelta) > 0.1 && visible) {
        const count = Math.random() > 0.5 ? 2 : 1
        for (let i = 0; i < count; i++) {
          particles.current.push({
            x: mousePos.x + (Math.random() - 0.5) * 5,
            y: mousePos.y + (Math.random() - 0.5) * 5,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 - 0.2, // slight upward drift
            size: Math.random() * 4 + 4,
            age: 0,
            life: Math.random() * 30 + 40 // 40-70 frames
          })
        }
      }

      // Update and draw particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        p.age++
        if (p.age >= p.life) {
          particles.current.splice(i, 1)
          continue
        }

        p.x += p.vx
        p.y += p.vy - scrollDelta // Adjust for scroll
        p.size += 0.2 // Grow slightly
        p.vx *= 0.98
        p.vy *= 0.98

        const opacity = Math.max(0, 1 - p.age / p.life)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 180, 200, ${opacity * 0.15})` // subtle white/gray smoke
        ctx.fill()
        ctx.restore()
      }

      animationId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Spawn particles on mouse move
  useEffect(() => {
    if (!visible) return

    // Spawn 1-2 particles
    const count = Math.random() > 0.5 ? 2 : 1
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: mousePos.x + (Math.random() - 0.5) * 5,
        y: mousePos.y + (Math.random() - 0.5) * 5,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.2, // slight upward drift
        size: Math.random() * 4 + 4,
        age: 0,
        life: Math.random() * 30 + 40 // 40-70 frames
      })
    }
  }, [mousePos, visible])

  // Spawn burst on click
  useEffect(() => {
    const onBurst = () => {
      if (!visible) return
      const count = 12 // Firework burst size
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2.5 + 1
        particles.current.push({
          x: mousePos.x,
          y: mousePos.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 4,
          age: 0,
          life: Math.random() * 20 + 30
        })
      }
    }
    window.addEventListener('mousedown', onBurst)
    return () => window.removeEventListener('mousedown', onBurst)
  }, [mousePos, visible])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99998]"
      style={{ opacity: visible ? 1 : 0, filter: 'blur(4px)' }}
    />
  )
}

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
      <SmokeTrail mousePos={pos} visible={visible} />

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
