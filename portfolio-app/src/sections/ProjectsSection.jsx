import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import GlitchText from '../components/GlitchText'
import ScrollSection from '../components/ScrollSection'

const PROJECTS = [
  {
    id: 1, title: 'MINDSPACE', subtitle: 'Interactive Portfolio',
    description: "The experience you're in right now. An experimental, game-like portfolio that pushes what a website can feel like.",
    tech: ['React', 'Three.js', 'Framer Motion', 'Tailwind'], year: '2024', status: 'LIVE',
  },
  {
    id: 2, title: 'PROJECT ALPHA', subtitle: 'Full-Stack Platform',
    description: 'A comprehensive web platform built for scale. Handles thousands of users with clean architecture and beautiful interfaces.',
    tech: ['Next.js', 'PostgreSQL', 'Tailwind', 'Prisma'], year: '2024', status: 'LIVE',
  },
  {
    id: 3, title: 'VOID ENGINE', subtitle: 'Creative Toolkit',
    description: 'A collection of creative coding tools and WebGL experiments. Shader playgrounds, particle systems, and generative art.',
    tech: ['WebGL', 'GLSL', 'Canvas API', 'Web Audio'], year: '2023', status: 'BETA',
  },
  {
    id: 4, title: 'NEURAL LINK', subtitle: 'AI Integration',
    description: 'An AI-powered development assistant. Natural language code generation, intelligent debugging, and context-aware suggestions.',
    tech: ['Python', 'TensorFlow', 'FastAPI', 'React'], year: '2023', status: 'ARCHIVE',
  },
]

function ProjectCard({ project, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-80px' })

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTilt({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 6,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * -6,
    })
  }

  return (
    <motion.div
      ref={ref}
      className="relative border border-white/8 hover:border-white/20 transition-all duration-500 group overflow-hidden"
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: 'transform 0.12s ease-out, border-color 0.5s',
      }}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      data-hoverable
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-white/25">{project.status} · {project.year}</span>
          <span className="font-mono text-[9px] text-white/10 tracking-widest">[{String(index + 1).padStart(2, '0')}]</span>
        </div>
        <GlitchText text={project.title} className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight" />
        <p className="font-body text-xs sm:text-sm text-white/30 mt-1.5">{project.subtitle}</p>
        <p className="font-body text-xs sm:text-sm text-white/40 mt-4 leading-relaxed">{project.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="font-mono text-[9px] tracking-wider px-2.5 py-1 border border-white/8 text-white/35 hover:text-white/60 hover:border-white/20 transition-all duration-300">{t}</span>
          ))}
        </div>
      </div>
      <motion.div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white origin-left" initial={{ scaleX: 0 }} whileHover={{ scaleX: 1 }} transition={{ duration: 0.6 }} />
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-700 pointer-events-none" />
    </motion.div>
  )
}

export default function ProjectsSection({ scrollContainer }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <ScrollSection scrollContainer={scrollContainer} scaleRange={[0.9, 1, 0.85]} yRange={[100, 0, -70]}>
      <section id="projects" data-section ref={ref} className="relative min-h-screen px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto w-full" style={{ zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} className="mb-3">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.5em] text-white/20">02 // PROJECTS</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="mb-4">
            <GlitchText text="THINGS I'VE BUILT" as="h2" trigger={isInView ? 'mount' : 'hover'} duration={800} className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white" />
          </motion.div>
          <motion.p className="font-body text-xs sm:text-sm text-white/25 max-w-md mb-10 sm:mb-14" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}>
            Each project pushed me to learn something new. Here are the ones I&apos;m most proud of.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        </div>
      </section>
    </ScrollSection>
  )
}
