import { useState } from 'react'
import { motion } from 'framer-motion'
import GlitchText from '../components/GlitchText'

const CATEGORIES = [
  {
    name: 'FRONTEND',
    skills: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 85 },
      { name: 'Next.js', level: 80 },
      { name: 'Three.js', level: 75 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Framer Motion', level: 85 },
    ],
  },
  {
    name: 'BACKEND',
    skills: [
      { name: 'Node.js', level: 80 },
      { name: 'Python', level: 85 },
      { name: 'PostgreSQL', level: 70 },
      { name: 'MongoDB', level: 75 },
      { name: 'GraphQL', level: 65 },
      { name: 'REST APIs', level: 90 },
    ],
  },
  {
    name: 'TOOLS & OTHER',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 65 },
      { name: 'Figma', level: 70 },
      { name: 'Linux', level: 75 },
      { name: 'CI/CD', level: 60 },
      { name: 'WebGL / GLSL', level: 55 },
    ],
  },
]

function SkillBar({ skill, delay }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="group py-1"
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hoverable
    >
      <div className="flex justify-between items-center mb-1.5">
        <span
          className={`font-mono text-[10px] sm:text-xs tracking-wider transition-colors duration-300 ${
            hovered ? 'text-white' : 'text-white/50'
          }`}
        >
          {skill.name}
        </span>
        <motion.span
          className="font-mono text-[9px] sm:text-[10px] text-white/20"
          animate={{ opacity: hovered ? 0.8 : 0.2, color: hovered ? '#fff' : 'rgba(255,255,255,0.2)' }}
          transition={{ duration: 0.2 }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="h-[1px] bg-white/8 relative overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{
            delay: delay + 0.2,
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        {/* Hover highlight overlay */}
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  )
}

export default function SkillsZone({ onBack }) {
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
            ZONE_03 // SKILLS MATRIX
          </div>
          <GlitchText
            text="WHAT I WORK WITH"
            as="h1"
            trigger="mount"
            duration={800}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white"
          />
          <p className="font-body text-xs sm:text-sm text-white/25 mt-3 max-w-md">
            Technologies and tools I&apos;ve mastered through years of building and breaking things.
          </p>
        </motion.div>

        {/* Skill columns */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
          {CATEGORIES.map((cat, ci) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + ci * 0.15 }}
            >
              <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/40 mb-5 pb-2 border-b border-white/8">
                {cat.name}
              </div>
              <div className="space-y-3">
                {cat.skills.map((skill, si) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    delay={0.5 + ci * 0.15 + si * 0.06}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="h-16" />
      </div>
    </motion.div>
  )
}
