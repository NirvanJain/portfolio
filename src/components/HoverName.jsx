import { useState, useEffect, useCallback, useRef } from 'react';

export default function HoverName({ className }) {
  const [display, setDisplay] = useState('');
  const [active, setActive] = useState(false);
  const wrapRef = useRef(null);
  const tickRef = useRef(null);
  const frameRef = useRef(0);
  const isHovered = useRef(false);

  const scramble = useCallback((target, durationMs, onDone) => {
    clearInterval(tickRef.current);
    frameRef.current = 0;
    const total = Math.ceil(durationMs / 30);
    tickRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / total;
      setDisplay(
        target
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            const threshold = (progress * target.length - i) / target.length;
            return threshold > 0.55 ? char : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );
      if (frameRef.current >= total) {
        clearInterval(tickRef.current);
        setDisplay(target);
        onDone?.();
      }
    }, 30);
  }, []);

  // Mount: reveal default name
  useEffect(() => {
    setDisplay('');
    const t = setTimeout(() => scramble('VOIDRA', 1200, null), 800);
    return () => {
      clearTimeout(t);
      clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnter = useCallback(() => {
    isHovered.current = true;
    setActive(true);
    scramble('NIRVAN JAIN', 700, null);
  }, [scramble]);

  const handleLeave = useCallback(() => {
    isHovered.current = false;
    setActive(false);
    scramble('VOIDRA', 500, null);
  }, [scramble]);

  const handleMove = useCallback((e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`name-hover${active ? ' active' : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      data-hoverable
    >
      <h1 className={`inline-block whitespace-pre cursor-default ${className}`}>{display || ' '}</h1>
    </div>
  );
}

// NOTE: The GLITCH_CHARS constant used in the original HeroSection file
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#<>[]{}|~';
