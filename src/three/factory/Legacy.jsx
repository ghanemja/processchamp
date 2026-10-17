import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Blob } from './World'
import { Operator } from './Fixtures'
import { brushedMap, paintedMap } from './textures'
import { ALERT, AZURE } from './layout'

const JIG_STEEL = '#6f7b8a'
const JIG_DARK = '#4e5866'
const CLAMP = '#b9452f'

/**
 * The thing GeoSet AI deletes: a welded steel jig, cut for exactly one part.
 * Every pillar, clamp and locating pin here is dedicated tooling that has to
 * be designed, built, proven out and stored.
 */
export function WeldJig({ position = [0, 0, 0], rotation = [0, 0, 0], length = 5.0, width = 2.4, clamps = 8 }) {
  const arms = useRef([])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    arms.current.forEach((m, i) => {
      if (m) m.rotation.z = -0.5 + Math.sin(t * 0.7 + i) * 0.06
    })
  })

  const posts = useMemo(() => {
    const out = []
    const n = Math.max(2, Math.round(clamps / 2))
    for (let i = 0; i < n; i++) {
      const x = -length / 2 + 0.5 + (i * (length - 1)) / (n - 1)
      out.push([x, -width / 2], [x, width / 2])
    }
    return out
  }, [clamps, length, width])

  return (
    <group position={position} rotation={rotation}>
      <Blob scale={Math.max(length, width) / 1.7} opacity={0.5} />
      {/* bolted base frame */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[length, 0.24, width]} />
        <meshStandardMaterial map={paintedMap(JIG_STEEL, { repeat: 3 })} color={JIG_STEEL} roughness={0.75} metalness={0.45} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0.34, (s * width) / 2]}>
          <boxGeometry args={[length, 0.2, 0.2]} />
          <meshStandardMaterial color={JIG_DARK} roughness={0.7} metalness={0.5} />
        </mesh>
      ))}

      {/* locating posts and pneumatic clamps, one pair per station of the part */}
      {posts.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.62, 0]}>
            <boxGeometry args={[0.16, 0.76, 0.16]} />
            <meshStandardMaterial color={JIG_STEEL} roughness={0.6} metalness={0.6} />
          </mesh>
          <mesh position={[0, 1.02, 0]}>
            <boxGeometry args={[0.26, 0.14, 0.26]} />
            <meshStandardMaterial map={brushedMap({ repeat: 1 })} color="#8f9bab" roughness={0.45} metalness={0.8} />
          </mesh>
          {/* clamp arm */}
          <group position={[0, 1.1, 0]}>
            <mesh ref={(el) => (arms.current[i] = el)} position={[0.14, 0, 0]} rotation={[0, 0, -0.5]}>
              <boxGeometry args={[0.36, 0.07, 0.08]} />
              <meshStandardMaterial color={CLAMP} roughness={0.5} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.2, 10]} />
              <meshStandardMaterial color={JIG_DARK} roughness={0.5} metalness={0.7} />
            </mesh>
          </group>
          {/* air line */}
          <mesh position={[0.1, 0.7, 0.06]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 6]} />
            <meshStandardMaterial color="#2b3440" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* the datum plate the part is forced onto */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[length - 0.6, 0.06, width - 0.5]} />
        <meshStandardMaterial map={brushedMap({ repeat: 2 })} color="#7d8897" roughness={0.5} metalness={0.75} />
      </mesh>
    </group>
  )
}

