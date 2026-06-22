import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import GlitchText from '../components/GlitchText'
import ScrollSection from '../components/ScrollSection'

function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })
  const dirs = {
    up: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -40 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={dirs[direction].initial}
      animate={isInView ? dirs[direction].animate : dirs[direction].initial}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function AboutSection({ scrollContainer }) {
  return (
    <ScrollSection scrollContainer={scrollContainer}>
      <section
        id="about"
        data-section
        className="relative min-h-screen flex items-center px-6 sm:px-12 lg:px-20 py-24 sm:py-32"
      >
        <div className="max-w-5xl mx-auto w-full" style={{ zIndex: 10 }}>
          <Reveal delay={0} direction="left">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.5em] text-white/20 block mb-8 sm:mb-12">
              01 // ABOUT
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <Reveal delay={0.1}>
                <GlitchText
                  text="WHO AM I?"
                  as="h2"
                  trigger="mount"
                  duration={800}
                  className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white"
                />
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-6 h-px bg-white/10 max-w-[120px]" />
              </Reveal>
              <div className="mt-8 grid grid-cols-3 gap-6">
                {[
                  { value: '3+', label: 'YEARS' },
                  { value: '15+', label: 'PROJECTS' },
                  { value: '∞', label: 'CURIOSITY' },
                ].map((stat, i) => (
                  <Reveal key={stat.label} delay={0.4 + i * 0.1}>
                    <div className="text-center lg:text-left" data-hoverable>
                      <div className="font-display text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                      <div className="font-mono text-[8px] sm:text-[9px] text-white/25 tracking-[0.2em] mt-1">{stat.label}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <Reveal delay={0.2} direction="right">
                <p className="font-body text-sm sm:text-base text-white/50 leading-relaxed">
                  Full-stack builder using Java, JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, and Docker. I'm equally invested in system design, distributed systems, and understanding how software scales from the ground up.
                </p>
              </Reveal>
              <Reveal delay={0.3} direction="right">
                <p className="font-body text-sm sm:text-base text-white/50 leading-relaxed">
                  Open source, experimentation, and curiosity fuel my work. I&apos;ve contributed through GSSOC and Hacktoberfest, collaborating with developer communities on meaningful tooling improvements.
                </p>
              </Reveal>
              <Reveal delay={0.6} direction="scale">
                <div className="mt-8 p-5 border border-white/10 hover:border-white/20 transition-colors duration-500" data-hoverable>
                  <div className="font-mono text-[9px] tracking-[0.3em] text-white/30 mb-2">PHILOSOPHY</div>
                  <p className="font-display text-sm sm:text-base text-white/70 font-light italic">
                    &ldquo;If it feels like a normal website, I haven&apos;t tried hard enough.&rdquo;
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </ScrollSection>
  )
}
