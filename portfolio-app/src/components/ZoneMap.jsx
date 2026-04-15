import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlitchText from './GlitchText'

const ZONES = [
  {
    id: 'void',
    name: 'THE VOID',
    desc: 'Origin Point',
    x: 50,
    y: 42,
    icon: '◉',
  },
  {
    id: 'projects',
    name: 'PROJECTS LAB',
    desc: 'Build Log',
    x: 78,
    y: 32,
    icon: '◈',
  },
  {
    id: 'skills',
    name: 'SKILLS MATRIX',
    desc: 'Capabilities',
    x: 22,
    y: 28,
    icon: '◇',
  },
  {
    id: 'contact',
    name: 'CONTACT PORTAL',
    desc: 'Reach Out',
    x: 50,
    y: 75,
    icon: '◎',
  },
]

const CONNECTIONS = [
  ['void', 'projects'],
  ['void', 'skills'],
  ['void', 'contact'],
  ['projects', 'skills'],
]

export default function ZoneMap({ onSelectZone, discoveredZones = [] }) {
  const [hovered, setHovered] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handle = (e) =>
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  const zoneById = (id) => ZONES.find((z) => z.id === id)
  const isFound = (id) => discoveredZones.includes(id)

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <motion.div
        className="absolute top-8 sm:top-12 text-center"
        style={{ zIndex: 10 }}
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <GlitchText
          text="MINDSPACE"
          as="h1"
          trigger="mount"
          duration={1200}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-[0.25em] text-white"
        />
        <motion.p
          className="font-mono text-[9px] sm:text-[10px] text-white/25 mt-3 tracking-[0.5em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          SELECT A ZONE TO EXPLORE
        </motion.p>
      </motion.div>

      {/* Subtle parallax grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '70px 70px',
          transform: `translate(${(mousePos.x - 50) * 0.08}px, ${(mousePos.y - 50) * 0.06}px)`,
          transition: 'transform 0.6s ease-out',
        }}
      />

      {/* Connection lines (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {CONNECTIONS.map(([from, to], i) => {
          const a = zoneById(from)
          const b = zoneById(to)
          if (!a || !b) return null
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke="white"
              strokeOpacity={0.06}
              strokeWidth={1}
              strokeDasharray="4 10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.6 + i * 0.2 }}
            />
          )
        })}
      </svg>

      {/* Zone nodes */}
      {ZONES.map((zone, i) => (
        <motion.div
          key={zone.id}
          className="absolute flex flex-col items-center gap-2 select-none"
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.9 + i * 0.15,
            type: 'spring',
            stiffness: 200,
            damping: 18,
          }}
          onMouseEnter={() => setHovered(zone.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Node circle */}
          <motion.button
            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[1.5px] flex items-center justify-center font-mono text-xl transition-all duration-300 ${
              hovered === zone.id
                ? 'border-white bg-white/10 text-white shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                : isFound(zone.id)
                  ? 'border-white/30 text-white/50'
                  : 'border-white/12 text-white/25'
            }`}
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelectZone(zone.id)}
            data-hoverable
          >
            {zone.icon}

            {/* Pulse ring animation */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/15"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.2, 0, 0.2],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: i * 0.6,
                ease: 'easeOut',
              }}
            />

            {/* Secondary pulse */}
            <motion.div
              className="absolute inset-0 rounded-full border border-white/8"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.1, 0, 0.1],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                delay: i * 0.6 + 0.5,
                ease: 'easeOut',
              }}
            />

            {/* Discovered indicator dot */}
            {isFound(zone.id) && (
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              />
            )}
          </motion.button>

          {/* Label */}
          <motion.div
            className="text-center"
            animate={{ opacity: hovered === zone.id ? 1 : 0.45 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white font-bold whitespace-nowrap">
              {zone.name}
            </div>
            <div className="font-mono text-[7px] sm:text-[8px] tracking-wider text-white/25 mt-0.5">
              {zone.desc}
            </div>
          </motion.div>

          {/* Hover tooltip */}
          <AnimatePresence>
            {hovered === zone.id && (
              <motion.div
                className="absolute top-full mt-10 font-mono text-[10px] text-white/40 whitespace-nowrap tracking-widest"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                [ CLICK TO ENTER ]
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Bottom hint bar */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 text-center font-mono text-[9px] sm:text-[10px] text-white/15 tracking-[0.3em]"
        style={{ zIndex: 10 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <span className="inline-flex items-center gap-3 sm:gap-5">
          <span>[ T ] TERMINAL</span>
          <span className="text-white/8">·</span>
          <span>[ ESC ] BACK</span>
          <span className="text-white/8">·</span>
          <span>[ M ] MAP</span>
        </span>
      </motion.div>

      {/* Corner decoration */}
      <div className="absolute top-5 left-5 w-6 h-6 border-l border-t border-white/10 pointer-events-none" />
      <div className="absolute top-5 right-5 w-6 h-6 border-r border-t border-white/10 pointer-events-none" />
      <div className="absolute bottom-5 left-5 w-6 h-6 border-l border-b border-white/10 pointer-events-none" />
      <div className="absolute bottom-5 right-5 w-6 h-6 border-r border-b border-white/10 pointer-events-none" />
    </motion.div>
  )
}