/** Racks of dedicated tooling — one jig per variant, sitting idle. */
export function FixtureStore({ position = [0, 0, 0], rotation = [0, 0, 0], bays = 3 }) {
  return (
    <group position={position} rotation={rotation}>
      <Blob position={[bays * 1.2 - 1.2, 0, 0]} scale={2} opacity={0.4} />
      {Array.from({ length: bays }, (_, i) => (
        <group key={i} position={[i * 2.6, 0, 0]}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[2.3, 0.9, 1.8]} />
            <meshStandardMaterial map={paintedMap('#6f7b8a', { repeat: 2 })} color="#6f7b8a" roughness={0.8} metalness={0.4} />
          </mesh>
          {[-0.6, 0.6].map((z) => (
            <mesh key={z} position={[0, 1.08, z]}>
              <boxGeometry args={[2.0, 0.36, 0.12]} />
              <meshStandardMaterial color={JIG_DARK} roughness={0.7} metalness={0.5} />
            </mesh>
          ))}
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[1.5, 0.12, 1.2]} />
            <meshStandardMaterial color="#8f9bab" roughness={0.5} metalness={0.7} />
          </mesh>
          {/* dedication tag */}
          <mesh position={[0, 0.72, 0.91]}>
            <planeGeometry args={[0.6, 0.26]} />
            <meshStandardMaterial color="#d8dee7" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * Work in process stacked up behind a station. A queue is what a bottleneck
 * looks like from the floor — you do not need the number on a chart.
 */
export function WipQueue({ position = [0, 0, 0], rotation = [0, 0, 0], count = 4, pitch = 5.4, Body }) {
  const group = useRef()
  useFrame(({ clock }) => {
    if (!group.current) return
    // the queue shuffles forward, then stalls again
    const t = clock.getElapsedTime()
    const nudge = Math.max(0, Math.sin(t * 0.25)) * 0.5
    group.current.children.forEach((c, i) => {
      c.position.x = -i * pitch + (i === 0 ? nudge : nudge * 0.2)
    })
  })

  return (
    <group ref={group} position={position} rotation={rotation}>
      {Array.from({ length: count }, (_, i) => (
        <group key={i}>{Body ? <Body /> : null}</group>
      ))}
    </group>
  )
}

/** Red beacon plus a painted hold zone — a stopped station, seen from the aisle. */
export function FaultZone({ position = [0, 0, 0], radius = 3.2 }) {
  const ring = useRef()
  const lamp = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 0.5 + 0.5 * Math.sin(t * 3)
    if (ring.current) ring.current.material.opacity = 0.14 + pulse * 0.2
    if (lamp.current) lamp.current.material.emissiveIntensity = 0.5 + pulse * 3
  })

  return (
    <group position={position}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.017, 0]}>
        <ringGeometry args={[radius - 0.5, radius, 48]} />
        <meshBasicMaterial color={ALERT} transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 3.2, 8]} />
        <meshStandardMaterial color="#39414d" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh ref={lamp} position={[0, 3.3, 0]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#2a0b0b" emissive={ALERT} emissiveIntensity={1.5} roughness={0.4} />
      </mesh>
    </group>
  )
}

/** Manual inspection: granite table, hand gauges, a clipboard and a person. */
export function ManualInspection({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Blob scale={1.1} opacity={0.45} />
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[2.6, 0.9, 1.5]} />
        <meshStandardMaterial color="#5c646f" roughness={0.85} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.94, 0]}>
        <boxGeometry args={[2.8, 0.12, 1.7]} />
        <meshStandardMaterial color="#3b434e" roughness={0.45} metalness={0.3} />
      </mesh>
      {/* height gauge */}
      <mesh position={[-0.9, 1.5, 0]}>
        <boxGeometry args={[0.1, 1.0, 0.1]} />
        <meshStandardMaterial map={brushedMap({ repeat: 1 })} color="#aab4c2" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[-0.68, 1.3, 0]}>
        <boxGeometry args={[0.36, 0.08, 0.08]} />
        <meshStandardMaterial color="#8f9bab" roughness={0.45} metalness={0.75} />
      </mesh>
      {/* hand tools on the plate */}
      {[0.1, 0.5, 0.9].map((x, i) => (
        <mesh key={x} position={[x, 1.03, -0.3 + i * 0.3]} rotation={[0, i * 0.6, 0]}>
          <boxGeometry args={[0.42, 0.05, 0.1]} />
          <meshStandardMaterial color="#c3ccd6" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}
      <Operator position={[0.3, 0, 1.35]} rotation={[0, Math.PI, 0]} scale={0.98} />
    </group>
  )
}

