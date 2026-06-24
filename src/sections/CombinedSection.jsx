import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import HoverName from '../components/HoverName'
import Reveal from '../components/Reveal'

export default function CombinedSection({ scrollContainer }) {
  // Hero part refs
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: false })

  const { scrollYProgress } = useScroll({
    target: heroRef,
    container: scrollContainer,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.6])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const blur = useTransform(scrollYProgress, [0, 0.7], [0, 14])

  return (
    <section id="hero" data-section ref={heroRef} className="relative h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden">
      {/* Left – Hero Text */}
      <motion.div className="relative flex-1 flex flex-col items-center justify-center p-8 text-center"
        style={{
          zIndex: 10,
          scale,
          opacity,
          y,
          filter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
      >
        <Reveal delay={0} direction="up" className="mb-6">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.5em] text-white/30 uppercase">
            Welcome to my world
          </span>
        </Reveal>
        <Reveal delay={0.58} direction="up">
          <HoverName className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono font-bold tracking-tight text-white" />
        </Reveal>
        <Reveal delay={1.8} direction="up" className="mt-6 sm:mt-8">
          <p className="font-display text-base sm:text-lg md:text-xl text-white/40 font-light tracking-[0.15em] text-center">
            FULL-STACK DEVELOPER · CREATIVE TECHNOLOGIST
          </p>
        </Reveal>
        <Reveal delay={2.4} direction="up" className="mt-4">
          <p className="font-body text-sm sm:text-base text-white/25 max-w-md text-center">
            I build things that feel different.
          </p>
        </Reveal>
      </motion.div>

      {/* Right – Intro Paragraphs */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Reveal delay={0} direction="up">
          <p className="font-body text-sm sm:text-base text-white/50 leading-relaxed max-w-md text-center">
            Full-stack builder using Java, JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, and Docker. I'm equally invested in system design, distributed systems, and understanding how software scales.
          </p>
        </Reveal>
        <Reveal delay={0.2} direction="up">
          <p className="font-body text-sm sm:text-base text-white/50 leading-relaxed max-w-md text-center mt-2">
            Open source, experimentation, and curiosity fuel my work. I've contributed through GSSOC and Hacktoberfest, collaborating with developer communities.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
