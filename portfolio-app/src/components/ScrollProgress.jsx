import { useEffect } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const scaleX = useSpring(0, {
    damping: 50,
    stiffness: 400,
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const val = docHeight > 0 ? scrollTop / docHeight : 0
      scaleX.set(val)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [scaleX])

  return (
    <div className="scroll-line-container">
      <motion.div
        className="scroll-line"
        style={{ scaleX }}
      />
    </div>
  )
}
