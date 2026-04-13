import { Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Linkedin, Twitter, Spotify } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20 relative">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-left"
            >
              <motion.p
                className="text-accent font-mono text-sm mb-4 tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                HELLO, I'M
              </motion.p>

              <motion.h1
                className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Nirvan <span className="text-accent">Jain</span>
              </motion.h1>

              <motion.p
                className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mb-8 max-w-md leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                A creative developer crafting digital experiences that blend art with technology.
                Specializing in building exceptional products.
              </motion.p>

              {/* Social Links */}
              <motion.div
                className="flex gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <SocialLink
                  href="https://github.com/nirvanjain"
                  icon={<Github className="w-5 h-5" />}
                  label="GitHub"
                  delay={0.7}
                />
                <SocialLink
                  href="https://linkedin.com/in/nirvanjain"
                  icon={<Linkedin className="w-5 h-5" />}
                  label="LinkedIn"
                  delay={0.75}
                />
                <SocialLink
                  href="https://twitter.com/nirvanjain"
                  icon={<Twitter className="w-5 h-5" />}
                  label="Twitter"
                  delay={0.8}
                />
                <SocialLink
                  href="https://spotify.com/user/nirvanjain"
                  icon={<Spotify className="w-5 h-5" />}
                  label="Spotify"
                  delay={0.85}
                />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Link to="/projects">
                  <motion.button
                    className="px-6 py-3 bg-accent text-white font-medium rounded-lg flex items-center gap-2 hover:bg-accent-hover transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-hover
                  >
                    View My Work
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link to="/experience">
                  <motion.button
                    className="px-6 py-3 border border-gray-700 dark:border-gray-300 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:border-accent hover:text-accent transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-hover
                  >
                    Experience
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center md:justify-end"
            >
              <motion.div
                className="relative w-64 h-64 md:w-80 md:h-80"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative border */}
                <motion.div
                  className="absolute inset-0 border-2 border-accent/30 rounded-2xl"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Profile image container */}
                <div className="absolute inset-4 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-blue-500/20 flex items-center justify-center">
                    <span className="text-6xl md:text-7xl">👨‍💻</span>
                  </div>
                </div>

                {/* Floating accent dots */}
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-2 -left-2 w-3 h-3 bg-accent/50 rounded-full"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2"
          >
            <motion.div
              className="w-1 h-2 bg-accent rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
          <span className="text-xs text-gray-500 font-mono">SCROLL</span>
        </motion.div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/projects">
              <motion.div
                className="p-8 border border-gray-800 dark:border-gray-200 rounded-2xl hover:border-accent transition-colors group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                data-hover
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">📁</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Projects
                </h3>
                <p className="text-gray-500 text-sm">
                  A collection of my recent work and side projects
                </p>
              </motion.div>
            </Link>

            <Link to="/experience">
              <motion.div
                className="p-8 border border-gray-800 dark:border-gray-200 rounded-2xl hover:border-accent transition-colors group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                data-hover
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">💼</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Experience
                </h3>
                <p className="text-gray-500 text-sm">
                  My professional journey and career path
                </p>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </div>
  )
}

function SocialLink({ href, icon, label, delay }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 border border-gray-700 dark:border-gray-300 rounded-lg text-gray-400 hover:text-accent hover:border-accent transition-colors"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      data-hover
      aria-label={label}
    >
      {icon}
    </motion.a>
  )
}

function ContactSection() {
  return (
    <section className="py-20 px-6 border-t border-gray-800 dark:border-gray-200">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Let's Work Together
        </motion.h2>
        <motion.p
          className="text-gray-500 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Have a project in mind? Let's create something amazing.
        </motion.p>

        <motion.form
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={(e) => {
            e.preventDefault()
            alert('Thanks for reaching out! This is a demo form.')
          }}
        >
          <motion.input
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-gray-900 dark:bg-gray-100 border border-gray-800 dark:border-gray-300 rounded-lg text-gray-900 dark:text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
            whileFocus={{ scale: 1.01 }}
            required
            data-hover
          />
          <motion.textarea
            placeholder="Tell me about your project..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-900 dark:bg-gray-100 border border-gray-800 dark:border-gray-300 rounded-lg text-gray-900 dark:text-gray-900 placeholder-gray-500 focus:outline-none focus:border-accent transition-colors resize-none"
            required
            data-hover
          />
          <motion.button
            type="submit"
            className="px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-hover
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}
