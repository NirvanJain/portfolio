import { useRef, useEffect, useState } from 'react'

export default function GlobalSmokeStream({ scrollContainer }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const gathered = useRef([])
  const mouse = useRef({ x: -1000, y: -1000 })
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

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const isAtBottom = () => {
      const el = scrollContainer?.current
      if (!el) return false
      return el.scrollTop + el.clientHeight >= el.scrollHeight - 50
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn — same density as cursor smoke
      const count = Math.random() > 0.5 ? 2 : 1
      for (let s = 0; s < count; s++) {
        particles.current.push({
          x: 55 + (Math.random() - 0.5) * 8,
          y: -5 + (Math.random() - 0.5) * 5,
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 1.5 + 1.0,        // Falling instead of drifting
          size: Math.random() * 4 + 4,           // Same as cursor: 4-8px
          age: 0,
          life: Math.random() * 30 + 40          // Same as cursor: 40-70 frames
        })
      }

      const atBottom = isAtBottom()
      const floorY = canvas.height - 25

      // Update & draw falling particles — identical style to cursor smoke
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        p.age++

        if (p.age >= p.life) {
          // If at bottom, gather instead of removing
          if (atBottom) {
            gathered.current.push({
              x: p.x + (Math.random() - 0.5) * 30,
              y: floorY + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 0.3,
              size: p.size,
              age: 0,
              life: Math.random() * 80 + 120,
              noiseSeed: Math.random() * 1000
            })
          }
          particles.current.splice(i, 1)
          continue
        }

        p.x += p.vx
        p.y += p.vy
        p.size += 0.2            // Same grow rate as cursor
        p.vx *= 0.98             // Same friction as cursor
        p.vy *= 0.98

        // Gather on floor if at bottom
        if (atBottom && p.y >= floorY) {
          gathered.current.push({
            x: p.x + (Math.random() - 0.5) * 20,
            y: floorY + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 0.3,
            size: p.size,
            age: 0,
            life: Math.random() * 80 + 120,
            noiseSeed: Math.random() * 1000
          })
          particles.current.splice(i, 1)
          continue
        }

        // Remove if off screen
        if (p.y > canvas.height + 30) {
          particles.current.splice(i, 1)
          continue
        }

        const opacity = Math.max(0, 1 - p.age / p.life)

        // Draw — exact same style as cursor smoke
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = isDark 
          ? `rgba(180, 180, 200, ${opacity * 0.15})`
          : `rgba(60, 40, 80, ${opacity * 0.15})`
        ctx.fill()
      }

      // Cap gathered
      if (gathered.current.length > 500) {
        gathered.current.splice(0, gathered.current.length - 500)
      }

      // Draw gathered floor particles
      for (let i = gathered.current.length - 1; i >= 0; i--) {
        const p = gathered.current[i]
        p.age++

        if (!atBottom) {
          // Fade out quickly when scrolling away
          p.age += 3
        }

        if (p.age >= p.life) {
          gathered.current.splice(i, 1)
          continue
        }

        // Mouse displacement
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          const force = (100 - dist) / 100
          p.x -= (dx / dist) * force * 4
          p.y -= (dy / dist) * force * 2
        }

        // Settle back to floor
        p.y += (floorY - p.y) * 0.02
        p.x += p.vx + Math.sin(p.age * 0.02 + (p.noiseSeed || 0)) * 0.05

        const opacity = Math.max(0, 1 - p.age / p.life)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = isDark 
          ? `rgba(180, 180, 200, ${opacity * 0.15})`
          : `rgba(60, 40, 80, ${opacity * 0.15})`
        ctx.fill()
      }

      animationId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [isDark, scrollContainer])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[40]"
      style={{ filter: 'blur(4px)' }}
    />
  )
}
