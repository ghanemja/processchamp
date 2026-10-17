import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AZURE } from './materials'

/** Drifting measurement point cloud that reads as a 3D vision scan. */
export function ScanCloud({ count = 900, radius = 3.2, height = 2.4, color = '#0d5fc4', size = 0.028 }) {
  const ref = useRef()
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = radius * Math.sqrt(Math.random())
      positions[i * 3] = Math.cos(a) * r
      positions[i * 3 + 1] = Math.random() * height
      positions[i * 3 + 2] = Math.sin(a) * r
      seeds[i] = Math.random()
    }
    return { positions, seeds }
  }, [count, radius, height])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const geo = ref.current?.geometry
    if (!geo) return
    const arr = geo.attributes.position.array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] = ((seeds[i] + t * 0.045) % 1) * height
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** Horizontal laser plane sweeping a part — the "scan critical datums" step. */
export function LaserSweep({ width = 3, depth = 3, from = 0.1, to = 2.2, speed = 0.35, color = AZURE }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    const p = (Math.sin(t) + 1) / 2
    if (ref.current) {
      ref.current.position.y = from + p * (to - from)
      ref.current.material.opacity = 0.14 + Math.sin(t * 2) * 0.05
    }
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

/** Pulsing datum target pinned to a feature on the part. */
export function DatumPin({ position = [0, 0, 0], color = AZURE, label }) {
  const ring = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const s = 1 + ((t * 0.7) % 1) * 1.6
    if (ring.current) {
      ring.current.scale.setScalar(s)
      ring.current.material.opacity = Math.max(0, 0.8 - ((t * 0.7) % 1))
    }
  })
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#120a04" emissive={color} emissiveIntensity={3} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {label && (
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.012, 0.16, 0.012]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}

/** Sheet-metal-ish panel the cell manipulates. */
export function Panel({ position = [0, 0, 0], rotation = [0, 0, 0], size = [1.6, 0.06, 1.1], color = '#767d86', wobble = 0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current || !wobble) return
    const t = clock.getElapsedTime()
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.8) * wobble
    ref.current.rotation.x = rotation[0] + Math.cos(t * 0.6) * wobble
  })
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.85} />
      </mesh>
      <mesh position={[0, size[1] / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size[0] * 0.8, size[2] * 0.6]} />
        <meshStandardMaterial color="#5c636c" roughness={0.55} metalness={0.6} />
      </mesh>
    </group>
  )
}

/** Open cage of the mobile work cell. */
export function CellFrame({ size = [7, 3.4, 6], color = '#2a313b', accent = AZURE }) {
  const [w, h, d] = size
  const post = (x, z, key) => (
    <mesh key={key} position={[x, h / 2, z]}>
      <boxGeometry args={[0.1, h, 0.1]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.6} />
    </mesh>
  )
  return (
    <group>
      {post(-w / 2, -d / 2, 'a')}
      {post(w / 2, -d / 2, 'b')}
      {post(-w / 2, d / 2, 'c')}
      {post(w / 2, d / 2, 'd')}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w + 0.1, 0.08, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.6} />
      </mesh>
      <mesh position={[0, h, -d / 2]}>
        <boxGeometry args={[w + 0.1, 0.08, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.6} />
      </mesh>
      <mesh position={[0, h - 0.12, -d / 2]}>
        <boxGeometry args={[w * 0.5, 0.02, 0.02]} />
        <meshStandardMaterial color="#0d1015" emissive={accent} emissiveIntensity={1.4} />
      </mesh>
    </group>
  )
}

/** Slow orbital drift so static scenes still feel alive. */
export function Drift({ children, amount = 0.12, speed = 0.18 }) {
  const ref = useRef()
  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime()
    if (!ref.current) return
    ref.current.rotation.y = Math.sin(t * speed) * amount + pointer.x * 0.14
    ref.current.rotation.x = Math.cos(t * speed * 0.8) * amount * 0.35 - pointer.y * 0.06
  })
  return <group ref={ref}>{children}</group>
}
