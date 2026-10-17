import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import RobotArm from '../RobotArm'
import { Weld } from '../factory/Parts'
import { DatumPin } from '../Bits'
import { AZURE, GREEN } from '../factory/layout'

const SKIN = '#c2cbd7'
const SKIN_LIGHT = '#d8dfe8'
const FRAME = '#97a3b2'

/** Shared slow turntable so each specimen reads as an object, not a diagram. */
function Turn({ children, speed = 0.22, offset = 0 }) {
  const ref = useRef()
  useFrame(({ clock, pointer }) => {
    if (!ref.current) return
    ref.current.rotation.y = offset + clock.getElapsedTime() * speed + pointer.x * 0.25
  })
  return <group ref={ref}>{children}</group>
}

/** Aerospace: formers and stringers, with a skin panel coming down onto them. */
export function RibAndSkin() {
  const ribGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.absellipse(0, 0, 0.92, 0.62, 0, Math.PI * 2, false, 0)
    const hole = new THREE.Path()
    hole.absellipse(0, 0, 0.66, 0.4, 0, Math.PI * 2, true, 0)
    s.holes.push(hole)
    const lighten = [-0.45, 0, 0.45]
    lighten.forEach((x) => {
      const h = new THREE.Path()
      h.absellipse(x, 0.0, 0.1, 0.07, 0, Math.PI * 2, true, 0)
    })
    return new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: false, curveSegments: 28 })
  }, [])

  return (
    <Turn speed={0.18} offset={0.5}>
      {/* formers */}
      {[-1.2, -0.4, 0.4, 1.2].map((z) => (
        <mesh key={z} geometry={ribGeo} position={[0, 0, z]}>
          <meshStandardMaterial color={FRAME} roughness={0.42} metalness={0.85} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* stringers */}
      {[-0.78, -0.4, 0, 0.4, 0.78].map((a) => {
        const ang = Math.PI + a
        return (
          <mesh key={a} position={[Math.cos(ang) * 0.79, Math.sin(ang) * 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.07, 2.9, 0.06]} />
            <meshStandardMaterial color={SKIN} roughness={0.4} metalness={0.88} />
          </mesh>
        )
      })}
      {/* skin panel being offered up */}
      <Float speed={1.4} floatIntensity={0.25} rotationIntensity={0.05}>
        <group position={[0, 0.92, 0]} rotation={[0, 0, 0.04]}>
          <mesh>
            <boxGeometry args={[1.5, 0.035, 2.8]} />
            <meshStandardMaterial color={SKIN_LIGHT} roughness={0.32} metalness={0.9} />
          </mesh>
          {Array.from({ length: 14 }, (_, i) => (
            <mesh key={i} position={[-0.62 + (i % 2) * 1.24, 0.03, -1.2 + Math.floor(i / 2) * 0.35]}>
              <cylinderGeometry args={[0.022, 0.022, 0.02, 8]} />
              <meshStandardMaterial color="#6f7b8a" roughness={0.5} metalness={0.9} />
            </mesh>
          ))}
        </group>
      </Float>
      <DatumPin position={[0.8, 0.55, 1.2]} color={AZURE} />
      <DatumPin position={[-0.8, 0.55, -1.2]} color={AZURE} />
    </Turn>
  )
}

/** Automotive closure: tailgate decked into the rear body opening. */
export function TailgateDecking() {
  const panel = useRef()
  useFrame(({ clock }) => {
    if (!panel.current) return
    const k = (clock.getElapsedTime() % 6) / 6
    const seat = k < 0.55 ? k / 0.55 : 1
    const e = seat * seat * (3 - 2 * seat)
    panel.current.position.z = 0.75 - e * 0.42
    panel.current.rotation.x = (1 - e) * 0.16
  })

  return (
    <Turn speed={0.2} offset={-0.75}>
      {/* rear body opening */}
      <group>
        {[-1.0, 1.0].map((x) => (
          <mesh key={x} position={[x, 0.1, 0]}>
            <boxGeometry args={[0.14, 1.5, 0.5]} />
            <meshStandardMaterial color={FRAME} roughness={0.42} metalness={0.85} />
          </mesh>
        ))}
        <mesh position={[0, 0.82, 0]}>
          <boxGeometry args={[2.14, 0.14, 0.5]} />
          <meshStandardMaterial color={FRAME} roughness={0.42} metalness={0.85} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[2.14, 0.14, 0.5]} />
          <meshStandardMaterial color={FRAME} roughness={0.42} metalness={0.85} />
        </mesh>
      </group>

      <group ref={panel} position={[0, 0.1, 0.75]}>
        <RoundedBox args={[1.78, 1.3, 0.07]} radius={0.05} smoothness={3}>
          <meshStandardMaterial color={SKIN_LIGHT} roughness={0.3} metalness={0.9} />
        </RoundedBox>
        <mesh position={[0, 0.3, 0.04]}>
          <boxGeometry args={[1.3, 0.5, 0.01]} />
          <meshStandardMaterial color="#8894a3" roughness={0.5} metalness={0.7} />
        </mesh>
        <DatumPin position={[-0.78, -0.55, 0.06]} color={GREEN} />
        <DatumPin position={[0.78, -0.55, 0.06]} color={GREEN} />
      </group>
    </Turn>
  )
}

