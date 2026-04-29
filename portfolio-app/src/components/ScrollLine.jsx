import React from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

/**
 * 3D scroll progress line with floating geometric elements at section markers.
 */

// 3D rotating shapes at section boundaries
function FloatingShape({ top, type = 'diamond', delay = 0, progress }) {
  const rotation = useTransform(progress, [0, 1], [0, 720])
  const glow = useTransform(progress, (v) => {
    const dist = Math.abs(v - top / 100)
    return dist < 0.12 ? 1 : 0.2
  })

  const shapes = {
    diamond: (
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: `${top}%`,
          width: 8,
          height: 8,
          rotateZ: rotation,
          opacity: glow,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(200,180,255,0.4))',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            boxShadow: '0 0 8px rgba(200,180,255,0.3)',
          }}
        />
      </motion.div>
    ),
    cube: (
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: `${top}%`,
          width: 7,
          height: 7,
          rotateZ: rotation,
          rotateX: useTransform(progress, [0, 1], [0, 360]),
          opacity: glow,
          perspective: 100,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(180,200,255,0.3))',
            borderRadius: 1,
            boxShadow: '0 0 10px rgba(180,200,255,0.25), inset 0 0 3px rgba(255,255,255,0.3)',
          }}
        />
      </motion.div>
    ),
    circle: (
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: `${top}%`,
          opacity: glow,
        }}
      >
        <motion.div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(200,180,255,0.3))',
            boxShadow: '0 0 8px rgba(200,180,255,0.3), 0 0 20px rgba(200,180,255,0.1)',
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay }}
        />
      </motion.div>
    ),
    triangle: (
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: '50%',
          top: `${top}%`,
          width: 8,
          height: 8,
          rotateZ: useTransform(progress, [0, 1], [0, -540]),
          opacity: glow,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(180,220,255,0.35))',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />
      </motion.div>
    ),
  }

  return shapes[type] || null
}

export default function ScrollLine({ scrollContainer }) {
  const { scrollYProgress } = useScroll({ container: scrollContainer })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  })

  const height = useTransform(smooth, [0, 1], ['0%', '100%'])
  const top = useTransform(smooth, [0, 1], ['0%', '100%'])

  return (
    <div
      className="fixed left-6 sm:left-8 top-0 bottom-0 pointer-events-none"
      style={{ zIndex: 40, width: 6 }}
    >
      {/* 3D Track — layered for depth */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          width: 2,
          left: 2,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%)',
          boxShadow: '1px 0 4px rgba(0,0,0,0.3), -1px 0 4px rgba(0,0,0,0.3)',
        }}
      />

      {/* Fill — 3D tube effect with highlight */}
      <motion.div
        className="absolute top-0 rounded-full origin-top"
        style={{
          width: 3,
          left: 1.5,
          height,
          background: 'linear-gradient(90deg, rgba(180,160,255,0.15) 0%, rgba(220,210,255,0.7) 40%, rgba(255,255,255,0.9) 50%, rgba(220,210,255,0.7) 60%, rgba(180,160,255,0.15) 100%)',
          boxShadow: '0 0 6px rgba(200,180,255,0.3), 0 0 14px rgba(200,180,255,0.15), 0 0 30px rgba(200,180,255,0.08)',
        }}
      />

      {/* Glowing 3D node at scroll position */}
      <motion.div
        className="absolute"
        style={{
          top,
          left: -3,
          width: 12,
          height: 12,
        }}
      >
        {/* Outer bloom */}
        <motion.div
          className="absolute inset-0 rounded-full -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(200,180,255,0.3) 0%, transparent 70%)',
            width: 30,
            height: 30,
            left: -9,
            top: '50%',
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* 3D sphere node */}
        <motion.div
          className="absolute rounded-full -translate-y-1/2"
          style={{
            width: 7,
            height: 7,
            left: 2.5,
            top: '50%',
            background: 'radial-gradient(circle at 35% 30%, #fff 0%, rgba(210,190,255,0.9) 40%, rgba(160,140,220,0.6) 100%)',
            boxShadow: '0 0 4px rgba(200,180,255,0.8), 0 0 10px rgba(200,180,255,0.4), 0 0 25px rgba(200,180,255,0.2), 0 1px 2px rgba(0,0,0,0.3)',
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      {/* 3D geometric shapes at section boundaries */}
      <FloatingShape top={0} type="diamond" progress={smooth} />
      <FloatingShape top={20} type="circle" delay={0.3} progress={smooth} />
      <FloatingShape top={40} type="cube" progress={smooth} />
      <FloatingShape top={60} type="triangle" delay={0.6} progress={smooth} />
      <FloatingShape top={80} type="diamond" progress={smooth} />
      <FloatingShape top={100} type="circle" delay={0.9} progress={smooth} />
    </div>
  )
}
