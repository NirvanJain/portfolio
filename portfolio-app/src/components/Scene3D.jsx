import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Track mouse globally via window events (Canvas can't get events when behind content)
const globalMouse = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1
    globalMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, { passive: true })
}

/* ===== GEOMETRY CREATORS ===== */

function createStarGeometry(outer = 0.07, inner = 0.03) {
  const shape = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2
    const r = i % 2 === 0 ? outer : inner
    if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
    else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
  }
  shape.closePath()
  return new THREE.ShapeGeometry(shape)
}

function createRocketGeometry() {
  const s = new THREE.Shape()
  s.moveTo(0, 0.11)
  s.lineTo(0.03, 0.05)
  s.lineTo(0.025, -0.02)
  s.lineTo(0.055, -0.08)
  s.lineTo(0.025, -0.05)
  s.lineTo(0.015, -0.07)
  s.lineTo(0, -0.06)
  s.lineTo(-0.015, -0.07)
  s.lineTo(-0.025, -0.05)
  s.lineTo(-0.055, -0.08)
  s.lineTo(-0.025, -0.02)
  s.lineTo(-0.03, 0.05)
  s.closePath()
  return new THREE.ShapeGeometry(s)
}

/* ===== ROCKETS & STARS ===== */
const ROCKET_N = 10
const STAR_N = 20

const _ndc = new THREE.Vector3()
const _rayDir = new THREE.Vector3()
const _ray = new THREE.Ray()
const _objPos = new THREE.Vector3()
const _closest = new THREE.Vector3()

const genRockets = () => Array.from({ length: ROCKET_N }, () => {
  const x = (Math.random() - 0.5) * 16
  const y = (Math.random() - 0.5) * 10
  const z = -1 - Math.random() * 5
  const baseRot = Math.random() * Math.PI * 2
  return {
    px: x, py: y, pz: z,
    bx: x, by: y,
    vx: 0, vy: 0,
    rot: baseRot,
    baseRot,
    scale: 0.6 + Math.random() * 0.8,
    bobPh: Math.random() * Math.PI * 2,
    bobSpd: 0.2 + Math.random() * 0.3,
  }
})

const genStars = () => Array.from({ length: STAR_N }, () => {
  const x = (Math.random() - 0.5) * 20
  const y = (Math.random() - 0.5) * 12
  const z = -1 - Math.random() * 7
  const baseRot = Math.random() * Math.PI * 2
  return {
    px: x, py: y, pz: z,
    bx: x, by: y,
    vx: 0, vy: 0,
    rot: baseRot,
    baseRot,
    scale: 0.35 + Math.random() * 0.55,
    twPh: Math.random() * Math.PI * 2,
    twSpd: 1 + Math.random() * 2,
    spinSpd: (Math.random() - 0.5) * 0.3,
  }
})