/** Offline engineering: a desk, paper travellers, a filing cabinet. */
export function OfflineDesk({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Blob scale={1.1} opacity={0.42} />
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[2.2, 0.76, 0.9]} />
        <meshStandardMaterial color="#8d7f6c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[2.35, 0.06, 1.0]} />
        <meshStandardMaterial color="#a3927c" roughness={0.85} />
      </mesh>
      {/* stacks of paper */}
      {[-0.7, 0, 0.62].map((x, i) => (
        <mesh key={x} position={[x, 0.85 + i * 0.02, 0.1]} rotation={[0, i * 0.3, 0]}>
          <boxGeometry args={[0.34, 0.1 + i * 0.05, 0.46]} />
          <meshStandardMaterial color="#eef1f5" roughness={0.95} />
        </mesh>
      ))}
      {/* filing cabinet of drawings */}
      <mesh position={[1.8, 0.65, -0.1]}>
        <boxGeometry args={[0.8, 1.3, 0.7]} />
        <meshStandardMaterial color="#77818f" roughness={0.8} metalness={0.3} />
      </mesh>
      {[0.35, 0.75, 1.15].map((y) => (
        <mesh key={y} position={[1.8, y, 0.26]}>
          <boxGeometry args={[0.6, 0.06, 0.04]} />
          <meshStandardMaterial color="#5e6774" roughness={0.6} metalness={0.4} />
        </mesh>
      ))}
      <Operator position={[-0.2, 0, -0.95]} scale={0.98} />
    </group>
  )
}

/** Rework: a tagged body, a scrap bin and somebody fixing it by hand. */
export function ReworkBay({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const tag = useRef()
  useFrame(({ clock }) => {
    if (tag.current) tag.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.25
  })
  return (
    <group position={position} rotation={rotation}>
      {/* scrap bin */}
      <mesh position={[2.4, 0.45, 0]}>
        <boxGeometry args={[1.5, 0.9, 1.2]} />
        <meshStandardMaterial color="#7d4a3f" roughness={0.9} metalness={0.2} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[2.2 + i * 0.16, 0.95 + i * 0.05, -0.1 + i * 0.12]} rotation={[0.3, i, 0.2]}>
          <boxGeometry args={[0.7, 0.05, 0.5]} />
          <meshStandardMaterial color="#9aa4b1" roughness={0.5} metalness={0.8} />
        </mesh>
      ))}
      {/* reject tag hanging off the part */}
      <group ref={tag} position={[0, 1.9, 0.6]}>
        <mesh>
          <planeGeometry args={[0.34, 0.46]} />
          <meshStandardMaterial color={ALERT} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.26, 6]} />
          <meshStandardMaterial color="#39414d" roughness={0.8} />
        </mesh>
      </group>
      <Operator position={[-1.5, 0, 1.0]} rotation={[0, 0.7, 0]} scale={0.98} />
    </group>
  )
}

/** Overhead manual hoist — how the part moves without a robot. */
export function Hoist({ position = [0, 0, 0], span = 6, height = 4.4 }) {
  const trolley = useRef()
  useFrame(({ clock }) => {
    if (trolley.current) trolley.current.position.z = Math.sin(clock.getElapsedTime() * 0.3) * (span / 3)
  })
  return (
    <group position={position}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, height / 2, (s * span) / 2]}>
          <boxGeometry args={[0.2, height, 0.2]} />
          <meshStandardMaterial color="#77818f" roughness={0.7} metalness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[0.26, 0.26, span]} />
        <meshStandardMaterial color="#6f7b8a" roughness={0.65} metalness={0.55} />
      </mesh>
      <group ref={trolley} position={[0, height - 0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.42, 0.3, 0.42]} />
          <meshStandardMaterial color="#8f9bab" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.5, 6]} />
          <meshStandardMaterial color="#39414d" roughness={0.6} metalness={0.6} />
        </mesh>
        <mesh position={[0, -1.72, 0]}>
          <boxGeometry args={[0.5, 0.18, 0.3]} />
          <meshStandardMaterial color={CLAMP} roughness={0.6} metalness={0.4} />
        </mesh>
      </group>
    </group>
  )
}
