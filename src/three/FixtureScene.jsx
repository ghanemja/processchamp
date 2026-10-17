import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Stage, { Rig, Floor } from './Stage'
import RobotArm from './RobotArm'
import { ScanCloud, DatumPin, Panel, Drift } from './Bits'
import { AZURE } from './materials'

/** The thing GeoSet AI removes: a welded steel jig, cut for exactly one part. */
function RigidFixture({ opacity }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    ref.current.visible = opacity > 0.02
    ref.current.traverse((o) => {
      if (o.material) {
        o.material.transparent = true
        o.material.opacity = opacity
      }
    })
  })
  const clamps = [
    [-1.1, 0.9, -0.55], [1.1, 0.9, -0.55],
    [-1.1, 0.9, 0.55], [1.1, 0.9, 0.55],
  ]
  return (
    <group ref={ref}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.4, 2.2]} />
        <meshStandardMaterial color="#2b3038" roughness={0.75} metalness={0.5} />
      </mesh>
      {clamps.map(([x, y, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, y / 2 + 0.2, 0]} castShadow>
            <boxGeometry args={[0.16, y, 0.16]} />
            <meshStandardMaterial color="#454c56" roughness={0.6} metalness={0.7} />
          </mesh>
          <mesh position={[0, y + 0.22, 0]} castShadow>
            <boxGeometry args={[0.3, 0.12, 0.3]} />
            <meshStandardMaterial color="#8a9099" roughness={0.4} metalness={0.85} />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.45, 0.7, 0]} castShadow>
          <boxGeometry args={[0.12, 1.0, 1.8]} />
          <meshStandardMaterial color="#343a43" roughness={0.7} metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Scene({ mode }) {
  const reduced = useReducedMotion()
  const fixtureRef = useRef()
  const partRef = useRef()
  const t = useRef(mode === 'geoset' ? 1 : 0)

  useFrame((state, delta) => {
    const goal = mode === 'geoset' ? 1 : 0
    t.current += (goal - t.current) * (1 - Math.pow(0.004, delta))
    const k = t.current
    if (fixtureRef.current) {
      fixtureRef.current.visible = k < 0.98
      fixtureRef.current.position.y = -k * 2.4
    }
    if (partRef.current) {
      partRef.current.position.y = 1.25 + k * 0.6
    }
  })

  return (
    <>
      <color attach="background" args={['#0a0c10']} />
      <fog attach="fog" args={['#0a0c10', 12, 30]} />
      <Rig />
      <Drift amount={0.05} speed={0.12}>
        <group ref={fixtureRef}>
          <RigidFixture opacity={1} />
        </group>

        <group ref={partRef} position={[0, 1.3, 0]}>
          <Panel size={[2.4, 0.07, 1.5]} />
          <DatumPin position={[-1.0, 0.09, -0.5]} />
          <DatumPin position={[1.0, 0.09, 0.5]} />
          <DatumPin position={[0, 0.09, 0.6]} />
        </group>

        {mode === 'geoset' && (
          <>
            <RobotArm program="assemble" position={[-2.1, 0, 0.8]} rotation={[0, 0.65, 0]} scale={0.95} holding={false} />
            <RobotArm program="pick" position={[2.1, 0, -0.8]} rotation={[0, -2.4, 0]} scale={0.95} holding={false} />
            <ScanCloud count={480} radius={2.4} height={2.8} />
          </>
        )}
      </Drift>
      <Floor gridArgs={[30, 30]} />
      <pointLight position={[0, 3, 0]} intensity={10} color={AZURE} distance={10} decay={2} />
      <OrbitControls
        makeDefault
        target={[0, 1.5, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.3}
        rotateSpeed={0.5}
        autoRotate={!reduced}
        autoRotateSpeed={0.4}
      />
    </>
  )
}

export default function FixtureScene({ mode = 'geoset' }) {
  return (
    <Stage camera={{ position: [5.6, 3.4, 6.2], fov: 38 }}>
      <Scene mode={mode} />
    </Stage>
  )
}