function InteractiveField({ theme = 'dark' }) {
  const rocketMesh = useRef()
  const starMesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const wireColor = theme === 'light' ? '#1a1a1a' : '#ffffff'

  const rocketGeo = useMemo(() => createRocketGeometry(), [])
  const starGeo = useMemo(() => createStarGeometry(), [])

  // ── Data ──
  const rockets = useRef(null)
  if (rockets.current == null) rockets.current = genRockets()

  const stars = useRef(null)
  if (stars.current == null) stars.current = genStars()

  // Helper: compute repulsion from mouse ray to object
  function computeRepel(objX, objY, objZ, camera, pointer) {
    // Build a ray from camera through the mouse pointer
    _ndc.set(pointer.x, pointer.y, 0.5)
    _ndc.unproject(camera)
    _rayDir.copy(_ndc).sub(camera.position).normalize()
    _ray.set(camera.position, _rayDir)

    // Find closest point on ray to the object
    _objPos.set(objX, objY, objZ)
    _ray.closestPointToPoint(_objPos, _closest)

    // 2D repulsion in XY from the closest point
    const dx = objX - _closest.x
    const dy = objY - _closest.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    return { dx, dy, dist }
  }

  // ── Animation Loop ──
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const { camera } = state
    // Use global mouse instead of state.pointer (canvas is behind content)
    const pointer = globalMouse

    const REPEL_R = 2.5
    const REPEL_F = 0.22
    const SPRING = 0.014
    const DAMP = 0.87

    const rs = rockets.current
    const ss = stars.current
    if (!rs || !ss) return

    // ── ROCKETS ──
    if (rocketMesh.current) {
      for (let i = 0; i < ROCKET_N; i++) {
        const r = rs[i]
        const { dx, dy, dist } = computeRepel(r.px, r.py, r.pz, camera, pointer)

        if (dist < REPEL_R && dist > 0.001) {
          const f = ((1 - dist / REPEL_R) ** 1.8) * REPEL_F
          r.vx += (dx / dist) * f
          r.vy += (dy / dist) * f
        }

        r.vx += (r.bx - r.px) * SPRING
        r.vy += (r.by - r.py) * SPRING
        r.vx *= DAMP
        r.vy *= DAMP
        r.px += r.vx
        r.py += r.vy

        const bob = Math.sin(t * r.bobSpd + r.bobPh) * 0.1
        const spd = Math.sqrt(r.vx * r.vx + r.vy * r.vy)

        if (spd > 0.006) {
          const target = Math.atan2(r.vy, r.vx) + Math.PI / 2
          let d = target - r.rot
          while (d > Math.PI) d -= Math.PI * 2
          while (d < -Math.PI) d += Math.PI * 2
          r.rot += d * 0.12
        } else {
          const wobble = r.baseRot + Math.sin(t * 0.3 + r.bobPh) * 0.06
          let d = wobble - r.rot
          while (d > Math.PI) d -= Math.PI * 2
          while (d < -Math.PI) d += Math.PI * 2
          r.rot += d * 0.02
        }

        dummy.position.set(r.px, r.py + bob, r.pz)
        dummy.rotation.set(0, 0, r.rot)
        dummy.scale.setScalar(r.scale)
        dummy.updateMatrix()
        rocketMesh.current.setMatrixAt(i, dummy.matrix)
      }
      rocketMesh.current.instanceMatrix.needsUpdate = true
    }

    // ── STARS ──
    if (starMesh.current) {
      for (let i = 0; i < STAR_N; i++) {
        const s = ss[i]
        const { dx, dy, dist } = computeRepel(s.px, s.py, s.pz, camera, pointer)

        if (dist < REPEL_R && dist > 0.001) {
          const f = ((1 - dist / REPEL_R) ** 1.8) * REPEL_F * 0.7
          s.vx += (dx / dist) * f
          s.vy += (dy / dist) * f
        }

        s.vx += (s.bx - s.px) * SPRING
        s.vy += (s.by - s.py) * SPRING
        s.vx *= DAMP
        s.vy *= DAMP
        s.px += s.vx
        s.py += s.vy

        const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
        if (spd > 0.004) {
          s.rot += s.spinSpd * (1 + spd * 10) * 0.02
        } else {
          const w = s.baseRot + Math.sin(t * 0.5 + s.twPh) * 0.04
          s.rot += (w - s.rot) * 0.003
        }

        const tw = 0.8 + Math.sin(t * s.twSpd + s.twPh) * 0.2
        dummy.position.set(s.px, s.py, s.pz)
        dummy.rotation.set(0, 0, s.rot)
        dummy.scale.setScalar(s.scale * tw)
        dummy.updateMatrix()
        starMesh.current.setMatrixAt(i, dummy.matrix)
      }
      starMesh.current.instanceMatrix.needsUpdate = true
    }

  })

  return (
    <>
      <instancedMesh ref={rocketMesh} args={[rocketGeo, undefined, ROCKET_N]}>
        <meshBasicMaterial color={wireColor} transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </instancedMesh>
      <instancedMesh ref={starMesh} args={[starGeo, undefined, STAR_N]}>
        <meshBasicMaterial color={wireColor} transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
      </instancedMesh>
    </>
  )
}

/* ===== CAMERA RIG ===== */
function CameraRig() {
  useFrame((state) => {
    const { camera } = state
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, globalMouse.x * 0.5, 0.012)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, globalMouse.y * 0.25, 0.012)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ===== MAIN SCENE ===== */
export default function Scene3D({ intensity = 1, theme = 'dark' }) {
  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        resize={{ scroll: false }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.05 * intensity} />
          <InteractiveField theme={theme} />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  )
}
