import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Grid, AdaptiveDpr, PerformanceMonitor, Environment, Lightformer } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { AZURE } from './materials'

/**
 * Studio environment built from lightformers rather than a downloaded HDRI:
 * polished metal needs something to reflect, and this ships with the bundle.
 */
export function StudioEnv() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.6} color="#ffffff" position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 10, 1]} />
      <Lightformer form="rect" intensity={1.1} color="#cfe0f2" position={[-7, 3, 2]} rotation={[0, Math.PI / 2, 0]} scale={[10, 8, 1]} />
      <Lightformer form="rect" intensity={0.8} color="#8fb8e8" position={[7, 2.2, -3]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 5, 1]} />
      <Lightformer form="rect" intensity={0.7} color="#b9c6d4" position={[0, 2, 9]} rotation={[0, Math.PI, 0]} scale={[14, 6, 1]} />
      <mesh scale={30}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#8d99a8" side={2} />
      </mesh>
    </Environment>
  )
}

/** Shared lighting rig — warm key from the cell, cool fill from the vision system. */
export function Rig({ intensity = 1 }) {
  return (
    <>
      <StudioEnv />
      <hemisphereLight args={['#9fb4c8', '#0a0c10', 0.55 * intensity]} />
      <directionalLight
        position={[6, 9, 5]}
        intensity={1.5 * intensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <pointLight position={[-5, 3, -4]} intensity={28 * intensity} color={AZURE} distance={18} decay={2} />
      <pointLight position={[4, 2, 5]} intensity={16 * intensity} color="#48d8ff" distance={16} decay={2} />
    </>
  )
}

export function Floor({ y = 0, color = '#12161c', shadowOpacity = 0.55, gridArgs = [40, 40] }) {
  return (
    <group position={[0, y, 0]}>
      <Grid
        args={gridArgs}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#2e3744"
        sectionSize={3}
        sectionThickness={1.3}
        sectionColor={AZURE}
        fadeDistance={34}
        fadeStrength={1.3}
        followCamera={false}
        infiniteGrid
      />
      <ContactShadows position={[0, 0.002, 0]} opacity={shadowOpacity} scale={22} blur={2.4} far={8} color="#000000" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0.1} />
      </mesh>
    </group>
  )
}

/**
 * Canvas wrapper with a degrade path: drops DPR under load, and renders the
 * `fallback` node behind the canvas while geometry compiles.
 */
/** Phones get a cheaper frame: no shadow maps, lower DPR, no AA. */
function useLowPower() {
  const [low, setLow] = useState(false)
  useEffect(() => {
    const check = () =>
      setLow(
        window.innerWidth < 768 ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
          (navigator.hardwareConcurrency ?? 8) <= 4
      )
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return low
}

export default function Stage({
  children,
  camera = { position: [7, 4.6, 8], fov: 38 },
  className = '',
  dpr = [1, 1.75],
  shadows = true,
}) {
  const [degraded, setDegraded] = useState(false)
  const low = useLowPower()
  const cheap = degraded || low
  return (
    <Canvas
      className={className}
      shadows={shadows && !cheap}
      dpr={cheap ? [1, 1.25] : dpr}
      camera={camera}
      gl={{ antialias: !cheap, powerPreference: 'high-performance', alpha: true }}
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}
