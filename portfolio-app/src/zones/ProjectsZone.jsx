import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlitchText from '../components/GlitchText'

const PROJECTS = [
  {
    id: 1,
    title: 'MINDSPACE',
    subtitle: 'Interactive Portfolio',
    description:
      "The experience you're in right now. An experimental, game-like portfolio that breaks every convention of what a website should be.",
    tech: ['React', 'Three.js', 'Framer Motion', 'GSAP'],
    year: '2024',
    status: 'LIVE',
  },
  {
    id: 2,
    title: 'PROJECT ALPHA',
    subtitle: 'Full-Stack Platform',
    description:
      'A comprehensive web platform built for scale. Clean architecture, beautiful interfaces, and rock-solid performance.',
    tech: ['Next.js', 'PostgreSQL', 'Tailwind', 'Prisma'],
    year: '2024',
    status: 'LIVE',
  },
  {
    id: 3,
    title: 'VOID ENGINE',
    subtitle: 'Creative Toolkit',
    description:
      'A collection of creative coding tools and WebGL experiments pushing the boundaries of what browsers can do.',
    tech: ['WebGL', 'GLSL', 'Canvas API', 'Web Audio'],
    year: '2023',
    status: 'BETA',
  },
  {
    id: 4,
    title: 'NEURAL LINK',
    subtitle: 'AI Integration',
    description:
      'An AI-powered development assistant with natural language code generation and intelligent debugging capabilities.',
    tech: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    year: '2023',
    status: 'ARCHIVE',
  },
]

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8
    setTilt({ x, y })
  }

  return (
    <motion.div
      className="relative border border-white/8 p-6 sm:p-8 hover:border-white/25 transition-all duration-500 group"
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.12s ease-out',
      }}
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.12 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onClick={() => setExpanded(!expanded)}
      data-hoverable
    >
      {/* Index number */}
      <div className="absolute top-4 right-4 font-mono text-[9px] text-white/15 tracking-widest">
        [{String(index + 1).padStart(2, '0')}]
      </div>

      {/* Status + Year */}
      <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-white/30 mb-3">
        {project.status} · {project.year}
      </div>

      {/* Title */}
      <GlitchText
        text={project.title}
        className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight"
      />
      <p className="font-body text-xs sm:text-sm text-white/30 mt-1">
        {project.subtitle}
      </p>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body text-xs sm:text-sm text-white/40 mt-4 leading-relaxed">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] sm:text-[10px] tracking-wider px-2.5 py-1 border border-white/10 text-white/40"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click hint */}
      <div className="font-mono text-[8px] text-white/15 mt-4 tracking-[0.2em] group-hover:text-white/30 transition-colors">
        {expanded ? '[ CLICK TO COLLAPSE ]' : '[ CLICK TO EXPAND ]'}
      </div>

      {/* Bottom reveal line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-white origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  )
}

export default function ProjectsZone({ onBack }) {
  return (
    <motion.div
      className="fixed inset-0 overflow-y-auto zone-enter"
      style={{ scrollbarWidth: 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="min-h-screen px-6 sm:px-12 lg:px-20 py-16 sm:py-24 max-w-5xl mx-auto">
        {/* Back */}
        <motion.button
          className="font-mono text-[10px] sm:text-xs text-white/25 hover:text-white transition-colors tracking-[0.2em] mb-10 sm:mb-14"
          onClick={onBack}
          data-hoverable
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ← MAP
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="font-mono text-[8px] sm:text-[9px] text-white/20 tracking-[0.5em] mb-3">
            ZONE_02 // PROJECTS LAB
          </div>
          <GlitchText
            text="THINGS I'VE BUILT"
            as="h1"
            trigger="mount"
            duration={900}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white"
          />
          <p className="font-body text-xs sm:text-sm text-white/25 mt-3 max-w-md">
            A selection of projects that represent my craft. Each one pushed me further.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        <div className="h-16" />
      </div>
    </motion.div>
  )
}
