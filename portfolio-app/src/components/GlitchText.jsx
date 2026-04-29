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
  return (
    <Tag
      className={`inline-block whitespace-pre ${className}`}
      data-hoverable
      data-text={text}
    >
      {text || '\u00A0'}
    </Tag>
  )
}