/** Two plates, lapped, and the gun putting a row of spots down the seam. */
export function WeldSeam() {
  return (
    <Turn speed={0.16} offset={0.4}>
      <mesh position={[-0.45, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.06, 1.6]} />
        <meshStandardMaterial color={SKIN} roughness={0.38} metalness={0.88} />
      </mesh>
      <mesh position={[0.52, 0.07, 0]}>
        <boxGeometry args={[1.5, 0.06, 1.6]} />
        <meshStandardMaterial color={SKIN_LIGHT} roughness={0.34} metalness={0.9} />
      </mesh>
      {[-0.6, -0.2, 0.2, 0.6].map((z) => (
        <mesh key={z} position={[0.05, 0.11, z]}>
          <cylinderGeometry args={[0.055, 0.055, 0.015, 14]} />
          <meshStandardMaterial color="#6e7a89" roughness={0.6} metalness={0.8} />
        </mesh>
      ))}
      <Weld position={[0.05, 0.14, 0]} />
      <group position={[-1.9, -1.15, 0]} rotation={[0, 0.2, 0]} scale={0.62}>
        <RobotArm program="assemble" tool="weld" scale={1} />
      </group>
    </Turn>
  )
}

/** A bracket going into its hole — tolerance you can see. */
export function PartInsertion() {
  const pin = useRef()
  useFrame(({ clock }) => {
    if (!pin.current) return
    const k = (clock.getElapsedTime() % 5) / 5
    const e = k < 0.6 ? k / 0.6 : 1
    pin.current.position.y = 1.15 - e * 0.95
    pin.current.rotation.z = (1 - e) * 0.08
  })

  return (
    <Turn speed={0.2}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[2.3, 0.14, 1.6]} />
        <meshStandardMaterial color={FRAME} roughness={0.42} metalness={0.85} />
      </mesh>
      <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.04, 10, 28]} />
        <meshStandardMaterial color={SKIN} roughness={0.4} metalness={0.88} />
      </mesh>
      <group ref={pin} position={[0, 1.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.8, 22]} />
          <meshStandardMaterial color={SKIN_LIGHT} roughness={0.3} metalness={0.92} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[0.62, 0.12, 0.42]} />
          <meshStandardMaterial color={SKIN} roughness={0.36} metalness={0.9} />
        </mesh>
        <mesh position={[0, -0.44, 0]}>
          <coneGeometry args={[0.2, 0.14, 22]} />
          <meshStandardMaterial color="#8894a3" roughness={0.4} metalness={0.9} />
        </mesh>
      </group>
      <DatumPin position={[0.85, 0, 0.55]} color={AZURE} />
      <DatumPin position={[-0.85, 0, -0.55]} color={AZURE} />
    </Turn>
  )
}

/** Unsorted tote, vacuum head, one part lifting clear. */
export function BinPick() {
  const lift = useRef()
  const parts = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        p: [(Math.random() - 0.5) * 1.0, -0.22 + i * 0.045, (Math.random() - 0.5) * 0.8],
        r: [Math.random() * 0.4 - 0.2, Math.random() * Math.PI, Math.random() * 0.3 - 0.15],
      })),
    []
  )
  useFrame(({ clock }) => {
    if (!lift.current) return
    const k = (clock.getElapsedTime() % 4) / 4
    lift.current.position.y = 0.1 + Math.max(0, Math.sin(k * Math.PI)) * 1.0
  })

  return (
    <Turn speed={0.2}>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.9, 0.1, 1.5]} />
        <meshStandardMaterial color="#9ba6b3" roughness={0.7} metalness={0.4} />
      </mesh>
      {[[-0.95, 0], [0.95, 0], [0, -0.75], [0, 0.75]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]}>
          <boxGeometry args={[x ? 0.06 : 1.9, 0.62, z ? 0.06 : 1.5]} />
          <meshStandardMaterial color="#aab5c2" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}
      {parts.map((pt, i) => (
        <mesh key={i} position={pt.p} rotation={pt.r}>
          <boxGeometry args={[0.6, 0.05, 0.42]} />
          <meshStandardMaterial color={SKIN} roughness={0.38} metalness={0.88} />
        </mesh>
      ))}
      <group ref={lift} position={[0.1, 0.1, 0]}>
        <mesh rotation={[0, 0.3, 0.05]}>
          <boxGeometry args={[0.62, 0.05, 0.44]} />
          <meshStandardMaterial color={SKIN_LIGHT} roughness={0.32} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.4, 0.08, 0.3]} />
          <meshStandardMaterial color="#2c3642" roughness={0.45} metalness={0.5} />
        </mesh>
      </group>
    </Turn>
  )
}

export const SPECIMENS = {
  tailgate: { Component: TailgateDecking, cam: [3.1, 1.5, 4.3], anchor: [0.7, -0.45, 0.4], note: 'Latch corner' },
  weld: { Component: WeldSeam, cam: [3.0, 2.0, 3.7], anchor: [0.05, 0.2, 0], note: 'Spot schedule' },
  airframe: { Component: RibAndSkin, cam: [3.9, 1.9, 4.3], anchor: [0, 0.95, 0], note: 'Skin interface' },
  insertion: { Component: PartInsertion, cam: [2.9, 1.7, 3.7], anchor: [0, 0.35, 0], note: 'Bore clearance' },
  binpick: { Component: BinPick, cam: [3.1, 2.0, 3.5], anchor: [0.1, 0.8, 0], note: 'Pick pose' },
}
