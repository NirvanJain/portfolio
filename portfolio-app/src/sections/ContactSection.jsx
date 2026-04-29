import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import GlitchText from '../components/GlitchText'
import ScrollSection from '../components/ScrollSection'
import { SOCIAL_LINKS } from '../data/socialLinks'

/* ─── Icons ────────────────────────────────────────────────────── */
const ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 11.6A9.65 9.65 0 0 1 16.5 10" />
      <path d="M8.5 14.5A6.5 6.5 0 0 1 15 13" />
      <path d="M9 17.3A3.5 3.5 0 0 1 13.5 16" />
    </svg>
  ),
  linkedin: ( 
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
}

/* ─── Contact card ─────────────────────────────────────────────── */
function ContactCard({ link, index, scrollProgress, isDark }) {
  const [hovered, setHovered] = useState(false)

  const start = 0.83 + index * 0.028
  const end   = 0.95 + index * 0.008

  const rawOpacity = useTransform(scrollProgress, [start, end], [0, 1])
  const rawY       = useTransform(scrollProgress, [start, end], [28, 0])
  const opacity    = useSpring(rawOpacity, { stiffness: 85, damping: 20 })
  const y          = useSpring(rawY,       { stiffness: 85, damping: 20 })

  return (
    <motion.a
      layoutId={`social-pill-${link.id}`}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-between rounded-xl overflow-hidden"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        background: hovered
          ? (isDark ? 'rgba(22, 18, 36, 0.96)' : 'rgba(248, 245, 255, 0.96)')
          : (isDark ? 'rgba(14, 14, 18, 0.92)' : 'rgba(255, 255, 255, 0.92)'),
        borderColor: hovered
          ? (isDark ? 'rgba(130, 100, 210, 0.35)' : 'rgba(120, 90, 200, 0.35)')
          : (isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.08)'),
        boxShadow: hovered
          ? (isDark
              ? '0 0 0 1px rgba(130,100,210,0.15), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(130,100,210,0.1)'
              : '0 0 0 1px rgba(120,90,200,0.15), 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(120,90,200,0.08)')
          : (isDark
              ? '0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)'
              : '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'),
      }}
      transition={{ duration: 0.22, ease: 'easeOut',
        layout: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
      }}
      whileHover={{ scale: 1.009 }}
      style={{
        opacity, y,
        padding: '14px 20px',
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        backdropFilter: 'blur(16px)',
      }}
      data-hoverable
    >
      {/* Purple-red left accent bar — slides in on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="accent"
            className="pointer-events-none absolute left-0 top-0 bottom-0"
            style={{ width: 2, borderRadius: '0 2px 2px 0' }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="block w-full h-full"
              style={{
                background: 'linear-gradient(to bottom, rgba(100,70,200,0.1), rgba(138, 110, 220,0.9), rgba(100,70,200,0.1))',
                boxShadow: '0 0 12px rgba(138, 110, 220,0.6), 0 0 24px rgba(138, 110, 220,0.2)',
              }}
            />
          </motion.span>
        )}
      </AnimatePresence>

      {/* red underpaint wash */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="wash"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: 'radial-gradient(ellipse at 0% 50%, rgba(120,90,200,0.09) 0%, transparent 60%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Sheen sweep */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="sheen"
            className="pointer-events-none absolute inset-0"
            initial={{ x: '-100%' }}
            animate={{ x: '120%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            style={{
              background: 'linear-gradient(105deg, transparent 30%, rgba(138, 110, 220,0.07) 50%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon box + text */}
      <div className="flex items-center gap-4 relative z-10">
        <motion.span
          className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
          animate={{
            background: hovered 
              ? (isDark ? 'rgba(30, 22, 50, 0.9)' : 'rgba(245, 240, 255, 0.9)')
              : (isDark ? 'rgba(16, 16, 20, 0.85)' : 'rgba(250, 250, 255, 0.85)'),
            borderColor: hovered 
              ? (isDark ? 'rgba(138, 110, 220, 0.3)' : 'rgba(120, 90, 200, 0.3)')
              : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
            color: hovered 
              ? (isDark ? 'rgba(200, 190, 248, 0.95)' : 'rgba(90, 60, 180, 0.95)')
              : (isDark ? 'rgba(110, 105, 130, 0.65)' : 'rgba(80, 75, 100, 0.65)'),
            boxShadow: hovered 
              ? (isDark ? '0 0 0 1px rgba(138, 110, 220,0.15), 0 0 14px rgba(138, 110, 220,0.12)' : '0 0 0 1px rgba(120, 90, 200,0.15), 0 0 14px rgba(120,90,200,0.08)')
              : 'none',
          }}
          transition={{ duration: 0.2 }}
          style={{ border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}
        >
          {ICONS[link.id]}
        </motion.span>

        <div>
          <div className="font-mono text-[8px] tracking-[0.38em] mb-1"
            style={{ color: 'rgba(100, 95, 120, 0.7)' }}>
            {link.label}
          </div>
          <motion.div
            className="font-body text-sm"
            animate={{ color: hovered 
            ? (isDark ? 'rgba(225, 220, 255, 0.92)' : 'rgba(40, 20, 80, 0.92)')
            : (isDark ? 'rgba(160, 155, 175, 0.6)' : 'rgba(80, 75, 100, 0.6)') }}
            transition={{ duration: 0.18 }}
          >
            {link.value}
          </motion.div>
        </div>
      </div>

      {/* Animated arrow */}
      <motion.span
        className="relative z-10 font-mono text-xs"
        animate={{
          color: hovered 
            ? (isDark ? 'rgba(160, 130, 240, 0.85)' : 'rgba(100, 70, 200, 0.85)')
            : (isDark ? 'rgba(100, 95, 115, 0.3)' : 'rgba(80, 75, 100, 0.3)'),
          x: hovered ? 4 : 0,
        }}
        transition={{ duration: 0.18 }}
      >
        →
      </motion.span>
    </motion.a>
  )
}

/* ─── Section ──────────────────────────────────────────────────── */
export default function ContactSection({ scrollContainer }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })
  const { scrollYProgress } = useScroll({ container: scrollContainer })
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

  return (
    <ScrollSection scrollContainer={scrollContainer} scaleRange={[0.9, 1, 1]} opacityRange={[0, 1, 1]} yRange={[100, 0, 0]} blurRange={[8, 0, 0]} entryOnly>
      <section id="contact" data-section ref={ref} className="relative min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto w-full text-center" style={{ zIndex: 10 }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }} className="mb-6"
          >
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.5em]"
              style={{ color: 'rgba(110, 105, 130, 0.6)' }}>
              05 // CONTACT ME
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlitchText text="LET'S BUILD" as="h2" trigger={isInView ? 'mount' : 'hover'} duration={900}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white" />
            <GlitchText text="SOMETHING" as="h2" trigger={isInView ? 'mount' : 'hover'} duration={900} delay={200}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white" />
          </motion.div>

          <motion.p
            className="font-body text-xs sm:text-sm mt-6 max-w-sm mx-auto leading-relaxed"
            style={{ color: 'rgba(120, 115, 140, 0.7)' }}
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            Got an idea? Want to collaborate? Or just passing through? I&apos;m always open to interesting conversations.
          </motion.p>

          <motion.div
            className="mt-8 mx-auto h-px max-w-[80px]"
            style={{ background: 'rgba(120, 110, 160, 0.2)' }}
            initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.8, duration: 1 }}
          />

          {/* Social rows */}
          <div className="mt-10 max-w-md mx-auto text-left">
            <motion.div
              className="mb-5 flex items-center justify-between"
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.85 }}
            >
              <span className="font-mono text-[8px] tracking-[0.4em]"
                style={{ color: 'rgba(100, 95, 120, 0.55)' }}>SOCIALS</span>
              <span className="font-mono text-[8px] tracking-[0.28em]"
                style={{ color: 'rgba(100, 95, 120, 0.35)' }}>CONNECT WITH ME</span>
            </motion.div>

            <div className="space-y-2">
              {SOCIAL_LINKS.map((link, i) => (
                <ContactCard
                  key={link.id}
                  link={link}
                  index={i}
                  scrollProgress={scrollYProgress}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="mt-20 font-mono text-[9px] tracking-[0.28em]"
            style={{ color: 'rgba(90, 86, 108, 0.4)' }}
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            DESIGNED &amp; BUILT BY NIRVAN JAIN / {new Date().getFullYear()}
          </motion.div>

        </div>
      </section>
    </ScrollSection>
  )
}
