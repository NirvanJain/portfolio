import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  const btnRef = useRef(null)

  const handleClick = () => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (rect) {
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      onToggle({ x, y })
    } else {
      onToggle(null)
    }
  }

  return (
    <motion.button
      ref={btnRef}
      className="fixed top-6 right-16 sm:top-8 sm:right-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border border-white/20 hover:border-white/50 rounded-full transition-colors duration-300 select-none"
      style={{ zIndex: 9999 }}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.4 }}
      data-hoverable
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.svg
            key="sun"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
