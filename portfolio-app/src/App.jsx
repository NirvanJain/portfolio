import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'

// Components
import CustomCursor from './components/CustomCursor'
import BootSequence from './components/BootSequence'
import Scene3D from './components/Scene3D'
import Terminal from './components/Terminal'
import ThemeToggle from './components/ThemeToggle'
import ScrollLine from './components/ScrollLine'


// Sections
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import ProjectsSection from './sections/ProjectsSection'
import SkillsSection from './sections/SkillsSection'
import ContactSection from './sections/ContactSection'

const NAV_ITEMS = [
  { id: 'hero', label: '01' }, 
  { id: 'about', label: '02' },
  { id: 'projects', label: '03' },
  { id: 'skills', label: '04' },
  { id: 'contact', label: '05' },
]

function FloatingNav({ activeSection, theme }) {
  const isDark = theme === 'dark'
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col items-end gap-4"
      style={{ zIndex: 60 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className="group relative flex items-center justify-center"
          style={{ width: 20, height: 20 }}
          data-hoverable
        >
          {/* Active glow ring */}
          {activeSection === item.id && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: isDark
                  ? 'radial-gradient(circle, rgba(200, 180, 255,0.25) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(60, 40, 80,0.25) 0%, transparent 70%)',
              }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {/* Dot */}
          <div
            className="rounded-full transition-all duration-300"
            style={
              activeSection === item.id
                ? {
                    width: 8,
                    height: 8,
                    background: isDark
                      ? 'radial-gradient(circle at 35% 30%, #fff, rgba(210, 190, 255,0.9) 50%, rgba(160, 140, 220,0.6))'
                      : 'radial-gradient(circle at 35% 30%, #fff, rgba(60, 40, 80,0.9) 50%, rgba(40, 28, 60,0.6))',
                    boxShadow: isDark
                      ? '0 0 4px rgba(200, 180, 255,0.8), 0 0 12px rgba(200, 180, 255,0.3)'
                      : '0 0 4px rgba(60, 40, 80,0.8), 0 0 12px rgba(60, 40, 80,0.3)',
                  }
                : {
                    width: 5,
                    height: 5,
                    background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  }
            }
          />
        </button>
      ))}
    </motion.nav>
  )
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mindspace-theme') || 'dark'
    }
    return 'dark'
  })
  const mainRef = useRef(null)

  // Circle reveal transition state
  const [circleTransition, setCircleTransition] = useState(null) // { x, y, newTheme }

  // ===== APPLY THEME TO DOCUMENT =====
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('mindspace-theme', theme)
  }, [theme])

  const toggleTheme = useCallback((coords) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    if (coords) {
      // Calculate max radius needed to cover entire screen from click point
      const maxX = Math.max(coords.x, window.innerWidth - coords.x)
      const maxY = Math.max(coords.y, window.innerHeight - coords.y)
      const maxRadius = Math.sqrt(maxX * maxX + maxY * maxY)

      setCircleTransition({ x: coords.x, y: coords.y, newTheme, maxRadius })

      // Apply theme halfway through the animation so it feels seamless
      setTimeout(() => {
        setTheme(newTheme)
      }, 400)

      // Remove overlay after animation completes
      setTimeout(() => {
        setCircleTransition(null)
      }, 900)
    } else {
      setTheme(newTheme)
    }
  }, [theme])

  // ===== INTERSECTION OBSERVER FOR ACTIVE SECTION =====
  useEffect(() => {
    if (!booted) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: [0.3, 0.5], rootMargin: '-10% 0px -10% 0px' }
    )

    const sections = document.querySelectorAll('[data-section]')
    sections.forEach((s) => observer.observe(s))

    return () => observer.disconnect()
  }, [booted])

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      if ((e.key === 't' || e.key === 'T') && !terminalOpen) {
        e.preventDefault()
        setTerminalOpen(true)
      }
      if (e.key === 'Escape' && terminalOpen) {
        setTerminalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [terminalOpen])

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  return (
    <div className="relative w-full h-full bg-black text-white">
      {/* Circle reveal transition overlay */}
      {circleTransition && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 9998,
            backgroundColor: circleTransition.newTheme === 'light' ? '#ffffff' : '#000000',
            clipPath: `circle(0px at ${circleTransition.x}px ${circleTransition.y}px)`,
            animation: 'circleReveal 850ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
            '--reveal-x': `${circleTransition.x}px`,
            '--reveal-y': `${circleTransition.y}px`,
            '--reveal-radius': `${circleTransition.maxRadius}px`,
          }}
        />
      )}

      {/* Custom cursor */}
      <CustomCursor />

      {/* Boot sequence */}
      <AnimatePresence>
        {!booted && (
          <BootSequence key="boot" onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      {/* Main experience */}
      {booted && (
        <LayoutGroup id="social-dock">
          {/* 3D Background — fixed behind everything */}
          <Scene3D intensity={0.7} theme={theme} />

          {/* CRT overlays */}
          <div className="scanline-overlay" />
          <div className="noise-bg" />
          <div className="vignette" />

          {/* Scrollable content */}
          <main
            ref={mainRef}
            className="relative h-screen overflow-y-auto overflow-x-hidden scroll-smooth"
            style={{ zIndex: 10, scrollbarWidth: 'none' }}
          >
            <HeroSection scrollContainer={mainRef} />
            <AboutSection scrollContainer={mainRef} />
            <ProjectsSection scrollContainer={mainRef} />
            <SkillsSection scrollContainer={mainRef} />
            <ContactSection scrollContainer={mainRef} />
          </main>



          {/* Floating side navigation */}
          <FloatingNav activeSection={activeSection} theme={theme} />

          {/* Lusion-style scroll progress line */}
          <ScrollLine scrollContainer={mainRef} theme={theme} />

          {/* Theme toggle */}
          <ThemeToggle theme={theme} onToggle={toggleTheme} />

          {/* Terminal shortcut hint */}
          <motion.div
            className="fixed bottom-5 left-6 font-mono text-[9px] text-white/15 tracking-[0.3em] hidden sm:block"
            style={{ zIndex: 60 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            [ T ] TERMINAL
          </motion.div>

          {/* Terminal overlay */}
          <Terminal
            isOpen={terminalOpen}
            onClose={() => setTerminalOpen(false)}
            onNavigate={(section) => {
              setTerminalOpen(false)
              setTimeout(() => {
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
              }, 300)
            }}
          />
        </LayoutGroup>
      )}
    </div>
  )
}
