import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Orbiting Dots ───────────────────────────────────────────────
   A handful of tiny dots slowly orbiting in a ring around the
   profile frame. On hover they speed up and glow slightly brighter.
   Extremely minimal — just enough to feel alive.
   ──────────────────────────────────────────────────────────────── */

const DOT_COUNT = 8

function OrbitDots({ hovered, theme }) {
  const pointsRef = useRef()
  const hoverVal = useRef(0)
  const isDark = theme !== 'light'

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(DOT_COUNT * 3)
    const ph = []
    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = (i / DOT_COUNT) * Math.PI * 2
      ph.push({
        offset: angle,
        radius: 2.2 + (Math.random() - 0.5) * 0.3,
        speed: 0.15 + Math.random() * 0.1,
        yDrift: (Math.random() - 0.5) * 0.4,
      })
      pos[i * 3] = 0
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0
    }
    return { positions: pos, phases: ph }
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Smooth hover lerp
    const target = hovered ? 1 : 0
    hoverVal.current += (target - hoverVal.current) * 0.05

    const h = hoverVal.current
    const posAttr = geometry.attributes.position

    for (let i = 0; i < DOT_COUNT; i++) {
      const p = phases[i]
      const speed = p.speed * (1 + h * 1.5)
      const angle = p.offset + t * speed

      posAttr.array[i * 3] = Math.cos(angle) * p.radius
      posAttr.array[i * 3 + 1] = Math.sin(angle) * p.radius + Math.sin(t * 0.4 + p.offset) * p.yDrift
      posAttr.array[i * 3 + 2] = Math.sin(angle * 0.5) * 0.3
    }

    posAttr.needsUpdate = true

    if (pointsRef.current) {
      pointsRef.current.material.opacity = 0.25 + h * 0.35
      pointsRef.current.material.size = 0.04 + h * 0.02
    }
  })

  const color = isDark ? '#c8b4ff' : '#4a2e6e'

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={0.04}
        transparent
        opacity={0.25}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/* ─── Main Export ──────────────────────────────────────────────── */

export default function ProfileScene3D({ isHovered = false }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const check = () => {
      setTheme(
        document.documentElement.getAttribute('data-theme') === 'light'
          ? 'light'
          : 'dark'
      )
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="absolute inset-[-30%] pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        resize={{ scroll: false }}
      >
        <OrbitDots hovered={isHovered} theme={theme} />
      </Canvas>
    </div>
  )
}
