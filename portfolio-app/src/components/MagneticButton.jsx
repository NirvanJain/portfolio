import { useRef, useState } from 'react'
import { Motion } from 'framer-motion'

export default function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 0.35,
  disabled = false,
  ...props
}) {
  const ref = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMove = (e) => {
    if (!ref.current || disabled) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    })
  }

  const handleLeave = () => {
    setOffset({ x: 0, y: 0 })
    setHovered(false)
  }

  const handleEnter = () => {
    setHovered(true)
  }

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden border border-white/20 px-6 py-3 font-mono text-sm tracking-wider text-white transition-colors duration-300 ${
        hovered ? 'bg-white/10 border-white/50' : 'bg-transparent'
      } ${disabled ? 'opacity-30 pointer-events-none' : ''} ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      onClick={onClick}
      animate={{ x: offset.x, y: offset.y }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 15,
        mass: 0.2,
      }}
      whileTap={{ scale: 0.93 }}
      data-hoverable
      {...props}
    >
      <span className="relative z-10">{children}</span>

      {/* Hover sweep effect */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ opacity: 0.06 }}
      />
    </motion.button>
  )
}
