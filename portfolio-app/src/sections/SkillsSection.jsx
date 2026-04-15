import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import GlitchText from '../components/GlitchText'
import ScrollSection from '../components/ScrollSection'

const CATEGORIES = [
  { name: 'FRONTEND', skills: [{ name: 'React', level: 95 }, { name: 'TypeScript', level: 85 }, { name: 'Next.js', level: 80 }, { name: 'Three.js', level: 75 }, { name: 'Tailwind CSS', level: 90 }, { name: 'Framer Motion', level: 85 }] },
  { name: 'BACKEND', skills: [{ name: 'Node.js', level: 80 }, { name: 'Python', level: 85 }, { name: 'PostgreSQL', level: 70 }, { name: 'MongoDB', level: 75 }, { name: 'GraphQL', level: 65 }, { name: 'REST APIs', level: 90 }] },
  { name: 'TOOLS & OTHER', skills: [{ name: 'Git', level: 90 }, { name: 'Docker', level: 65 }, { name: 'Figma', level: 70 }, { name: 'Linux', level: 75 }, { name: 'CI/CD', level: 60 }, { name: 'WebGL / GLSL', level: 55 }] },
]

function SkillBar({ skill, delay, isInView }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div className="py-1.5" initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} data-hoverable>
      <div className="flex justify-between items-center mb-1.5">
        <span className={`font-mono text-[10px] sm:text-xs tracking-wider transition-colors duration-200 ${hovered ? 'text-white' : 'text-white/45'}`}>{skill.name}</span>
        <span className={`font-mono text-[9px] transition-all duration-200 ${hovered ? 'text-white/70' : 'text-white/15'}`}>{skill.level}%</span>
      </div>
      <div className="h-[1px] bg-white/8 relative overflow-hidden">
        <motion.div className="h-full bg-white" initial={{ width: 0 }} animate={isInView ? { width: `${skill.level}%` } : {}} transition={{ delay: delay + 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </motion.div>
  )
}

function CategoryColumn({ cat, catIndex }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: catIndex * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] text-white/35 mb-5 pb-2 border-b border-white/8">{cat.name}</div>
      <div className="space-y-2">
        {cat.skills.map((skill, si) => <SkillBar key={skill.name} skill={skill} delay={catIndex * 0.15 + si * 0.06} isInView={isInView} />)}
      </div>
    </motion.div>
  )
}

export default function SkillsSection({ scrollContainer }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })

  return (
    <ScrollSection scrollContainer={scrollContainer} scaleRange={[0.93, 1, 0.87]} yRange={[90, 0, -60]}>
      <section id="skills" data-section ref={ref} className="relative min-h-screen px-6 sm:px-12 lg:px-20 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto w-full" style={{ zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} className="mb-3">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.5em] text-white/20">03 // SKILLS</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="mb-4">
            <GlitchText text="WHAT I WORK WITH" as="h2" trigger={isInView ? 'mount' : 'hover'} duration={800} className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white" />
          </motion.div>
          <motion.p className="font-body text-xs sm:text-sm text-white/25 max-w-md mb-10 sm:mb-14" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}>
            Technologies I use every day and the tools that power my work.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14">
            {CATEGORIES.map((cat, ci) => <CategoryColumn key={cat.name} cat={cat} catIndex={ci} />)}
          </div>
        </div>
      </section>
    </ScrollSection>
  )
}
