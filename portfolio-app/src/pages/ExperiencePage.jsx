import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Briefcase, Calendar, MapPin } from 'lucide-react'

const experiences = [
  {
    id: 1,
    role: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    period: '2024 — Present',
    description: 'Leading frontend architecture and mentoring junior developers. Built scalable solutions serving millions of users.',
    achievements: [
      'Reduced page load time by 40% through optimization',
      'Led migration to React 18 with zero downtime',
      'Mentored 5 junior developers to promotion',
    ],
    icon: '🚀',
  },
  {
    id: 2,
    role: 'Full Stack Developer',
    company: 'Startup Inc',
    location: 'New York, NY',
    period: '2022 — 2024',
    description: 'Developed and maintained multiple client projects using modern web technologies.',
    achievements: [
      'Built 15+ client projects from scratch',
      'Implemented CI/CD pipelines reducing deploy time by 60%',
      'Integrated payment systems processing $1M+ monthly',
    ],
    icon: '💻',
  },
  {
    id: 3,
    role: 'Frontend Developer',
    company: 'Digital Agency',
    location: 'Remote',
    period: '2020 — 2022',
    description: 'Created responsive and interactive web applications for various clients.',
    achievements: [
      'Developed component library used across 20+ projects',
      'Improved accessibility scores to 95+ across all projects',
      'Collaborated with design team on UX improvements',
    ],
    icon: '🎨',
  },
  {
    id: 4,
    role: 'Junior Developer',
    company: 'Web Studio',
    location: 'London, UK',
    period: '2019 — 2020',
    description: 'Started professional career building websites and learning industry best practices.',
    achievements: [
      'Built 30+ WordPress sites for small businesses',
      'Learned React, Node.js, and modern development practices',
      'Received Employee of the Month award twice',
    ],
    icon: '🌱',
  },
]

const skills = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'Tailwind CSS', 'Three.js', 'GSAP'] },
  { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'] },
  { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Figma', 'VS Code'] },
  { category: 'Other', items: ['UI/UX Design', 'Agile', 'Code Review', 'Mentoring'] },
]

export default function ExperiencePage() {
  return (
    <div className="min-h-screen py-20 px-6">
      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/">
          <motion.button
            className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors mb-8"
            whileHover={{ x: -5 }}
            data-hover
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>
        </Link>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          My <span className="text-accent">Journey</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          A timeline of my professional growth and the amazing teams I've had the
          privilege to work with.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} experience={exp} index={index} />
          ))}
        </motion.div>
      </div>

      {/* Skills Section */}
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Skills & Technologies
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup, index) => (
            <SkillCard key={skillGroup.category} group={skillGroup} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ExperienceCard({ experience, index }) {
  return (
    <motion.div
      className="relative pl-8 md:pl-12 pb-12 border-l-2 border-gray-800 dark:border-gray-200 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 bg-accent rounded-full"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
      />

      {/* Content */}
      <div className="p-6 border border-gray-800 dark:border-gray-200 rounded-2xl hover:border-accent/50 transition-colors">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{experience.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {experience.role}
              </h3>
            </div>
            <p className="text-accent font-medium">{experience.company}</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              {experience.period}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" />
              {experience.location}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-4">{experience.description}</p>

        {/* Achievements */}
        <ul className="space-y-2">
          {experience.achievements.map((achievement, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2 text-gray-600 dark:text-gray-500 text-sm"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + i * 0.1 + 0.3 }}
            >
              <span className="text-accent mt-1">•</span>
              {achievement}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function SkillCard({ group, index }) {
  return (
    <motion.div
      className="p-6 border border-gray-800 dark:border-gray-200 rounded-2xl hover:border-accent/50 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      data-hover
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {group.category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {group.items.map((skill) => (
          <span
            key={skill}
            className="text-sm px-3 py-1.5 bg-gray-800 dark:bg-gray-100 text-gray-400 dark:text-gray-600 rounded-full hover:text-accent dark:hover:text-accent transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
