import { useState, useEffect, useRef, useCallback } from 'react'

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}|/\\~`_+-='

export default function GlitchText({
  text,
  className = '',
  as: Tag = 'span',
  trigger = 'hover',
  duration = 600,
  stagger = true,
  delay = 0,
}) {
  const [display, setDisplay] = useState(trigger === 'mount' ? '' : text)
  const [glitching, setGlitching] = useState(false)
  const intervalRef = useRef(null)
  const frameRef = useRef(0)

  const scramble = useCallback(() => {
    if (glitching) return
    setGlitching(true)
    frameRef.current = 0
    const totalFrames = Math.ceil(duration / 30)

    intervalRef.current = setInterval(() => {
      frameRef.current++
      const progress = frameRef.current / totalFrames

      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            const threshold = stagger
              ? (progress * text.length - i) / text.length
              : progress
            if (threshold > 0.6) return text[i]
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          })
          .join('')
      )

      if (frameRef.current >= totalFrames) {
        clearInterval(intervalRef.current)
        setDisplay(text)
        setGlitching(false)
      }
    }, 30)
  }, [text, duration, glitching, stagger])

  useEffect(() => {
    if (trigger === 'mount') {
      const timer = setTimeout(scramble, delay)
      return () => {
        clearTimeout(timer)
        clearInterval(intervalRef.current)
      }
    }
    return () => clearInterval(intervalRef.current)
  }, [trigger, scramble, delay])

  useEffect(() => {
    if (!glitching) setDisplay(text)
  }, [text, glitching])

  const handlers = trigger === 'hover' ? { onMouseEnter: scramble } : {}

  return (
    <Tag
      className={`inline-block whitespace-pre ${className}`}
      data-hoverable
      data-text={text}
      {...handlers}
    >
      {display || '\u00A0'}
    </Tag>
  )
}
