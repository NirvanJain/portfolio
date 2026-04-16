import { AnimatePresence, motion } from 'framer-motion'
import { SOCIAL_LINKS } from '../data/socialLinks'

export default function FloatingSocialRail({ docked }) {
  return (
    <AnimatePresence initial={false}>
      {!docked && (
        <motion.aside
          className="fixed left-3 sm:left-6 top-1/2 flex flex-col items-center gap-3"
          style={{ zIndex: 60, y: '-50%' }}
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18, scale: 0.92, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Social links"
        >
          <motion.div
            className="h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-white/5"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          />

          {SOCIAL_LINKS.map((link, index) => (
            <motion.a
              key={link.id}
              layoutId={`social-link-${link.id}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="group relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-[6px] border border-white/10 bg-black/30 text-[9px] sm:text-[10px] font-mono text-white/45 backdrop-blur-md hover:border-white/30 hover:bg-white/[0.04] hover:text-white transition-colors duration-300"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.06, duration: 0.4 }}
              whileHover={{ x: 4 }}
              data-hoverable
            >
              <span>{link.shortLabel}</span>
              <span className="pointer-events-none absolute left-12 hidden whitespace-nowrap rounded-[6px] border border-white/10 bg-black/70 px-2 py-1 text-[8px] tracking-[0.25em] text-white/40 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 sm:block">
                {link.label}
              </span>
            </motion.a>
          ))}

          <motion.div
            className="h-12 w-px bg-gradient-to-b from-white/5 via-white/20 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
