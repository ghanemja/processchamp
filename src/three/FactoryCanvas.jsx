import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { StudioEnv } from './Stage'
import World from './factory/World'
import Stations from './factory/Stations'
import { CAM_CURVE, CYAN, AZURE, STATION_STYLE, STATION_X, TARGET_CURVE } from './factory/layout'
import { getProgress } from './factory/progress'

/**
 * Scroll drives a splined flight down the aisle. Position and look-at are two
 * separate curves, so the camera can lead into a station before it arrives.
 */
/**
 * Scroll maps to curve position through a dwell curve: the camera parks at a
 * station for the middle of its section and only travels at the edges, so the
 * picture is still while you are reading and moves when you keep scrolling.
 */
function dwell(t, stops) {
  const n = stops - 1
  const seg = THREE.MathUtils.clamp(t, 0, 1) * n
  const i = Math.min(n - 1, Math.floor(seg))
  const f = seg - i
  const hold = 0.3 // share of each segment spent parked, split across both ends
  const k = THREE.MathUtils.clamp((f - hold / 2) / (1 - hold), 0, 1)
  const eased = k * k * k * (k * (k * 6 - 15) + 10)
  return (i + eased) / n
}

function CameraRig({ lively = true }) {
  const { camera, size } = useThree()
  const target = useRef(new THREE.Vector3(...TARGET_CURVE.points[0].toArray()))
  const want = useMemo(() => new THREE.Vector3(), [])
  const wantT = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    camera.position.copy(CAM_CURVE.points[0])
    camera.lookAt(TARGET_CURVE.points[0])
  }, [camera])

  // fov is vertical, so a narrow viewport would crop the aisle off the sides
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    camera.fov = aspect < 0.75 ? 66 : aspect < 1.1 ? 56 : aspect < 1.45 ? 46 : 42
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])

  useFrame(({ pointer, clock }, delta) => {
    const t = dwell(getProgress(), STATION_X.length)
    CAM_CURVE.getPoint(t, want)
    TARGET_CURVE.getPoint(t, wantT)

    if (lively) {
      const e = clock.getElapsedTime()
      // a hand-held drift, plus a little parallax from the pointer
      want.y += Math.sin(e * 0.5) * 0.09
      want.z += Math.cos(e * 0.37) * 0.12 + pointer.x * 0.9
      want.y += pointer.y * 0.35
    }

    // On a phone the caption card owns the lower screen, so aim lower and let
    // the machine sit in the clear upper third.
    const aspect = size.width / Math.max(1, size.height)
    if (aspect < 1.1) {
      wantT.y -= 1.5
      want.y += 0.5
    }

    const k = 1 - Math.pow(0.0009, delta)
    camera.position.lerp(want, k)
    target.current.lerp(wantT, k)
    camera.lookAt(target.current)
  })

  return null
}

/** Two accent lights ride along with the camera so the aisle lights up ahead. */
function TravelingLights() {
  const warm = useRef()
  const cool = useRef()
  const head = useRef()
  const { camera } = useThree()
  const tint = useMemo(() => new THREE.Color(), [])
  const accent = useMemo(() => new THREE.Color(), [])

  useFrame((state, delta) => {
    const x = camera.position.x
    if (warm.current) warm.current.position.set(x + 7, 3.4, -4.6)
    if (cool.current) cool.current.position.set(x + 4, 2.6, 5.2)
    if (head.current) head.current.position.set(x - 1, camera.position.y + 1.4, camera.position.z)

    // blend toward the bay the camera is standing in
    let nearest = 0
    let best = Infinity
    for (let i = 0; i < STATION_X.length; i++) {
      const d = Math.abs(STATION_X[i] - x)
      if (d < best) {
        best = d
        nearest = i
      }
    }
    const style = STATION_STYLE[nearest]
    if (style) {
      const k = 1 - Math.pow(0.02, delta)
      tint.set(style.light)
      accent.set(style.accent)
      if (head.current) head.current.color.lerp(tint, k)
      if (warm.current) warm.current.color.lerp(accent, k)
    }
  })

  return (
    <>
      <pointLight ref={warm} intensity={14} color={AZURE} distance={20} decay={2} />
      <pointLight ref={cool} intensity={12} color={CYAN} distance={18} decay={2} />
      <pointLight ref={head} intensity={18} color="#ffffff" distance={20} decay={2} />
    </>
  )
}

/** Overhead luminaires only need to exist near the camera. */
function BayLights() {
  const lights = useRef([])
  const { camera } = useThree()
  useFrame(() => {
    const base = Math.round(camera.position.x / 20) * 20
    lights.current.forEach((l, i) => {
      if (l) l.position.set(base + (i - 1) * 20, 7.6, 0)
    })
  })
  return (
    <>
      {[0, 1, 2].map((i) => (
        <pointLight
          key={i}
          ref={(el) => (lights.current[i] = el)}
          intensity={16}
          color="#ffffff"
          distance={26}
          decay={2}
        />
      ))}
    </>
  )
}

function Scene({ cheap, lively, specimen, benefits, products }) {
  return (
    <>
      <color attach="background" args={['#dbe3ed']} />
      <fog attach="fog" args={['#dbe3ed', 48, 165]} />
      <StudioEnv />
      {/* a daylit plant: strong sky fill, roof glazing above, soft bounce */}
      <hemisphereLight args={['#eaf2fb', '#6d7986', 0.8]} />
      <directionalLight position={[18, 22, 14]} intensity={1.7} color="#ffffff" />
      <directionalLight position={[-14, 14, -10]} intensity={0.35} color="#bcd3ea" />
      <BayLights />
      <TravelingLights />
      <CameraRig lively={lively} />
      <World reflective={!cheap} />
      <Stations specimen={specimen} benefits={benefits} products={products} window={cheap ? 1 : 2} />
    </>
  )
}

/**
 * One persistent canvas behind the whole journey. Separate canvases per
 * section would each pay for their own WebGL context and environment map.
 */
export default function FactoryCanvas({ active = true, lively = true, specimen, benefits, products }) {
  const [degraded, setDegraded] = useState(false)
  const [low, setLow] = useState(false)

  useEffect(() => {
    const check = () =>
      setLow(
        window.innerWidth < 900 ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
          (navigator.hardwareConcurrency ?? 8) <= 4
      )
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const cheap = low || degraded

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={cheap ? [1, 1.1] : [1, 1.6]}
      camera={{ position: STATION_X.length ? [-20, 8.2, 17] : [0, 5, 10], fov: 42, near: 0.5, far: 220 }}
      gl={{ antialias: !cheap, powerPreference: 'high-performance', alpha: false, toneMappingExposure: 0.66 }}
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <Scene cheap={cheap} lively={lively && !cheap} specimen={specimen} benefits={benefits} products={products} />
      </Suspense>
    </Canvas>
  )
}
