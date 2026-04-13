import { motion } from 'framer-motion'

export default function EntryAnimation({ onComplete }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      onAnimationComplete={onComplete}
    >
      {/* Animated Logo/Name Reveal */}
      <div className="relative">
        {/* Loading line */}
        <motion.div
          className="absolute -bottom-8 left-0 w-0 h-0.5 bg-accent"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
        />

        {/* Main text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Name */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="text-accent">N</span>irvan <span className="text-accent">J</span>ain
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-gray-400 text-lg md:text-xl font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Creative Developer
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="text-gray-500 text-sm mt-4 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Building digital experiences that matter
          </motion.p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-4 -right-4 w-2 h-2 bg-accent rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-3 h-3 bg-accent/50 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 1.4 }}
        />
      </div>

      {/* Fade out overlay */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      />
    </motion.div>
  )
}
