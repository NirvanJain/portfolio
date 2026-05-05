import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion'
import profilePic from '../config/pfp.jpg'

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#<>[]{}|~'
const DEFAULT_NAME = 'VOIDRA'
const HOVER_NAME   = 'NIRVAN JAIN'
const TICK         = 30

/*───HoverName──────────────────────────────────────────────────*/
// Default: VOIDRA — hover reveals NIRVAN JAIN — leave reverts
function HoverName({ className }) {
  const [display, setDisplay] = useState('')
  const [active, setActive]   = useState(false)
  const wrapRef  = useRef(null)
  const tickRef  = useRef(null)
  const frameRef = useRef(0)
  const isHovered = useRef(false)

  const scramble = useCallback((target, durationMs, onDone) => {
    clearInterval(tickRef.current)
    frameRef.current = 0
    const total = Math.ceil(durationMs / TICK)

    tickRef.current = setInterval(() => {
      frameRef.current++
      const progress = frameRef.current / total

      setDisplay(
        target.split('').map((char, i) => {
          if (char === ' ') return ' '
          const threshold = (progress * target.length - i) / target.length
          return threshold > 0.55
            ? char
            : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        }).join('')
      )

      if (frameRef.current >= total) {
        clearInterval(tickRef.current)
        setDisplay(target)
        onDone?.()
      }
    }, TICK)
  }, [])

  // Mount: reveal VOIDRA
  useEffect(() => {
    setDisplay('')
    const t = setTimeout(() => scramble(DEFAULT_NAME, 1200, null), 800)
    return () => { clearTimeout(t); clearInterval(tickRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEnter = useCallback(() => {
    isHovered.current = true
    setActive(true)
    scramble(HOVER_NAME, 700, null)
  }, [scramble])

  const handleLeave = useCallback(() => {
    isHovered.current = false
    setActive(false)
    scramble(DEFAULT_NAME, 500, null)
  }, [scramble])

  const handleMove = useCallback((e) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  }, [])

  return (
    <div
      ref={wrapRef}
      className={`name-hover${active ? ' active' : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      data-hoverable
    >
      <h1
        className={`inline-block whitespace-pre cursor-default ${className}`}
      >
        {display || ' '}
      </h1>
    </div>
  )
}

/* ─── SmokeEffect ───────────────────────────────────────────────── */
function SmokeEffect({ isHovering, mousePos }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const animationRef = useRef(null)
  const hoverStartTime = useRef(null)
  const timeRef = useRef(0)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (isHovering) {
      hoverStartTime.current = Date.now()
    } else {
      hoverStartTime.current = null
    }
  }, [isHovering])

  // Watch for theme changes
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
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Simple pseudo-noise for organic turbulence
    const noise = (x, y) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
      return n - Math.floor(n)
    }

    const spawnParticle = (x, y) => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 0.8 + 0.3
      particles.current.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed * 0.5,
        vy: -Math.random() * 1.5 - 1.2,
        age: 0,
        maxAge: Math.random() * 40 + 80,
        size: Math.random() * 15 + 10,
        growth: Math.random() * 0.6 + 0.25,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        stretch: Math.random() * 0.4 + 0.7, // ellipse ratio
        density: Math.random() * 0.5 + 0.5,  // per-particle opacity multiplier
        turbX: Math.random() * 100,
        turbY: Math.random() * 100,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      timeRef.current += 0.016
      
      if (isHovering && hoverStartTime.current && Date.now() - hoverStartTime.current > 800) {
        // Spawn in small bursts for wispy clumps
        if (Math.random() < 0.15) {
          const count = Math.random() < 0.2 ? 2 : 1
          for (let j = 0; j < count; j++) {
            spawnParticle(mousePos.current.x, mousePos.current.y)
          }
        }
      }

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        
        p.age++
        if (p.age >= p.maxAge) {
          particles.current.splice(i, 1)
          continue
        }

        // Organic turbulence — layered sine waves at different frequencies
        const t = timeRef.current
        const turbulence = 
          Math.sin(p.phase + p.age * 0.02) * 0.6 +
          Math.sin(p.phase * 2.3 + p.age * 0.035) * 0.3 +
          noise(p.turbX + t * 0.5, p.turbY + t * 0.3) * 0.8 - 0.4

        p.x += p.vx + turbulence
        p.y += p.vy
        p.vy *= 0.998 // gradual deceleration
        p.vx *= 0.995
        p.size += p.growth
        p.rotation += p.rotSpeed

        // Gather and pool near the top
        if (p.y < 100) {
          p.vy *= 0.92
          p.vx += (Math.random() - 0.5) * 0.3
          p.growth *= 1.01 // spread out more at the top
        }

        // Lifecycle alpha: quick fade-in, gentle hold, long fade-out
        let alpha = 0
        const life = p.age / p.maxAge
        if (life < 0.1) {
          alpha = (life / 0.1) * 0.07
        } else if (life > 0.6) {
          alpha = ((1 - life) / 0.4) * 0.07
        } else {
          alpha = 0.07
        }
        alpha *= p.density

        // Draw as rotated ellipse for wispy shapes
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.scale(1, p.stretch)

        // Theme-adaptive smoke colors
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
        if (isDark) {
          // Dark theme: soft lavender wisps
          grad.addColorStop(0,   `rgba(230, 220, 255, ${alpha})`)
          grad.addColorStop(0.2, `rgba(200, 180, 240, ${alpha * 0.85})`)
          grad.addColorStop(0.5, `rgba(170, 150, 220, ${alpha * 0.4})`)
          grad.addColorStop(0.8, `rgba(140, 120, 200, ${alpha * 0.1})`)
          grad.addColorStop(1,   `rgba(120, 100, 180, 0)`)
        } else {
          // Light theme: dark moody purple-grey smoke
          grad.addColorStop(0,   `rgba(60, 40, 80, ${alpha * 1.8})`)
          grad.addColorStop(0.2, `rgba(50, 35, 70, ${alpha * 1.4})`)
          grad.addColorStop(0.5, `rgba(40, 28, 60, ${alpha * 0.7})`)
          grad.addColorStop(0.8, `rgba(30, 20, 50, ${alpha * 0.2})`)
          grad.addColorStop(1,   `rgba(20, 15, 40, 0)`)
        }
        
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
        ctx.restore()
      }

      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isHovering, mousePos, isDark])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[100] transition-opacity duration-700 ${isDark ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
      style={{ opacity: isHovering ? 1 : 0, filter: 'blur(6px)' }}
    />
  )
}

/* ─── PhotoFrame ────────────────────────────────────────────────── */
// Sleek, high-end circular frame with tumbling flip and massive smoke
function PhotoFrame({ isInView, scrollYProgress }) {
  const [isHovered, setIsHovered] = useState(false)
  const [hasFlipped, setHasFlipped] = useState(false)
  const mouseIn = useRef(false)
  const [isDark, setIsDark] = useState(true)
  const hoverRef = useRef(null)
  
  const scaleScroll = useTransform(scrollYProgress, [0, 1], [1, 0.6])
  const opacityScroll = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const mousePos = useRef({ x: 0, y: 0 })

  // --- 3D Hover Tracking ---
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 })
  
  const tiltX = useTransform(smoothY, [-150, 150], [15, -15])
  const tiltY = useTransform(smoothX, [-150, 150], [-15, 15])

  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e) => {
    mousePos.current = { x: e.clientX, y: e.clientY }
    
    if (!hoverRef.current) return
    const rect = hoverRef.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseEnter = () => {
    mouseIn.current = true
    setIsHovered(true)
    setHasFlipped(true)
  }

  const handleMouseLeave = () => {
    mouseIn.current = false
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <>
      {/* Smoke Effect overlays the whole screen */}
      <SmokeEffect isHovering={isHovered} mousePos={mousePos} />

      <motion.div
        className="relative flex-shrink-0 ml-12 sm:ml-20 lg:ml-28 z-20"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          scale: scaleScroll,
          opacity: useTransform(opacityScroll, (v) => v),
          perspective: 2000
        }}
      >
        <motion.div
          ref={hoverRef}
          className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          animate={{ scale: isHovered ? 1.15 : 1 }}
          transition={{ scale: { duration: 0.5, ease: "easeOut" } }}
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div 
            className="absolute inset-0 rounded-2xl p-[2px] group"
            animate={{ 
              rotateY: isHovered ? 1440 : 0,
            }}
            transition={{ 
              rotateY: { duration: 2.5, ease: [0.16, 1, 0.3, 1] },
            }}
            style={{ transformStyle: 'preserve-3d', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
          >
            {/* Floating particles inside frame */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-1 h-1 rounded-full bg-white z-0"
                      initial={{ x: '50%', y: '50%', opacity: 1, scale: 0 }}
                      animate={{ 
                        x: `${Math.random() * 100}%`, 
                        y: `${Math.random() * 100}%`,
                        opacity: 0,
                        scale: Math.random() * 3 + 1
                      }}
                      transition={{ 
                        duration: Math.random() * 0.8 + 0.4, 
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatDelay: Math.random() * 1
                      }}
                      style={{
                        boxShadow: isDark ? '0 0 10px 2px rgba(255, 255, 255, 0.8)' : '0 0 10px 2px rgba(0, 0, 0, 0.5)',
                        backgroundColor: isDark ? '#fff' : '#000',
                        transform: 'translateZ(30px)' // pop out slightly
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Glowing gradient rim background */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(200, 180, 255,0.9) 0%, rgba(30,30,40,1) 30%, rgba(200, 180, 255,0.6) 70%, rgba(10,10,15,1) 100%)'
                  : 'linear-gradient(135deg, rgba(60, 40, 80,0.9) 0%, rgba(220,220,230,1) 30%, rgba(60, 40, 80,0.6) 70%, rgba(240,240,245,1) 100%)',
              }}
            />
            
            {/* Inner image container */}
            <div className={`absolute inset-[2px] ${isDark ? 'bg-[#050505]' : 'bg-[#f0f0f2]'} rounded-[14px] overflow-hidden`}>
              <img
                src={profilePic}
                alt="Profile photograph"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{
                  filter: 'contrast(1.05)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              />
              
              {/* The back of the image (Frosted red Glass) */}
              <div 
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
                style={{ 
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(0,0,0,1) 100%)'
                }}
              >
                <div className="absolute w-[150%] h-[150%] rounded-full bg-[radial-gradient(circle,rgba(200, 180, 255,0.15)_0%,transparent_60%)] animate-pulse" />
                <div className={`z-10 text-5xl font-mono ${isDark ? 'text-white/90' : 'text-black/90'} tracking-[0.2em] font-light`}
                  style={{ textShadow: isDark ? '0 0 20px rgba(200, 180, 255,0.8)' : '0 0 20px rgba(60, 40, 80,0.5)' }}
                >
                  NJ
                </div>
              </div>

              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
            
            {/* Outer premium glow */}
            <div 
              className="absolute inset-[-20px] rounded-2xl blur-2xl -z-10 transition-opacity duration-700 pointer-events-none"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, rgba(180, 160, 255,0.4) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(60, 40, 80,0.3) 0%, transparent 70%)',
                opacity: isHovered ? 1 : 0.3,
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}

/* ─── HeroSection ──────────────────────────────────────────────── */
export default function HeroSection({ scrollContainer }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start start', 'end start'],
  })

  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.6])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y       = useTransform(scrollYProgress, [0, 1], [0, -100])
  const blur    = useTransform(scrollYProgress, [0, 0.7], [0, 14])

  return (
    <section
      id="hero"
      data-section
      ref={ref}
      className="relative h-screen flex flex-row items-center justify-start pl-20 sm:pl-24 md:pl-28 pr-8 overflow-hidden"
    >
      {/* Left side - Text content */}
      <motion.div
        className="relative text-left max-w-2xl flex-1"
        style={{
          zIndex: 10,
          scale,
          opacity,
          y,
          filter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.5em] text-white/30 uppercase">
            Welcome to my world
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <HoverName
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono font-bold tracking-tight text-white leading-[0.9]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-6 sm:mt-8"
        >
          <p className="font-display text-base sm:text-lg md:text-xl text-white/40 font-light tracking-[0.15em] text-left">
            FULL-STACK DEVELOPER · CREATIVE TECHNOLOGIST
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="mt-4"
        >
          <p className="font-body text-sm sm:text-base text-white/25 max-w-md text-left">
            I build things that feel different.
          </p>
        </motion.div>
      </motion.div>

      {/* Right side - Photograph with glitchy border */}
      <PhotoFrame isInView={isInView} scrollYProgress={scrollYProgress} />

      <motion.div
        className="absolute bottom-10 left-24 sm:left-28 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 3 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
      >
        <span className="font-mono text-[8px] tracking-[0.4em] text-white/20">SCROLL</span>
        <motion.div
          className="w-px h-8 bg-white/20 origin-top"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="absolute top-8 left-8 w-10 h-10 border-l-[1.5px] border-t-[1.5px] border-white/10" />
      <div className="absolute top-8 right-8 w-10 h-10 border-r-[1.5px] border-t-[1.5px] border-white/10" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-l-[1.5px] border-b-[1.5px] border-white/10" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-r-[1.5px] border-b-[1.5px] border-white/10" />
    </section>
  )
}
