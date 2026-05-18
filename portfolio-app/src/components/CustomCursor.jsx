import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'

function SmokeTrail({ mousePos, visible }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const prevPos = useRef({ x: -1, y: -1 })
  const timeRef = useRef(0)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

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

    // Simple noise for turbulence
    const noise = (x, y) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
      return n - Math.floor(n)
    }

    const spawnPuff = (x, y, vxBase, vyBase) => {
      const angle = Math.random() * Math.PI * 2
      particles.current.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: vxBase * 0.3 + Math.cos(angle) * 0.4,
        vy: vyBase * 0.3 - Math.random() * 1.2 - 0.6,
        size: Math.random() * 8 + 10,
        growth: Math.random() * 0.8 + 0.4,
        age: 0,
        life: Math.random() * 50 + 60,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        stretch: Math.random() * 0.4 + 0.6,
        phase: Math.random() * Math.PI * 2,
        density: Math.random() * 0.4 + 0.6,
        turbX: Math.random() * 100,
        turbY: Math.random() * 100,
      })
    }

    const render = () => {
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollY
      lastScrollY = currentScrollY
      timeRef.current += 0.016

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const t = timeRef.current

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        p.age++
        if (p.age >= p.life) {
          particles.current.splice(i, 1)
          continue
        }

        // Turbulence — layered sine waves for organic drift
        const turbulence =
          Math.sin(p.phase + p.age * 0.025) * 0.5 +
          Math.sin(p.phase * 2.1 + p.age * 0.04) * 0.25 +
          (noise(p.turbX + t * 0.4, p.turbY + t * 0.3) - 0.5) * 0.6

        p.x += p.vx + turbulence
        p.y += p.vy - scrollDelta
        p.vy *= 0.997
        p.vx *= 0.994
        p.size += p.growth
        p.rotation += p.rotSpeed

        // Lifecycle alpha: quick fade-in, hold, long fade-out
        const life = p.age / p.life
        let alpha
        if (life < 0.08) {
          alpha = (life / 0.08) * 0.12
        } else if (life > 0.5) {
          alpha = ((1 - life) / 0.5) * 0.12
        } else {
          alpha = 0.12
        }
        alpha *= p.density

        // Draw as rotated ellipse with radial gradient for soft cloud look
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.scale(1, p.stretch)

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
        if (isDark) {
          grad.addColorStop(0, `rgba(220, 210, 245, ${alpha})`)
          grad.addColorStop(0.25, `rgba(200, 185, 235, ${alpha * 0.8})`)
          grad.addColorStop(0.55, `rgba(180, 165, 220, ${alpha * 0.35})`)
          grad.addColorStop(0.8, `rgba(160, 145, 210, ${alpha * 0.08})`)
          grad.addColorStop(1, `rgba(140, 130, 200, 0)`)
        } else {
          grad.addColorStop(0, `rgba(60, 40, 80, ${alpha})`)
          grad.addColorStop(0.25, `rgba(60, 40, 80, ${alpha * 0.8})`)
          grad.addColorStop(0.55, `rgba(60, 40, 80, ${alpha * 0.35})`)
          grad.addColorStop(0.8, `rgba(60, 40, 80, ${alpha * 0.08})`)
          grad.addColorStop(1, `rgba(60, 40, 80, 0)`)
        }

        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fillStyle = grad
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
  }, [isDark])

  // Spawn smoke puffs on mouse move
  useEffect(() => {
    if (!visible) return

    const dx = prevPos.current.x >= 0 ? mousePos.x - prevPos.current.x : 0
    const dy = prevPos.current.y >= 0 ? mousePos.y - prevPos.current.y : 0
    prevPos.current = { x: mousePos.x, y: mousePos.y }

    const speed = Math.sqrt(dx * dx + dy * dy)
    const count = speed > 8 ? 3 : speed > 3 ? 2 : 1

    for (let i = 0; i < count; i++) {
      spawnPuff(mousePos.x, mousePos.y, dx * 0.05, dy * 0.05)
    }

    function spawnPuff(x, y, vxBase, vyBase) {
      const angle = Math.random() * Math.PI * 2
      particles.current.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: vxBase + Math.cos(angle) * 0.4,
        vy: vyBase - Math.random() * 1.2 - 0.6,
        size: Math.random() * 8 + 10,
        growth: Math.random() * 0.8 + 0.4,
        age: 0,
        life: Math.random() * 50 + 60,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        stretch: Math.random() * 0.4 + 0.6,
        phase: Math.random() * Math.PI * 2,
        density: Math.random() * 0.4 + 0.6,
        turbX: Math.random() * 100,
        turbY: Math.random() * 100,
      })
    }
  }, [mousePos, visible])

  // Spawn burst on click
  useEffect(() => {
    const onBurst = () => {
      if (!visible) return
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2.5 + 1.5
        particles.current.push({
          x: mousePos.x + (Math.random() - 0.5) * 6,
          y: mousePos.y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: Math.random() * 10 + 12,
          growth: Math.random() * 1.0 + 0.5,
          age: 0,
          life: Math.random() * 40 + 40,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.06,
          stretch: Math.random() * 0.3 + 0.5,
          phase: Math.random() * Math.PI * 2,
          density: Math.random() * 0.5 + 0.5,
          turbX: Math.random() * 100,
          turbY: Math.random() * 100,
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
      style={{ opacity: visible ? 1 : 0, filter: 'blur(3px)' }}
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
