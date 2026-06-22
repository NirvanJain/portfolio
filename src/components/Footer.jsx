import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Footer({ scrollContainer }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const gatheredParticles = useRef([])
  const [isDark, setIsDark] = useState(true)
  const mouse = useRef({ x: -1000, y: -1000 })
  
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
      canvas.height = 400 
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const spawnParticle = (isStream = true) => {
      const x = isStream 
        ? 55 + (Math.random() - 0.5) * 6   // Thin ~6px spread, matching global stream
        : Math.random() * canvas.width    
      
      return {
        x,
        y: isStream ? -10 : canvas.height + 20,
        vx: (Math.random() - 0.5) * 0.15,
        vy: isStream ? (Math.random() * 1.2 + 1.0) : -(Math.random() * 0.5 + 0.3),
        size: Math.random() * 6 + 4,         // Small particles matching stream
        opacity: 0,
        maxOpacity: Math.random() * 0.12 + 0.06,
        life: 0,
        maxLife: Math.random() * 200 + 300,
        noiseSeed: Math.random() * 1000
      }
    }

    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Thin stream falling in
      if (Math.random() < 0.35) {
        particles.current.push(spawnParticle(true))
      }

      const color = isDark ? '200, 200, 230' : '40, 40, 60'

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        
        const turbulence = Math.sin(time * 0.001 + p.noiseSeed) * 0.15
        p.y += p.vy
        p.x += p.vx + turbulence
        p.life++
        
        if (p.opacity < p.maxOpacity) p.opacity += 0.008

        // Gather at the floor
        if (p.y >= canvas.height - 50) {
          p.y = canvas.height - 50 + (Math.random() - 0.5) * 15
          p.x = p.x + (Math.random() - 0.5) * 30 // Spread out slightly when hitting floor
          p.vx = (Math.random() - 0.5) * 0.3
          p.vy = 0
          p.size = Math.random() * 8 + 5  // Slightly bigger on floor
          gatheredParticles.current.push(p)
          particles.current.splice(i, 1)
          continue
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        grad.addColorStop(0, `rgba(${color}, ${p.opacity})`)
        grad.addColorStop(0.6, `rgba(${color}, ${p.opacity * 0.3})`)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Cap gathered particles
      if (gatheredParticles.current.length > 500) {
        gatheredParticles.current.shift()
      }

      // Add floor density across the width
      if (Math.random() < 0.2) {
        gatheredParticles.current.push(spawnParticle(false))
      }

      for (let i = gatheredParticles.current.length - 1; i >= 0; i--) {
        const p = gatheredParticles.current[i]
        
        // Mouse displacement
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.x -= (dx / dist) * force * 5
          p.y -= (dy / dist) * force * 3
        }

        // Settle back to floor
        p.y += (canvas.height - 50 - p.y) * 0.02
        p.x += p.vx + Math.sin(time * 0.0005 + p.noiseSeed) * 0.08
        
        if (p.opacity < p.maxOpacity) p.opacity += 0.002

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        const alpha = p.opacity * 0.9
        grad.addColorStop(0, `rgba(${color}, ${alpha})`)
        grad.addColorStop(0.6, `rgba(${color}, ${alpha * 0.3})`)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(render)
    }
    render(0)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [isDark])

  return (
    <footer className="relative w-full h-[400px] border-t border-white/5 bg-black overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none"
        style={{ filter: 'blur(3px)' }}
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="z-10 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-mono text-[10px] tracking-[0.6em] text-white/20 uppercase mb-6"
          >
            V O I D // S Y S T E M S
          </motion.p>
          <div className="flex gap-16">
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-mono text-[8px] text-white/5 uppercase tracking-[0.3em]">Foundation</span>
              <span className="font-mono text-[10px] text-white/30 tracking-widest">MINDSPACE V1</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-mono text-[8px] text-white/5 uppercase tracking-[0.3em]">Protocol</span>
              <span className="font-mono text-[10px] text-white/30 tracking-widest">NJ // © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top */}
      <motion.button
        onClick={() => scrollContainer.current?.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute bottom-16 right-16 z-20 w-14 h-14 rounded-full border border-white/5 bg-white/[0.03] flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all duration-700 backdrop-blur-sm group"
        whileHover={{ y: -8, scale: 1.05 }}
        data-hoverable
      >
        <span className="font-mono text-[9px] tracking-tighter group-hover:tracking-[0.2em] transition-all duration-500">ASCEND</span>
      </motion.button>
    </footer>
  )
}
