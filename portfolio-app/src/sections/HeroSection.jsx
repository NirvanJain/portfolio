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

/* ─── PhotoFrame ────────────────────────────────────────────────── */
// Black & White glitchy frame with hover spotlight effect
function PhotoFrame({ isInView, scrollYProgress }) {
  const [isHovered, setIsHovered] = useState(false)
  const frameRef = useRef(null)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.6])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <motion.div
      ref={frameRef}
      className={`relative flex-shrink-0 ml-8 sm:ml-12 lg:ml-16 photo-frame${isHovered ? ' active' : ''}`}
      initial={{ opacity: 0, scale: 0.8, x: 50 }}
      animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        scale,
        opacity: useTransform(opacity, (v) => v),
      }}
    >
      {/* Glitchy border container - smaller size */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
        {/* Animated gradient border background - Black & White */}
        <div className="absolute inset-0 rounded-sm overflow-hidden">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(45deg, #ffffff, #666666, #1a1a1a, #ffffff)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 3s ease infinite',
            }}
          />
        </div>

        {/* Glitch overlay layers - Black & White */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.15) 0px,
              rgba(255, 255, 255, 0.15) 1px,
              transparent 1px,
              transparent 3px
            )`,
            animation: 'glitchScan 4s linear infinite',
          }}
        />

        {/* Secondary glitch layer - Black & White */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.2) 0px,
              rgba(255, 255, 255, 0.2) 2px,
              transparent 2px,
              transparent 4px
            )`,
            animation: 'glitchHorizontal 5s linear infinite reverse',
          }}
        />

        {/* Corner accents */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-white/80"
             style={{ boxShadow: '0 0 10px rgba(255,255,255,0.5)' }} />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-white/80"
             style={{ boxShadow: '0 0 10px rgba(255,255,255,0.5)' }} />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-white/80"
             style={{ boxShadow: '0 0 10px rgba(255,255,255,0.5)' }} />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-white/80"
             style={{ boxShadow: '0 0 10px rgba(255,255,255,0.5)' }} />

        {/* Image placeholder */}
        <div
          className="absolute inset-[3px] bg-black/90 flex items-center justify-center overflow-hidden"
          style={{
            backdropFilter: 'blur(10px)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          {/* Replace src with your actual photograph path */}
          <img
            src={profilePic}
            alt="Profile photograph"
            className="w-full h-full object-cover grayscale contrast-125"
            style={{
              filter: 'contrast(1.2) brightness(0.9) saturate(0)',
            }}
            onError={(e) => {
              // Fallback when no image is present
              e.target.style.display = 'none'
              e.target.nextElementSibling.style.display = 'flex'
            }}
          />
          {/* Fallback placeholder */}
          <div
            className="hidden w-full h-full flex-col items-center justify-center text-center p-4"
            style={{ display: 'none' }}
          >
            <div className="text-4xl mb-2 opacity-30">📷</div>
            <p className="font-mono text-[10px] text-white/40 tracking-wider">
              ADD YOUR PHOTO
            </p>
          </div>
        </div>

        {/* Random glitch sparks */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, transparent 2%)`,
            opacity: 0,
            animation: 'glitchSparks 2s steps(10) infinite',
          }}
        />
      </div>

      {/* Decorative tech elements - Black & White */}
      <div className="absolute -bottom-6 left-0 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-white/60 to-transparent"
            style={{
              height: `${Math.random() * 16 + 8}px`,
              animation: `pulse ${0.5 + i * 0.2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>
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
