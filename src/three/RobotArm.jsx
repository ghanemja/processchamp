import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { AZURE } from './materials'

const SHELL = '#e9eef5'
const SHELL_DARK = '#aeb9c9'
const JOINT = '#1a2130'
const CARBON = '#0f141c'

/** Drag chain running up the forearm — the detail that reads as "real robot". */
function CableCarrier({ length = 1.0, links = 9, radius = 0.1 }) {
  const items = useMemo(
    () =>
      Array.from({ length: links }, (_, i) => {
        const t = i / (links - 1)
        return {
          y: t * length,
          z: radius + Math.sin(t * Math.PI) * radius * 1.6,
          rx: Math.cos(t * Math.PI) * 0.5,
        }
      }),
    [length, links, radius]
  )
  return (
    <group>
      {items.map((l, i) => (
        <RoundedBox key={i} args={[0.09, 0.075, 0.07]} radius={0.015} smoothness={2} position={[0, l.y, l.z]} rotation={[l.rx, 0, 0]}>
          <meshStandardMaterial color={CARBON} roughness={0.75} metalness={0.3} />
        </RoundedBox>
      ))}
    </group>
  )
}

/** Two-finger parallel gripper with visible knuckles. */
function Gripper({ openRef }) {
  const l = useRef()
  const r = useRef()
  useFrame(() => {
    const open = openRef?.current ?? 0.06
    if (l.current) l.current.position.x = open
    if (r.current) r.current.position.x = -open
  })
  return (
    <group>
      <RoundedBox args={[0.34, 0.16, 0.26]} radius={0.03} smoothness={3} position={[0, 0.08, 0]}>
        <meshStandardMaterial color={JOINT} roughness={0.5} metalness={0.6} />
      </RoundedBox>
      {[l, r].map((ref, i) => (
        <group key={i} ref={ref} position={[i ? -0.06 : 0.06, 0.26, 0]}>
          <RoundedBox args={[0.065, 0.3, 0.17]} radius={0.015} smoothness={2}>
            <meshStandardMaterial color={SHELL_DARK} roughness={0.35} metalness={0.9} />
          </RoundedBox>
          <mesh position={[i ? 0.04 : -0.04, -0.08, 0]}>
            <boxGeometry args={[0.02, 0.1, 0.14]} />
            <meshStandardMaterial color={CARBON} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Spot-weld gun: two electrode arms with a glowing tip. */
function WeldGun() {
  const tip = useRef()
  useFrame(({ clock }) => {
    if (!tip.current) return
    const t = clock.getElapsedTime()
    const on = Math.sin(t * 1.6) > 0.25
    tip.current.material.emissiveIntensity = on ? 2 + Math.random() * 6 : 0.05
  })
  return (
    <group>
      <RoundedBox args={[0.3, 0.26, 0.24]} radius={0.04} smoothness={3} position={[0, 0.12, 0]}>
        <meshStandardMaterial color={JOINT} roughness={0.45} metalness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0.34, 0.1]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.035, 0.3, 4, 10]} />
        <meshStandardMaterial color={SHELL_DARK} roughness={0.3} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.34, -0.1]} rotation={[-0.3, 0, 0]}>
        <capsuleGeometry args={[0.035, 0.3, 4, 10]} />
        <meshStandardMaterial color={SHELL_DARK} roughness={0.3} metalness={0.95} />
      </mesh>
      <mesh ref={tip} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.05, 14, 14]} />
        <meshStandardMaterial color="#1a1206" emissive="#ffd9a0" emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[-0.14, 0.2, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 10]} />
        <meshStandardMaterial color={CARBON} roughness={0.85} />
      </mesh>
    </group>
  )
}

