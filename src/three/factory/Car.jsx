import { useMemo } from 'react'
import * as THREE from 'three'
import { Blob } from './World'
import { AZURE } from './layout'

const STEEL = '#a9b3c0'
const STEEL_DARK = '#808d9c'
const STEEL_LIGHT = '#c0cad6'
const WELD_FLANGE = '#93a0ae'

function roundedRect(x1, y1, x2, y2, r) {
  const s = new THREE.Path()
  s.moveTo(x1 + r, y1)
  s.lineTo(x2 - r, y1)
  s.quadraticCurveTo(x2, y1, x2, y1 + r)
  s.lineTo(x2, y2 - r)
  s.quadraticCurveTo(x2, y2, x2 - r, y2)
  s.lineTo(x1 + r, y2)
  s.quadraticCurveTo(x1, y2, x1, y2 - r)
  s.lineTo(x1, y1 + r)
  s.quadraticCurveTo(x1, y1, x1 + r, y1)
  return s
}

/**
 * Press the flat extrusion into a panel. A real body side has crown along its
 * length and tumblehome up its height; without them the extrusion reads as
 * cardboard no matter how good the outline is.
 */
function pressPanel(geo, { crown = 0.07, tumblehome = 0.16, length = 4.5, beltline = 0.85 } = {}) {
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const u = THREE.MathUtils.clamp(x / length, 0, 1)
    const bulge = Math.sin(u * Math.PI) * crown
    const lean = y > beltline ? Math.pow((y - beltline) / 0.7, 2) * tumblehome : 0
    pos.setZ(i, z + bulge - lean)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

/**
 * Body side: rocker, both wheel arches, A/B/C pillars and the roof rail, with
 * the door apertures cut as holes, then pressed.
 */
function useBodySideGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0.26, 0.1)
    s.lineTo(0.75, 0.02)
    s.absarc(1.2, 0.02, 0.45, Math.PI, 0, true)
    s.lineTo(3.0, 0.02)
    s.absarc(3.45, 0.02, 0.45, Math.PI, 0, true)
    s.lineTo(4.32, 0.02)
    s.quadraticCurveTo(4.54, 0.12, 4.52, 0.6)
    s.lineTo(4.47, 1.06)
    s.quadraticCurveTo(4.3, 1.46, 3.66, 1.53) // C-pillar
    s.lineTo(1.92, 1.55) // roof rail
    s.quadraticCurveTo(1.38, 1.52, 1.04, 1.02) // A-pillar
    s.lineTo(0.6, 0.82)
    s.quadraticCurveTo(0.3, 0.68, 0.26, 0.44)
    s.closePath()

    s.holes.push(roundedRect(1.38, 0.44, 2.52, 1.26, 0.1))
    s.holes.push(roundedRect(2.72, 0.54, 3.78, 1.26, 0.1))

    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.014,
      bevelSegments: 1,
      curveSegments: 14,
      steps: 1,
    })
    // enough lateral resolution for the press to show
    g.translate(0, 0, -0.025)
    return pressPanel(g.toNonIndexed())
  }, [])
}

function useDoorGeometry() {
  return useMemo(() => {
    const s = new THREE.Shape()
    const outer = roundedRect(0, 0, 1.2, 0.86, 0.08)
    s.curves = outer.curves
    s.autoClose = true
    s.holes.push(roundedRect(0.1, 0.46, 1.08, 0.79, 0.06))
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 1,
      curveSegments: 10,
    })
    g.center()
    g.computeVertexNormals()
    return g
  }, [])
}

export function BodySide({ z = 0.72, side = 1, visible = true, color = STEEL }) {
  const geo = useBodySideGeometry()
  return (
    <group position={[0, 0, z]} scale={[1, 1, side]} visible={visible}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} roughness={0.36} metalness={0.88} side={THREE.DoubleSide} />
      </mesh>
      {/* roof-rail weld flange — the ridge where the roof is laser-brazed on */}
      <mesh position={[2.78, 1.57, -0.03]}>
        <boxGeometry args={[1.78, 0.045, 0.05]} />
        <meshStandardMaterial color={WELD_FLANGE} roughness={0.5} metalness={0.8} />
      </mesh>
      {/* rocker section */}
      <mesh position={[2.3, 0.1, -0.05]}>
        <boxGeometry args={[3.0, 0.18, 0.14]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.42} metalness={0.85} />
      </mesh>
      {/* B-pillar reinforcement */}
      <mesh position={[2.62, 0.8, -0.04]}>
        <boxGeometry args={[0.17, 1.4, 0.1]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.4} metalness={0.86} />
      </mesh>
    </group>
  )
}

