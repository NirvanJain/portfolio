import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import GlitchText from '../components/GlitchText'
import ScrollSection from '../components/ScrollSection'
import { SOCIAL_LINKS } from '../data/socialLinks'

export default function ContactSection({ scrollContainer, socialsDocked = false }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <ScrollSection scrollContainer={scrollContainer} scaleRange={[0.9, 1, 1]} opacityRange={[0, 1, 1]} yRange={[100, 0, 0]} blurRange={[8, 0, 0]} entryOnly>
      <section id="contact" data-section ref={ref} className="relative min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto w-full text-center" style={{ zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-6">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.5em] text-white/20">05 // CONTACT ME</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50, scale: 0.92 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
            <GlitchText text="LET'S BUILD" as="h2" trigger={isInView ? 'mount' : 'hover'} duration={900} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white" />
            <GlitchText text="SOMETHING" as="h2" trigger={isInView ? 'mount' : 'hover'} duration={900} delay={200} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white" />
          </motion.div>

          <motion.p className="font-body text-xs sm:text-sm text-white/30 mt-6 max-w-sm mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}>
            Got an idea? Want to collaborate? Or just passing through? I&apos;m always open to interesting conversations.
          </motion.p>

          <motion.div className="mt-8 mx-auto h-px bg-white/8 max-w-[100px]" initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ delay: 0.8, duration: 1 }} />

          <motion.div
            className="mt-10 max-w-md mx-auto text-left"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.35em] text-white/20">SOCIALS</span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] text-white/15">CONTACT ME</span>
            </div>

            <div className="space-y-3 min-h-[276px]">
              {socialsDocked && SOCIAL_LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  layoutId={`social-link-${link.id}`}
                  className="flex items-center justify-between rounded-[6px] py-3.5 px-5 border border-white/8 bg-black/20 hover:border-white/25 hover:bg-white/[0.03] transition-colors duration-300 group"
                  initial={{ opacity: 0, x: -30, y: 15, scale: 0.92 }}
                  animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, x: -30, y: 15, scale: 0.92 }}
                  transition={{
                    layout: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    delay: socialsDocked ? i * 0.04 : 0,
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  data-hoverable
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-white/8 text-[9px] font-mono text-white/25 group-hover:text-white/60 transition-colors duration-300">
                      {link.shortLabel}
                    </span>
                    <div>
                      <div className="font-mono text-[8px] tracking-[0.3em] text-white/20">{link.label}</div>
                      <div className="font-body text-xs sm:text-sm text-white/45 group-hover:text-white transition-colors duration-300">{link.value}</div>
                    </div>
                  </div>
                  <span className="font-mono text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-300 text-sm">-&gt;</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div className="mt-20 font-mono text-[9px] text-white/10 tracking-[0.25em]" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }}>
            DESIGNED & BUILT BY NIRVAN JAIN / {new Date().getFullYear()}
          </motion.div>
        </div>
      </section>
    </ScrollSection>
  )
}
