import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Minimalist 3D Dust/Particles
function MinimalDust({ isExiting }) {
  const count = 400
  const mesh = useRef()
  const materialRef = useRef()

  const [positions, scales] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
      scales[i] = Math.random() * 1.5
    }
    return [positions, scales]
  }, [])

  useFrame((state, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y += delta * 0.05
    mesh.current.rotation.x += delta * 0.02
    
    if (isExiting && materialRef.current) {
      // Expand and dissolve elegantly
      mesh.current.scale.lerp(new THREE.Vector3(3, 3, 3), 0.03)
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0, 0.05)
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function CameraRig({ isExiting }) {
  useFrame((state) => {
    if (isExiting) {
      // Gently drift forward into the void
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, -10, 0.02)
    } else {
      // Very subtle sway
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(state.clock.elapsedTime * 0.2) * 0.5, 0.02)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, Math.cos(state.clock.elapsedTime * 0.15) * 0.5, 0.02)
    }
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function BootSequence({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    let current = 0
    let frameId
    let lastTime = performance.now()

    const updateProgress = (time) => {
      if (time - lastTime > 60) {
        const increment = Math.floor(Math.random() * 3) + 1
        current += increment
        lastTime = time

        if (current >= 100) {
          current = 100
          setProgress(100)
          setTimeout(() => {
            setExiting(true)
            setTimeout(onComplete, 1600) // Longer, more elegant fade out
          }, 400)
          return
        }
        setProgress(current)
      }
      frameId = requestAnimationFrame(updateProgress)
    }

    frameId = requestAnimationFrame(updateProgress)

    return () => cancelAnimationFrame(frameId)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-[#020202] text-white overflow-hidden"
      style={{ zIndex: 9999 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 1.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference">
        <div className="flex flex-col items-center">
          <motion.div 
            className="text-[18vw] md:text-[12vw] font-light tracking-tight leading-none flex items-end"
            style={{ fontFamily: 'Inter, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: exiting ? 0 : 1, 
              y: exiting ? -40 : 0,
              scale: exiting ? 1.05 : 1,
              filter: exiting ? 'blur(8px)' : 'blur(0px)'
            }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {progress}
            <span className="text-[4vw] md:text-[2vw] mb-[2vw] md:mb-[1vw] ml-1 text-white/30 font-light">%</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

