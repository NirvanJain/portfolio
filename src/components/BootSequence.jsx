import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

const BOOT_LINES = [
  { text: '> LOADING MINDSPACE...', delay: 0 },
  { text: '> ESTABLISHING CONNECTION ████████████████ OK', delay: 400 },
  { text: '> SYSTEM READY', delay: 900 },
  { text: '', delay: 1200 },
  { text: 'MINDSPACE', delay: 1400, style: 'title' },
  { text: '', delay: 1800 },
  { text: '[ CLICK OR PRESS ENTER ]', delay: 2000, style: 'prompt' },
]

const bootVariants = {
  hidden: {
    opacity: 0,
    scale: 1.08,
    filter: 'blur(18px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(14px)',
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

const lineVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
      delay,
    },
  }),
}

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([])
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timers = BOOT_LINES.map((line) =>
      setTimeout(() => {
        setLines((prev) => [...prev, line])
        if (line.style === 'prompt') setReady(true)
      }, line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleEnter = useCallback(() => {
    if (!ready || exiting) return
    setExiting(true)
    setTimeout(onComplete, 600)
  }, [ready, exiting, onComplete])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter') handleEnter()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleEnter])

  // Auto-skip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!exiting) {
        setExiting(true)
        setTimeout(onComplete, 600)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [exiting, onComplete])

  const getLineClass = (style) => {
    switch (style) {
      case 'title':
        return 'text-white text-2xl sm:text-4xl font-bold tracking-[0.35em] text-center font-display'
      case 'prompt':
        return 'text-white/50 text-[10px] sm:text-xs tracking-[0.3em] text-center mt-2 animate-pulse'
      default:
        return 'text-white/50 text-[10px] sm:text-xs text-center'
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center select-none overflow-hidden"
      style={{ zIndex: 100 }}
      variants={bootVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={handleEnter}
    >
      <div className="boot-vignette" />
      <div className="boot-grid" />
      <div className="scanline-overlay" />
      <div className="w-full max-w-md px-6 font-mono leading-loose">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            custom={i * 0.12}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            className={getLineClass(line.style)}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
      <div className="noise-bg" />
    </motion.div>
  )
}