export function Door({ position = [0, 0, 0], rotation = [0, 0, 0], color = STEEL_LIGHT }) {
  const geo = useDoorGeometry()
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo}>
        <meshStandardMaterial color={color} roughness={0.32} metalness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* beltline crease and the intrusion beam behind it */}
      <mesh position={[0, 0.06, 0.03]}>
        <boxGeometry args={[1.14, 0.03, 0.02]} />
        <meshStandardMaterial color={WELD_FLANGE} roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.12, -0.03]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[1.08, 0.07, 0.05]} />
        <meshStandardMaterial color={STEEL_DARK} roughness={0.45} metalness={0.85} />
      </mesh>
      {[-0.56, 0.56].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]}>
          <boxGeometry args={[0.05, 0.3, 0.07]} />
          <meshStandardMaterial color={STEEL_DARK} roughness={0.45} metalness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

/** Wheel houses, tucked inboard of the arches. */
function WheelHouses() {
  return (
    <group>
      {[1.2, 3.45].map((x) =>
        [-1, 1].map((s) => (
          <mesh key={`${x}${s}`} position={[x, 0.02, s * 0.5]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.46, 0.46, 0.42, 20, 1, true, 0, Math.PI]} />
            <meshStandardMaterial color={STEEL_DARK} roughness={0.5} metalness={0.8} side={THREE.DoubleSide} />
          </mesh>
        ))
      )}
    </group>
  )
}

/** Floorpan, tunnel, rails, cross members, plus the front and rear structure. */
export function Underbody({ color = STEEL_DARK }) {
  return (
    <group>
      <mesh position={[2.4, 0.12, 0]}>
        <boxGeometry args={[3.5, 0.05, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.46} metalness={0.8} />
      </mesh>
      {/* rear floor step */}
      <mesh position={[4.0, 0.3, 0]}>
        <boxGeometry args={[0.85, 0.05, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.46} metalness={0.8} />
      </mesh>
      <mesh position={[3.6, 0.21, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.4, 0.05, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.46} metalness={0.8} />
      </mesh>

      {/* longitudinals, front rails and rear rails in one run */}
      {[-0.56, 0.56].map((z) => (
        <group key={z}>
          <mesh position={[2.3, 0.17, z]}>
            <boxGeometry args={[3.3, 0.15, 0.15]} />
            <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.86} />
          </mesh>
          <mesh position={[0.6, 0.34, z * 0.78]}>
            <boxGeometry args={[1.1, 0.17, 0.17]} />
            <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.86} />
          </mesh>
          <mesh position={[4.2, 0.36, z * 0.9]}>
            <boxGeometry args={[0.72, 0.15, 0.15]} />
            <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.86} />
          </mesh>
          {/* shock tower */}
          <mesh position={[0.78, 0.6, z * 1.05]}>
            <cylinderGeometry args={[0.17, 0.23, 0.56, 14]} />
            <meshStandardMaterial color={STEEL_DARK} roughness={0.45} metalness={0.84} />
          </mesh>
        </group>
      ))}

      {[1.0, 1.78, 2.66, 3.3].map((x) => (
        <mesh key={x} position={[x, 0.18, 0]}>
          <boxGeometry args={[0.14, 0.12, 1.38]} />
          <meshStandardMaterial color={STEEL} roughness={0.42} metalness={0.85} />
        </mesh>
      ))}

      {/* transmission tunnel */}
      <mesh position={[2.4, 0.22, 0]}>
        <boxGeometry args={[2.8, 0.18, 0.36]} />
        <meshStandardMaterial color={STEEL} roughness={0.4} metalness={0.85} />
      </mesh>

      {/* radiator support, cowl, bulkheads, rear panel */}
      <mesh position={[0.12, 0.52, 0]}>
        <boxGeometry args={[0.08, 0.5, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.46} metalness={0.8} />
      </mesh>
      <mesh position={[1.04, 0.62, 0]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.08, 0.76, 1.42]} />
        <meshStandardMaterial color={color} roughness={0.46} metalness={0.8} />
      </mesh>
      <mesh position={[1.02, 1.0, 0]}>
        <boxGeometry args={[0.22, 0.1, 1.44]} />
        <meshStandardMaterial color={WELD_FLANGE} roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[3.86, 0.86, 0]}>
        <boxGeometry args={[0.1, 0.6, 1.42]} />
        <meshStandardMaterial color={color} roughness={0.46} metalness={0.8} />
      </mesh>
      <mesh position={[3.84, 1.18, 0]}>
        <boxGeometry args={[0.4, 0.06, 1.44]} />
        <meshStandardMaterial color={STEEL} roughness={0.44} metalness={0.84} />
      </mesh>
      <mesh position={[4.52, 0.52, 0]}>
        <boxGeometry args={[0.07, 0.42, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.46} metalness={0.8} />
      </mesh>

      <WheelHouses />
    </group>
  )
}

