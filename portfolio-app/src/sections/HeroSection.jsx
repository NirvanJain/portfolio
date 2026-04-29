import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import profilePic from '../config/pfp.jpg'

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#<>[]{}|~'
const DEFAULT_NAME = 'VOIDRA'
const HOVER_NAME   = 'NIRVAN JAIN'
const TICK         = 30

/* ─── HoverName ────────────────────────────────────────────────── */
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

  useEffect(() => {
    if (isHovering) {
      hoverStartTime.current = Date.now()
    } else {
      hoverStartTime.current = null
    }
  }, [isHovering])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    let w = canvas.offsetWidth
    let h = canvas.offsetHeight
    canvas.width = w
    canvas.height = h

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)

    const spawnParticle = (x, y) => {
      particles.current.push({
        x: x + (Math.random() - 0.5) * 15,
        y: y + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 1.0 - 0.5,
        age: 0,
        maxAge: Math.random() * 60 + 60,
        size: Math.random() * 15 + 15,
        growth: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (isHovering && hoverStartTime.current && Date.now() - hoverStartTime.current > 500) {
        if (Math.random() < 0.6) {
           spawnParticle(mousePos.current.x, mousePos.current.y)
        }
      }

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        
        p.age++
        if (p.age >= p.maxAge) {
          particles.current.splice(i, 1)
          continue
        }

        // Swirling effect
        p.x += p.vx + Math.sin(p.phase + p.age * 0.05) * 0.4
        p.y += p.vy
        p.size += p.growth

        // Fade in, then fade out
        let alpha = 0
        if (p.age < 20) {
          alpha = (p.age / 20) * 0.35
        } else {
          alpha = (1 - (p.age - 20) / (p.maxAge - 20)) * 0.35
        }

        // Realistic dark red/grey smoke
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        grad.addColorStop(0, `rgba(90, 20, 20, ${alpha})`)
        grad.addColorStop(0.5, `rgba(40, 10, 10, ${alpha * 0.8})`)
        grad.addColorStop(1, `rgba(10, 5, 5, 0)`)
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isHovering, mousePos])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-50 transition-opacity duration-500"
      style={{ filter: 'blur(5px)', opacity: isHovering ? 1 : 0 }}
    />
  )
}

/* ─── PhotoFrame ────────────────────────────────────────────────── */
// Deadpool-inspired gritty frame with realistic smoke
function PhotoFrame({ isInView, scrollYProgress }) {
  const [isHovered, setIsHovered] = useState(false)
  const hoverRef = useRef(null)
  const scaleScroll = useTransform(scrollYProgress, [0, 1], [1, 0.6])
  const opacityScroll = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const mousePos = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!hoverRef.current) return
    const rect = hoverRef.current.getBoundingClientRect()
    mousePos.current = {
      x: (e.clientX - rect.left) / rect.width * hoverRef.current.offsetWidth,
      y: (e.clientY - rect.top) / rect.height * hoverRef.current.offsetHeight
    }
  }

  return (
    <motion.div
      className="relative flex-shrink-0 ml-12 sm:ml-20 lg:ml-28 z-20"
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        scale: scaleScroll,
        opacity: useTransform(opacityScroll, (v) => v),
        perspective: 1500
      }}
    >
      <motion.div
        ref={hoverRef}
        className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        animate={{ scale: isHovered ? 1.15 : 1 }}
        transition={{ scale: { duration: 0.4, ease: "easeOut" } }}
      >
        <motion.div 
          className="absolute inset-0 rounded-2xl p-[4px] group bg-[#111]"
          animate={{ rotateY: isHovered ? 1080 : 0 }}
          transition={{ rotateY: { duration: 1.5, ease: "easeInOut" } }}
          style={{ transformStyle: 'preserve-3d', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9)' }}
        >
          {/* Deadpool Gritty Border */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #6b0000 0%, #1a0101 40%, #8a0505 60%, #0a0000 100%)',
            }}
          />
          
          {/* Tactical diagonal hashing */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, #000 8px, #000 16px)'
            }}
          />
          
          {/* Inner image container */}
          <div className="absolute inset-[4px] bg-[#0a0a0a] rounded-[12px] overflow-hidden border border-black/80">
            <img
              src={profilePic}
              alt="Profile photograph"
              className="w-full h-full object-cover"
              style={{
                filter: 'contrast(1.15) saturate(0.85)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            />
            {/* The back of the image (Deadpool style inside out) */}
            <div 
              className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center"
              style={{ 
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                background: 'radial-gradient(circle, #5a0404 0%, #050000 100%)'
              }}
            >
              <img
                src={profilePic}
                alt="Profile photograph back"
                className="w-full h-full object-cover opacity-15 mix-blend-overlay grayscale"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-40 text-7xl font-black text-white mix-blend-overlay">X</div>
            </div>

            {/* Subtle red bottom overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>
          
          {/* Outer Crimson Glow */}
          <div 
            className="absolute inset-0 rounded-2xl blur-xl -z-10 transition-opacity duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(160,20,20,0.5) 0%, transparent 70%)',
              opacity: isHovered ? 0.9 : 0.3,
            }}
          />
        </motion.div>

        {/* Smoke Effect Overlay */}
        <SmokeEffect isHovering={isHovered} mousePos={mousePos} />
      </motion.div>
    </motion.div>
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
