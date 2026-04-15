import { useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import GlitchText from '../components/GlitchText'
import ScrollSection from '../components/ScrollSection'

export default function HeroSection({ scrollContainer }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })
  const nameRef = useRef(null)
  const [nameHover, setNameHover] = useState(false)

  const handleNameMove = useCallback((e) => {
    const el = nameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.6])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const blur = useTransform(scrollYProgress, [0, 0.7], [0, 14])

  return (
    <section
      id="hero"
      data-section
      ref={ref}
      className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      <motion.div
        className="relative text-center max-w-5xl w-full"
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
          <div
            ref={nameRef}
            className={`name-hover${nameHover ? ' active' : ''}`}
            onMouseMove={handleNameMove}
            onMouseEnter={() => setNameHover(true)}
            onMouseLeave={() => setNameHover(false)}
            data-hoverable
          >
            <GlitchText
              text="NIRVAN JAIN"
              as="h1"
              trigger="mount"
              duration={1500}
              delay={800}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-mono font-bold tracking-tight text-white leading-[0.85]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-6 sm:mt-8"
        >
          <p className="font-display text-base sm:text-lg md:text-xl text-white/40 font-light tracking-[0.15em]">
            FULL-STACK DEVELOPER · CREATIVE TECHNOLOGIST
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="mt-4"
        >
          <p className="font-body text-sm sm:text-base text-white/25 max-w-md mx-auto">
            I build things that feel different.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
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
