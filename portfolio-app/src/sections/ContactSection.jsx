import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import GlitchText from '../components/GlitchText'
import MagneticButton from '../components/MagneticButton'
import ScrollSection from '../components/ScrollSection'

const LINKS = [
  { label: 'X / TWITTER', value: '@NirvanJain25', href: 'https://x.com/NirvanJain25', icon: '✕' },
  { label: 'LINKEDIN', value: 'nirvan-jain', href: 'https://www.linkedin.com/in/nirvan-jain-77ba43374/', icon: '◉' },
  { label: 'SPOTIFY', value: 'nirvan', href: 'https://open.spotify.com/user/31lenipdu5hkj3kdbfugzbjcncpm', icon: '♫' },
]

export default function ContactSection({ scrollContainer }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <ScrollSection scrollContainer={scrollContainer} scaleRange={[0.9, 1, 1]} opacityRange={[0, 1, 1]} yRange={[100, 0, 0]} blurRange={[8, 0, 0]} entryOnly>
      <section id="contact" data-section ref={ref} className="relative min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto w-full text-center" style={{ zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-6">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.5em] text-white/20">04 // CONTACT</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50, scale: 0.92 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
            <GlitchText text="LET'S BUILD" as="h2" trigger={isInView ? 'mount' : 'hover'} duration={900} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white" />
            <GlitchText text="SOMETHING" as="h2" trigger={isInView ? 'mount' : 'hover'} duration={900} delay={200} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white" />
          </motion.div>

          <motion.p className="font-body text-xs sm:text-sm text-white/30 mt-6 max-w-sm mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}>
            Got an idea? Want to collaborate? Or just passing through? I&apos;m always open to interesting conversations.
          </motion.p>

          <motion.div className="mt-8 mx-auto h-px bg-white/8 max-w-[100px]" initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ delay: 0.8, duration: 1 }} />

          <div className="mt-10 space-y-3 max-w-md mx-auto text-left">
            {LINKS.map((link, i) => (
              <motion.a
                key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between py-3.5 px-5 border border-white/8 hover:border-white/25 hover:bg-white/[0.02] transition-all duration-400 group"
                initial={{ opacity: 0, x: -30, y: 15 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                data-hoverable
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-sm sm:text-base text-white/15 group-hover:text-white/50 transition-colors duration-300">{link.icon}</span>
                  <div>
                    <div className="font-mono text-[8px] tracking-[0.3em] text-white/20">{link.label}</div>
                    <div className="font-body text-xs sm:text-sm text-white/45 group-hover:text-white transition-colors duration-300">{link.value}</div>
                  </div>
                </div>
                <span className="font-mono text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-300 text-sm">→</span>
              </motion.a>
            ))}
          </div>

          <motion.div className="mt-20 font-mono text-[9px] text-white/10 tracking-[0.25em]" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}>
            DESIGNED & BUILT BY NIRVAN JAIN · {new Date().getFullYear()}
          </motion.div>
        </div>
      </section>
    </ScrollSection>
  )
}
