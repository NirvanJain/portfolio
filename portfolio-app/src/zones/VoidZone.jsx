import { useState } from 'react'
import { motion } from 'framer-motion'
import GlitchText from '../components/GlitchText'
import MagneticButton from '../components/MagneticButton'

export default function VoidZone({ onBack, onNavigate }) {
  const [secretFound, setSecretFound] = useState(false)

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden zone-enter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Back button */}
      <motion.button
        className="absolute top-6 left-6 font-mono text-[10px] sm:text-xs text-white/25 hover:text-white transition-colors tracking-[0.2em]"
        style={{ zIndex: 20 }}
        onClick={onBack}
        data-hoverable
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ← MAP
      </motion.button>

      {/* Zone label */}
      <motion.div
        className="absolute top-6 right-6 font-mono text-[8px] sm:text-[9px] text-white/15 tracking-[0.4em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        ZONE_01 // THE VOID
      </motion.div>

      {/* Main content */}
      <div className="relative text-center px-6 max-w-4xl w-full" style={{ zIndex: 10 }}>
        {/* Name reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlitchText
            text="NIRVAN JAIN"
            as="h1"
            trigger="mount"
            duration={1400}
            delay={600}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-display font-bold tracking-tight text-white leading-[0.9]"
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="mt-6 sm:mt-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <p className="font-display text-lg sm:text-xl md:text-2xl text-white/40 font-light tracking-wider">
            I build things that feel different.
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          className="mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <p className="font-body text-xs sm:text-sm text-white/25 max-w-lg mx-auto leading-relaxed">
            Full-stack developer & creative technologist. I obsess over details,
            push boundaries, and craft digital experiences that make you feel
            something. This isn&apos;t a portfolio — it&apos;s a piece of my mind.
          </p>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          className="mt-8 sm:mt-10 mx-auto h-px bg-white/8 max-w-[200px]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Stats row */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-8 sm:gap-14"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 }}
        >
          {[
            { label: 'YEARS', value: '3+' },
            { label: 'PROJECTS', value: '15+' },
            { label: 'COFFEES', value: '∞' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              data-hoverable
              whileHover={{ scale: 1.05 }}
            >
              <div className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-white transition-colors">
                <GlitchText text={stat.value} trigger="hover" duration={300} />
              </div>
              <div className="font-mono text-[8px] sm:text-[9px] text-white/20 tracking-[0.25em] mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          <MagneticButton onClick={() => onNavigate('projects')}>
            EXPLORE PROJECTS →
          </MagneticButton>
          <MagneticButton onClick={() => onNavigate('contact')}>
            SAY HELLO
          </MagneticButton>
        </motion.div>
      </div>

      {/* Secret clickable zone - bottom right corner */}
      <div
        className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center transition-opacity duration-700"
        style={{ opacity: secretFound ? 1 : 0, zIndex: 20 }}
      >
        <span className="font-mono text-[8px] text-white/30">
          {secretFound ? '🎉 Found!' : ''}
        </span>
      </div>
      <div
        className="absolute bottom-3 right-3 w-10 h-10 opacity-0 hover:opacity-[0.02] transition-opacity"
        style={{ zIndex: 21 }}
        onClick={() => setSecretFound(true)}
        title=""
      />

      {/* Subtle decorative circles */}
      <motion.div
        className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full border border-white/[0.02] pointer-events-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 2, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full border border-white/[0.015] pointer-events-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 2, ease: 'easeOut' }}
      />
    </motion.div>
  )
}
