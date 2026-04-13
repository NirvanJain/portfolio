import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, X } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with real-time inventory management and AI-powered recommendations.',
    longDescription: 'Built a comprehensive e-commerce platform featuring real-time inventory tracking, AI-powered product recommendations, and seamless payment integration. The platform handles thousands of transactions daily with 99.9% uptime.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: '🛒',
    gradient: 'from-orange-500/20 to-red-500/20',
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2025',
  },
  {
    id: 2,
    title: 'AI Dashboard',
    description: 'Analytics dashboard powered by machine learning for predictive business insights.',
    longDescription: 'Developed an AI-powered analytics dashboard that provides predictive insights for business decision-making. Features include real-time data visualization, automated reporting, and custom ML models.',
    tags: ['Python', 'TensorFlow', 'React', 'D3.js'],
    image: '📊',
    gradient: 'from-blue-500/20 to-purple-500/20',
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2025',
  },
  {
    id: 3,
    title: '3D Portfolio Experience',
    description: 'Immersive 3D web experience showcasing creative work with WebGL interactions.',
    longDescription: 'Created an immersive 3D portfolio experience using WebGL and Three.js. Features smooth camera transitions, interactive 3D objects, and physics-based animations that respond to user input.',
    tags: ['Three.js', 'WebGL', 'React', 'GSAP'],
    image: '🎨',
    gradient: 'from-green-500/20 to-emerald-500/20',
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2024',
  },
  {
    id: 4,
    title: 'Real-time Collaboration Tool',
    description: 'Team collaboration platform with live editing and video conferencing integration.',
    longDescription: 'Built a real-time collaboration tool featuring live document editing, integrated video conferencing, and team management features. Supports up to 100 concurrent users per workspace.',
    tags: ['TypeScript', 'WebRTC', 'Socket.io', 'PostgreSQL'],
    image: '👥',
    gradient: 'from-pink-500/20 to-rose-500/20',
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2024',
  },
  {
    id: 5,
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication and instant transfers.',
    longDescription: 'Designed and developed a secure mobile banking application featuring biometric authentication, instant peer-to-peer transfers, and comprehensive transaction history with smart categorization.',
    tags: ['React Native', 'Node.js', 'PostgreSQL', 'Plaid'],
    image: '📱',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    github: 'https://github.com',
    year: '2024',
  },
  {
    id: 6,
    title: 'Smart Home Dashboard',
    description: 'IoT control center for managing smart home devices with automation rules.',
    longDescription: 'Created a comprehensive smart home dashboard that integrates with various IoT devices. Features include automation rules, energy monitoring, and voice control integration.',
    tags: ['Vue.js', 'MQTT', 'Python', 'Home Assistant'],
    image: '🏠',
    gradient: 'from-amber-500/20 to-orange-500/20',
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2023',
  },
]

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <div className="min-h-screen py-20 px-6">
      {/* Header */}
      <motion.div
        className="max-w-6xl mx-auto mb-16"
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
          Selected <span className="text-accent">Work</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          A curated collection of projects that showcase my passion for building
          exceptional digital experiences.
        </p>
      </motion.div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ProjectCard({ project, index, onClick }) {
  return (
    <motion.div
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      data-hover
    >
      <div className="relative h-full p-6 border border-gray-800 dark:border-gray-200 rounded-2xl hover:border-accent transition-colors overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className="text-4xl mb-4"
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            {project.image}
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-gray-800 dark:bg-gray-100 text-gray-400 dark:text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Year */}
          <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {project.year}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-hover
    >
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 dark:bg-gray-100 rounded-2xl border border-gray-800 dark:border-gray-300"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
          data-hover
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <motion.div
            className="text-5xl mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {project.image}
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {project.title}
          </h2>

          {/* Description */}
          <p className="text-gray-400 dark:text-gray-600 mb-6 leading-relaxed">
            {project.longDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1.5 bg-gray-800 dark:bg-gray-200 text-gray-300 dark:text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                data-hover
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-700 dark:border-gray-400 text-gray-300 dark:text-gray-700 rounded-lg hover:border-accent hover:text-accent transition-colors"
                data-hover
              >
                <Github className="w-4 h-4" />
                Source Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
