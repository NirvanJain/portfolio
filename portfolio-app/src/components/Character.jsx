import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Character({ visible = true }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isIdle, setIsIdle] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const idleTimer = useRef(null)

  // Track mouse for eye direction + idle detection
  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setIsIdle(false)
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setIsIdle(true), 4000)
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      clearTimeout(idleTimer.current)
    }
  }, [])

  // Calculate tilt toward cursor
  const getTilt = () => {
    if (!containerRef.current) return 0
    const rect = containerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const dx = (mousePos.x - cx) / window.innerWidth
    return dx * -6
  }

  if (!visible) return null

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 select-none"
      style={{ zIndex: 50 }}
      initial={{ opacity: 0, y: 60, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.7 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-hoverable
    >
      {/* Speech bubble on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 font-mono text-[10px] sm:text-xs whitespace-nowrap tracking-wide"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            Hey! Explore around!
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character container */}
      <motion.div
        className="relative w-28 h-32 sm:w-32 sm:h-36"
        animate={{
          y: [0, -5, 0],
          rotate: isHovered ? [0, -2, 2, 0] : getTilt(),
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          rotate: isHovered
            ? { duration: 0.5, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 50, damping: 20 },
        }}
      >
        {/* Character image */}
        <motion.img
          src="/character-idle.png"
          alt="Developer companion character"
          className="w-full h-full object-contain"
          style={{
            filter: 'brightness(1.1) contrast(1.15) drop-shadow(0 0 20px rgba(255,255,255,0.1))',
          }}
          animate={{
            scale: isHovered ? 1.06 : [1, 1.012, 1],
          }}
          transition={{
            scale: isHovered
              ? { duration: 0.3, ease: 'easeOut' }
              : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          draggable={false}
        />

        {/* Laptop screen glow */}
        <motion.div
          className="absolute bottom-[32%] left-[28%] w-[40%] h-[12%] rounded-sm bg-white/15 blur-md pointer-events-none"
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Wave emoji on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -right-3 top-[20%] text-base sm:text-lg pointer-events-none"
              initial={{ opacity: 0, x: -8, rotate: 0 }}
              animate={{
                opacity: 1,
                x: 0,
                rotate: [0, 20, -12, 20, -5, 0],
              }}
              exit={{ opacity: 0, x: -5 }}
              transition={{
                rotate: { duration: 0.9, ease: 'easeInOut' },
                opacity: { duration: 0.2 },
              }}
            >
              👋
            </motion.div>
          )}
        </AnimatePresence>

        {/* Typing dots when idle */}
        {isIdle && !isHovered && (
          <motion.div
            className="absolute bottom-[28%] left-[42%] flex gap-[3px] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-[3px] h-[3px] bg-white/30 rounded-full"
                animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -2, 0] }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Status label */}
      <motion.div
        className="text-center mt-1 font-mono text-[8px] sm:text-[9px] tracking-[0.25em] select-none"
        animate={{
          color: isHovered
            ? 'rgba(255,255,255,0.6)'
            : 'rgba(255,255,255,0.2)',
        }}
      >
        {isHovered ? 'HELLO THERE' : isIdle ? 'CODING...' : 'OBSERVING'}
      </motion.div>
    </motion.div>
  )
}
