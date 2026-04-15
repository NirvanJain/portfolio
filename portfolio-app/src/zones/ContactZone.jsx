import { motion } from 'framer-motion'
import GlitchText from '../components/GlitchText'

const LINKS = [
  {
    label: 'EMAIL',
    value: 'hello@nirvanjain.dev',
    href: 'mailto:hello@nirvanjain.dev',
    icon: '✉',
  },
  {
    label: 'GITHUB',
    value: 'github.com/nirvanjain',
    href: 'https://github.com/nirvanjain',
    icon: '◈',
  },
  {
    label: 'LINKEDIN',
    value: '/in/nirvanjain',
    href: 'https://linkedin.com/in/nirvanjain',
    icon: '◉',
  },
  {
    label: 'TWITTER',
    value: '@nirvanjain',
    href: 'https://twitter.com/nirvanjain',
    icon: '◎',
  },
]

export default function ContactZone({ onBack }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center zone-enter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Back */}
      <motion.button
        className="absolute top-6 left-6 font-mono text-[10px] sm:text-xs text-white/25 hover:text-white transition-colors tracking-[0.2em]"
        style={{ zIndex: 20 }}
        onClick={onBack}
        data-hoverable
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ← MAP
      </motion.button>

      {/* Zone label */}
      <motion.div
        className="absolute top-6 right-6 font-mono text-[8px] sm:text-[9px] text-white/15 tracking-[0.4em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ZONE_04 // CONTACT PORTAL
      </motion.div>

      {/* Content */}
      <div className="text-center px-6 max-w-lg w-full" style={{ zIndex: 10 }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlitchText
            text="LET'S TALK"
            as="h1"
            trigger="mount"
            duration={900}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white"
          />
        </motion.div>

        <motion.p
          className="font-body text-xs sm:text-sm text-white/25 mt-4 max-w-sm mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Got an idea? Want to collaborate? Or just want to say hi?
          I&apos;m always open to interesting conversations.
        </motion.p>

        {/* Divider */}
        <motion.div
          className="mt-8 mx-auto h-px bg-white/8 max-w-[120px]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />

        {/* Links */}
        <div className="mt-8 sm:mt-10 space-y-3 max-w-md mx-auto text-left">
          {LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-3.5 px-5 border border-white/8 hover:border-white/30 hover:bg-white/[0.03] transition-all duration-400 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.12 }}
              data-hoverable
            >
              <div className="flex items-center gap-3.5">
                <span className="text-base sm:text-lg text-white/20 group-hover:text-white/60 transition-colors">
                  {link.icon}
                </span>
                <div>
                  <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-white/20">
                    {link.label}
                  </div>
                  <div className="font-body text-xs sm:text-sm text-white/50 group-hover:text-white transition-colors">
                    {link.value}
                  </div>
                </div>
              </div>
              <motion.span
                className="font-mono text-white/15 group-hover:text-white/50 text-sm transition-colors"
                whileHover={{ x: 3 }}
              >
                →
              </motion.span>
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="mt-14 sm:mt-16 font-mono text-[9px] text-white/10 tracking-[0.3em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          BUILT WITH OBSESSION · {new Date().getFullYear()}
        </motion.div>
      </div>
    </motion.div>
  )
}
