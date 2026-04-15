import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

const BOOT_LINES = [
  { text: '> LOADING MINDSPACE...', delay: 0 },
  { text: '> ESTABLISHING CONNECTION ████████████████ OK', delay: 400 },
  { text: '> SYSTEM READY', delay: 900 },
  { text: '', delay: 1200 },
  { text: 'M I N D S P A C E', delay: 1400, style: 'title' },
  { text: '', delay: 1800 },
  { text: '[ CLICK OR PRESS ENTER ]', delay: 2000, style: 'prompt' },
]

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
        return 'text-white text-xl sm:text-3xl font-bold tracking-[0.5em] text-center font-display'
      case 'prompt':
        return 'text-white/50 text-[10px] sm:text-xs tracking-[0.3em] text-center mt-2 animate-pulse'
      default:
        return 'text-white/50 text-[10px] sm:text-xs'
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center select-none"
      style={{ zIndex: 100 }}
      onClick={handleEnter}
      animate={
        exiting
          ? { opacity: 0, filter: 'blur(12px)' }
          : { opacity: 1, filter: 'blur(0px)' }
      }
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="scanline-overlay" />
      <div className="w-full max-w-md px-6 font-mono leading-loose">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
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
