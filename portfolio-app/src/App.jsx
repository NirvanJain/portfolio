import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Motion, AnimatePresence } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import ParticleBackground from './components/ParticleBackground'
import ThemeToggle from './components/ThemeToggle'
import ScrollProgress from './components/ScrollProgress'
import EntryAnimation from './components/EntryAnimation'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ExperiencePage from './pages/ExperiencePage'

function AppContent() {
  const [showEntry, setShowEntry] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => setShowEntry(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {showEntry ? (
        <EntryAnimation onComplete={() => setShowEntry(false)} />
      ) : (
        <>
          <CustomCursor />
          <ParticleBackground />
          <ScrollProgress />
          <ThemeToggle />

          <main className="relative z-10">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/experience" element={<ExperiencePage />} />
              </Routes>
            </AnimatePresence>
          </main>
        </>
      )}
    </motion.div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
