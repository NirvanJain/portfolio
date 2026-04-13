import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="scroll-line-container">
      <motion.div
        className="scroll-line"
        style={{
          scaleX: useSpring(scrollProgress / 100, {
            damping: 50,
            stiffness: 400,
          }),
        }}
      />
    </div>
  )
}
