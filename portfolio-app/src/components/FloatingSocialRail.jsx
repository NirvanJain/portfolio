import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { SOCIAL_LINKS } from '../data/socialLinks'

/* ─── SVG icons ───────────────────────────────────────────────── */
const ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 11.6A9.65 9.65 0 0 1 16.5 10" />
      <path d="M8.5 14.5A6.5 6.5 0 0 1 15 13" />
      <path d="M9 17.3A3.5 3.5 0 0 1 13.5 16" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
}

/* ─── Single pill ──────────────────────────────────────────────── */
function SocialPill({ link, index, scrollProgress, isDark }) {
  const [hovered, setHovered] = useState(false)

  // Staggered scroll-exit — each pill peels away slightly later
  const start = 0.74 + index * 0.03
  const end   = 0.90 + index * 0.015

  const rawX       = useTransform(scrollProgress, [start, end], [0, -28])
  const rawOpacity = useTransform(scrollProgress, [start, end], [1, 0])
  const rawScale   = useTransform(scrollProgress, [start, end], [1, 0.72])

  const x       = useSpring(rawX,       { stiffness: 100, damping: 20 })
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 20 })
  const scale   = useSpring(rawScale,   { stiffness: 100, damping: 20 })

  return (
    <motion.a
      layoutId={`social-pill-${link.id}`}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      className="relative flex items-center justify-center"
      style={{ x, opacity, scale, width: 38, height: 38, pointerEvents: 'auto' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 6 }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      data-hoverable
    >
      {/* Deep red aura — blooms on hover, invisible at rest */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="aura"
            className="pointer-events-none absolute"
            style={{
              inset: -16,
              borderRadius: 20,
              background: isDark
                ? 'radial-gradient(circle, rgba(138, 110, 220,0.32) 0%, rgba(100, 80, 180,0.12) 45%, transparent 70%)'
                : 'radial-gradient(circle, rgba(120, 90, 200,0.2) 0%, rgba(80, 60, 160,0.08) 45%, transparent 70%)',
              filter: 'blur(10px)',
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Main tile */}
      <motion.span
        className="relative flex h-full w-full items-center justify-center rounded-[9px] overflow-hidden"
        animate={{
          background: hovered
            ? (isDark ? 'rgba(28, 24, 42, 0.95)' : 'rgba(245, 242, 255, 0.95)')
            : (isDark ? 'rgba(18, 18, 22, 0.88)' : 'rgba(255, 255, 255, 0.9)'),
          borderColor: hovered
            ? (isDark ? 'rgba(138, 110, 220, 0.45)' : 'rgba(120, 90, 200, 0.4)')
            : (isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.1)'),
          boxShadow: hovered
            ? (isDark 
                ? 'inset 0 1px 0 rgba(138,110,220,0.15), 0 0 0 1px rgba(138,110,220,0.12), 0 4px 24px rgba(0,0,0,0.6)'
                : 'inset 0 1px 0 rgba(120,90,200,0.1), 0 0 0 1px rgba(120,90,200,0.15), 0 4px 24px rgba(0,0,0,0.1)')
            : (isDark
                ? 'inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 12px rgba(0,0,0,0.5)'
                : 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 12px rgba(0,0,0,0.06)'),
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* red sheen sweep on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              key="sheen"
              className="pointer-events-none absolute inset-0"
              style={{
                background: isDark
                  ? 'linear-gradient(115deg, transparent 20%, rgba(138,110,220,0.1) 50%, transparent 80%)'
                  : 'linear-gradient(115deg, transparent 20%, rgba(120,90,200,0.08) 50%, transparent 80%)',
                borderRadius: 'inherit',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.span
          animate={{ color: hovered 
            ? (isDark ? 'rgba(210, 200, 255, 0.95)' : 'rgba(90, 60, 180, 0.95)') 
            : (isDark ? 'rgba(120, 115, 140, 0.65)' : 'rgba(80, 75, 100, 0.65)') }}
          transition={{ duration: 0.18 }}
          className="relative z-10"
        >
          {ICONS[link.id]}
        </motion.span>
      </motion.span>

      {/* Tooltip — slides in from left */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="tooltip"
            className="pointer-events-none absolute font-mono whitespace-nowrap hidden sm:flex items-center"
            style={{
              left: 46,
              top: '50%',
              fontSize: 8,
              letterSpacing: '0.28em',
              color: isDark ? 'rgba(190, 180, 230, 0.8)' : 'rgba(90, 60, 180, 0.8)',
              background: isDark ? 'rgba(14, 12, 20, 0.9)' : 'rgba(255, 255, 255, 0.95)',
              border: isDark ? '1px solid rgba(138, 110, 220, 0.2)' : '1px solid rgba(120, 90, 200, 0.2)',
              backdropFilter: 'blur(12px)',
              padding: '4px 11px',
              borderRadius: 7,
              zIndex: 90,
              translateY: '-50%',
            }}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  )
}

/* ─── Rail ─────────────────────────────────────────────────────── */
export default function FloatingSocialRail({ scrollContainer }) {
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

  const rawRailOpacity = useTransform(scrollYProgress, [0.74, 0.91], [1, 0])
  const railOpacity    = useSpring(rawRailOpacity, { stiffness: 80, damping: 22 })

  return (
    <motion.div
      className="fixed left-4 sm:left-6 top-0 bottom-0 flex items-center pointer-events-none"
      style={{ zIndex: 60 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="flex flex-col items-center gap-2"
        style={{ opacity: railOpacity }}
      >
        {/* Top line */}
        <motion.div
          style={{
            width: 1,
            height: 32,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1))',
          }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        />

        {SOCIAL_LINKS.map((link, i) => (
          <SocialPill
            key={link.id}
            link={link}
            index={i}
            scrollProgress={scrollYProgress}
            isDark={isDark}
          />
        ))}

        {/* Bottom line */}
        <motion.div
          style={{
            width: 1,
            height: 32,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
          }}
          initial={{ scaleY: 0, originY: 1 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  )
}