/** Vacuum array for sheet handling out of a tote. */
function VacuumHead({ cups = 4 }) {
  return (
    <group>
      <RoundedBox args={[0.5, 0.09, 0.34]} radius={0.025} smoothness={2} position={[0, 0.1, 0]}>
        <meshStandardMaterial color={JOINT} roughness={0.5} metalness={0.6} />
      </RoundedBox>
      {Array.from({ length: cups }, (_, i) => {
        const x = -0.17 + (i % 2) * 0.34
        const z = -0.1 + Math.floor(i / 2) * 0.2
        return (
          <group key={i} position={[x, 0.02, z]}>
            <mesh>
              <cylinderGeometry args={[0.035, 0.035, 0.1, 10]} />
              <meshStandardMaterial color={SHELL_DARK} roughness={0.4} metalness={0.8} />
            </mesh>
            <mesh position={[0, -0.07, 0]}>
              <coneGeometry args={[0.06, 0.08, 14, 1, true]} />
              <meshStandardMaterial color="#20262f" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/** Wrist-mounted 3D scanner: stereo pair plus a projector window. */
function ScannerHead({ color = '#39d0ff' }) {
  return (
    <group>
      <RoundedBox args={[0.56, 0.18, 0.2]} radius={0.035} smoothness={3} position={[0, 0.12, 0]}>
        <meshStandardMaterial color={CARBON} roughness={0.45} metalness={0.5} />
      </RoundedBox>
      {[-0.19, 0.19].map((x) => (
        <mesh key={x} position={[x, 0.12, 0.11]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.055, 0.06, 16]} />
          <meshStandardMaterial color="#05121a" emissive={color} emissiveIntensity={2.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.12, 0.11]}>
        <planeGeometry args={[0.16, 0.08]} />
        <meshStandardMaterial color="#061018" emissive={color} emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

const TOOLS = { gripper: Gripper, weld: WeldGun, vacuum: VacuumHead, scanner: ScannerHead }

/**
 * Procedural 6-axis articulated arm. No external model files, so it always
 * loads. `program` selects the motion cycle, `tool` the end effector.
 */
export default function RobotArm({
  program = 'assemble',
  tool = 'gripper',
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  accent = AZURE,
  holding = false,
  liveryDark = false,
}) {
  const yaw = useRef()
  const shoulder = useRef()
  const elbow = useRef()
  const wrist = useRef()
  const roll = useRef()
  const gripRef = useRef(0.06)
  const shell = liveryDark ? '#7e8b9e' : SHELL

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    let a, b, c, d, grip

    if (program === 'scan') {
      a = Math.sin(t * 0.45) * 0.85
      b = -0.3 + Math.sin(t * 0.6) * 0.14
      c = 0.72 + Math.cos(t * 0.6) * 0.18
      d = -0.36 + Math.sin(t * 0.6) * 0.1
      grip = 0.16
    } else if (program === 'pick') {
      const p = (Math.sin(t * 0.5) + 1) / 2
      a = -0.9 + p * 1.8
      b = -0.12 - p * 0.34
      c = 0.45 + p * 0.42
      d = -0.32 + p * 0.1
      grip = 0.05 + (1 - p) * 0.12
    } else {
      // assemble: slow approach, fine-align dwell, retract
      const cycle = (t * 0.22) % 1
      const ease = cycle < 0.5 ? cycle * 2 : (1 - cycle) * 2
      const micro = Math.sin(t * 6) * 0.012 * (cycle > 0.35 && cycle < 0.65 ? 1 : 0)
      a = Math.sin(t * 0.3) * 0.55 + micro
      b = -0.16 - ease * 0.22
      c = 0.5 + ease * 0.34
      d = -0.3 - ease * 0.12
      grip = 0.055
    }

    if (yaw.current) yaw.current.rotation.y = a
    if (shoulder.current) shoulder.current.rotation.z = b
    if (elbow.current) elbow.current.rotation.z = c
    if (wrist.current) wrist.current.rotation.z = d
    if (roll.current) roll.current.rotation.y = Math.sin(t * 0.8) * 0.4
    gripRef.current = grip
  })

  const Tool = TOOLS[tool] ?? Gripper

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* pedestal with cable gland */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.07, 40]} />
        <meshStandardMaterial color="#19202b" roughness={0.65} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.085, 0]}>
        <cylinderGeometry args={[0.52, 0.62, 0.04, 40]} />
        <meshStandardMaterial color="#232c38" roughness={0.6} metalness={0.55} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos((i / 4) * Math.PI * 2) * 0.5, 0.11, Math.sin((i / 4) * Math.PI * 2) * 0.5]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
          <meshStandardMaterial color={CARBON} roughness={0.8} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.215, 0]}>
        <cylinderGeometry args={[0.44, 0.44, 0.23, 32]} />
        <meshStandardMaterial color={shell} roughness={0.3} metalness={0.88} />
      </mesh>
      <mesh position={[0, 0.335, 0]}>
        <torusGeometry args={[0.44, 0.022, 8, 32]} />
        <meshStandardMaterial color="#232c38" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[0.36, 0.18, 0.2]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 10]} />
        <meshStandardMaterial color={CARBON} roughness={0.85} />
      </mesh>

      <group ref={yaw} position={[0, 0.3, 0]}>
        {/* J1 turret */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.34, 0.4, 0.44, 28]} />
          <meshStandardMaterial color={shell} roughness={0.26} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <torusGeometry args={[0.345, 0.02, 10, 36]} />
          <meshStandardMaterial color="#0b0f16" emissive={accent} emissiveIntensity={1.8} roughness={0.4} />
        </mesh>
        {/* shoulder yoke */}
        {[-0.19, 0.19].map((z) => (
          <mesh key={z} position={[0, 0.5, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.1, 20]} />
            <meshStandardMaterial color={JOINT} roughness={0.45} metalness={0.75} />
          </mesh>
        ))}

        <group ref={shoulder} position={[0, 0.5, 0]}>
          {/* J2 upper arm: twin plates with a rib between */}
          {[-0.14, 0.14].map((z) => (
            <RoundedBox key={z} args={[0.22, 1.3, 0.1]} radius={0.04} smoothness={3} position={[0, 0.62, z]}>
              <meshStandardMaterial color={shell} roughness={0.28} metalness={0.88} />
            </RoundedBox>
          ))}
          <mesh position={[0, 0.62, 0]}>
            <boxGeometry args={[0.13, 1.1, 0.2]} />
            <meshStandardMaterial color={JOINT} roughness={0.6} metalness={0.5} />
          </mesh>
          <RoundedBox args={[0.1, 0.62, 0.03]} radius={0.012} smoothness={2} position={[0, 0.66, 0.2]}>
            <meshStandardMaterial color="#0b0f16" emissive={accent} emissiveIntensity={1.1} />
          </RoundedBox>

          <group ref={elbow} position={[0, 1.26, 0]}>
            {/* J3 elbow casting */}
            <mesh>
              <sphereGeometry args={[0.235, 26, 20]} />
              <meshStandardMaterial color={JOINT} roughness={0.42} metalness={0.72} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.2, 0.028, 10, 28]} />
              <meshStandardMaterial color={shell} roughness={0.3} metalness={0.9} />
            </mesh>

            {/* forearm */}
            <RoundedBox args={[0.23, 1.02, 0.24]} radius={0.05} smoothness={3} position={[0, 0.52, 0]}>
              <meshStandardMaterial color={shell} roughness={0.28} metalness={0.88} />
            </RoundedBox>
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[0.245, 0.14, 0.245]} />
              <meshStandardMaterial color={accent} roughness={0.4} metalness={0.4} />
            </mesh>
            <group position={[0, 0.06, 0.12]}>
              <CableCarrier length={0.92} />
            </group>

            <group ref={wrist} position={[0, 1.04, 0]}>
              {/* J4 */}
              <mesh>
                <cylinderGeometry args={[0.16, 0.16, 0.26, 22]} />
                <meshStandardMaterial color={JOINT} roughness={0.45} metalness={0.72} />
              </mesh>
              {/* J5 */}
              <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[0.135, 20, 16]} />
                <meshStandardMaterial color={shell} roughness={0.3} metalness={0.88} />
              </mesh>
              {/* J6 roll + tool flange */}
              <group ref={roll} position={[0, 0.3, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.12, 0.12, 0.1, 20]} />
                  <meshStandardMaterial color={SHELL_DARK} roughness={0.3} metalness={0.92} />
                </mesh>
                <group position={[0, 0.05, 0]}>
                  <Tool openRef={gripRef} />
                </group>
                {holding && (
                  <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[0.9, 0.06, 0.62]} />
                    <meshStandardMaterial color="#8d949d" roughness={0.42} metalness={0.8} />
                  </mesh>
                )}
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
