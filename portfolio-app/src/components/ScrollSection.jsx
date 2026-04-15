import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Lusion.co-inspired scroll wrapper.
 * As the section scrolls into view from below: scales up, fades in, slides up.
 * While in view: fully visible.
 * As it scrolls out above: scales down, fades, blurs — depth effect.
 */
export default function ScrollSection({
  children,
  scrollContainer,
  className = '',
  style = {},
  // Customize the intensity of effects
  scaleRange = [0.92, 1, 0.88],
  opacityRange = [0, 1, 0],
  yRange = [80, 0, -60],
  blurRange = [6, 0, 10],
  // For hero-like sections that should only shrink when leaving
  entryOnly = false,
}) {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ['start end', 'end start'],
  })

  // Map scroll progress: 0 = entering from bottom, 0.5 = centered, 1 = exiting top
  const scale = useTransform(
    scrollYProgress,
    entryOnly ? [0, 0.3, 0.7, 1] : [0, 0.25, 0.75, 1],
    entryOnly
      ? [1, 1, 1, scaleRange[2]]
      : [scaleRange[0], scaleRange[1], scaleRange[1], scaleRange[2]]
  )

  const opacity = useTransform(
    scrollYProgress,
    entryOnly ? [0, 0.1, 0.7, 1] : [0, 0.15, 0.8, 1],
    entryOnly
      ? [1, 1, 1, opacityRange[2]]
      : [opacityRange[0], opacityRange[1], opacityRange[1], opacityRange[2]]
  )

  const y = useTransform(
    scrollYProgress,
    entryOnly ? [0, 0.2, 0.7, 1] : [0, 0.2, 0.75, 1],
    entryOnly
      ? [0, 0, 0, yRange[2]]
      : [yRange[0], yRange[1], yRange[1], yRange[2]]
  )

  const blurValue = useTransform(
    scrollYProgress,
    entryOnly ? [0, 0.15, 0.7, 1] : [0, 0.2, 0.8, 1],
    entryOnly
      ? [0, 0, 0, blurRange[2]]
      : [blurRange[0], blurRange[1], blurRange[1], blurRange[2]]
  )

  const filter = useTransform(blurValue, (v) => `blur(${v}px)`)

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        scale,
        opacity,
        y,
        filter,
        willChange: 'transform, opacity, filter',
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}