/** Crowned roof panel with its bows and the header rails front and rear. */
export function Roof({ visible = true, color = STEEL_LIGHT }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.8, 1.44, 14, 10)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const crown = (1 - Math.pow(z / 0.72, 2)) * 0.055 + (1 - Math.pow(x / 0.9, 2)) * 0.02
      pos.setY(i, pos.getY(i) + crown)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <group visible={visible}>
      <mesh geometry={geo} position={[2.78, 1.52, 0]}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {[2.15, 2.78, 3.4].map((x) => (
        <mesh key={x} position={[x, 1.47, 0]}>
          <boxGeometry args={[0.08, 0.07, 1.4]} />
          <meshStandardMaterial color={STEEL_DARK} roughness={0.44} metalness={0.84} />
        </mesh>
      ))}
      {/* windshield header and backlight header */}
      <mesh position={[1.84, 1.52, 0]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.16, 0.1, 1.46]} />
        <meshStandardMaterial color={STEEL} roughness={0.42} metalness={0.86} />
      </mesh>
      <mesh position={[3.72, 1.5, 0]}>
        <boxGeometry args={[0.14, 0.1, 1.46]} />
        <meshStandardMaterial color={STEEL} roughness={0.42} metalness={0.86} />
      </mesh>
    </group>
  )
}

/** Pallet the body rides on down the line, with its locating pins. */
export function Skid({ color = '#54606e' }) {
  return (
    <group>
      <Blob position={[2.3, 0, 0]} scale={2.0} opacity={0.42} />
      <mesh position={[2.3, 0.07, 0]}>
        <boxGeometry args={[5.1, 0.14, 1.95]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.6} />
      </mesh>
      {[-0.82, 0.82].map((z) =>
        [0.7, 3.95].map((x) => (
          <mesh key={`${x}${z}`} position={[x, 0.25, z]}>
            <cylinderGeometry args={[0.045, 0.065, 0.24, 10]} />
            <meshStandardMaterial color="#2e3845" roughness={0.5} metalness={0.8} />
          </mesh>
        ))
      )}
      {[1.5, 3.1].map((x) => (
        <mesh key={x} position={[x, 0.2, 0]}>
          <boxGeometry args={[0.3, 0.12, 1.3]} />
          <meshStandardMaterial color="#49545f" roughness={0.6} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[2.3, 0.145, 0.99]}>
        <boxGeometry args={[2.4, 0.03, 0.02]} />
        <meshStandardMaterial color={AZURE} emissive={AZURE} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

/**
 * The body in white at a given point in its build. Stations further down the
 * line show it further along, so the aisle itself reads as a sequence.
 */
export default function CarBody({
  stage = 'complete',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  skid = true,
  children,
}) {
  const sides = stage === 'underbody' ? 0 : stage === 'one-side' ? 1 : 2
  const roof = stage === 'complete'

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {skid && <Skid />}
      <group position={[0, 0.14, 0]}>
        <Underbody />
        <BodySide z={0.72} side={1} visible={sides >= 1} />
        <BodySide z={-0.72} side={-1} visible={sides >= 2} />
        <Roof visible={roof} />
        {children}
      </group>
    </group>
  )
}

export { STEEL, STEEL_DARK, STEEL_LIGHT }
