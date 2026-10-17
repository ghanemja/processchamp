import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AISLE_HALF_WIDTH, BAY_HALF_DEPTH, AZURE, FLOOR_LENGTH, STATION_X, STATION_STYLE } from './layout'
import { arrowMap, brushedMap, cellMarking, concreteMap, concreteRough, gratingMap, hazardMap, paintedMap } from './textures'

/**
 * Fake contact shadow. Real shadow maps cannot cover a 290-unit aisle at a
 * useful resolution, so every machine gets a soft dark decal instead.
 */
let blobTex = null
function blobTexture() {
  if (blobTex) return blobTex
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(10,20,34,0.55)')
  grad.addColorStop(0.55, 'rgba(10,20,34,0.22)')
  grad.addColorStop(1, 'rgba(10,20,34,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  blobTex = new THREE.CanvasTexture(c)
  blobTex.colorSpace = THREE.SRGBColorSpace
  return blobTex
}

export function Blob({ position = [0, 0, 0], scale = 1, opacity = 0.5 }) {
  const tex = blobTexture()

  return (
    <mesh position={[position[0], position[1] + 0.012, position[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
      <planeGeometry args={[2.6, 2.6]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}

/** Mesh guard panels — the visual density a real cell perimeter has. */
export function Fence({ position = [0, 0, 0], rotation = [0, 0, 0], panels = 3, height = 2.1, width = 2.0 }) {
  const mesh = gratingMap({ repeat: 4 })
  const frame = paintedMap('#9aa5b3')
  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: panels }, (_, i) => {
        const x = (i - (panels - 1) / 2) * width
        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, height / 2, 0]}>
              <planeGeometry args={[width - 0.08, height - 0.2]} />
              <meshStandardMaterial map={mesh} transparent opacity={0.55} color="#8f9bab" roughness={0.75} metalness={0.4} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[(s * (width - 0.08)) / 2, height / 2, 0]}>
                <boxGeometry args={[0.07, height, 0.07]} />
                <meshStandardMaterial map={frame} color="#aab4c2" roughness={0.6} metalness={0.5} />
              </mesh>
            ))}
            <mesh position={[0, height - 0.08, 0]}>
              <boxGeometry args={[width, 0.07, 0.07]} />
              <meshStandardMaterial color="#aab4c2" roughness={0.6} metalness={0.5} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/** Painted threshold you step over to enter a cell. */
export function Threshold({ position = [0, 0, 0], width = 6, depth = 0.5, accent = AZURE }) {
  const tex = useMemo(() => hazardMap(accent, '#e8edf4', { repeat: 1 }), [accent])
  useMemo(() => {
    tex.repeat.set(width / 1.6, 1)
    return tex
  }, [tex, width])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], 0.014, position[2]]}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial map={tex} transparent opacity={0.9} />
    </mesh>
  )
}

function Floor({ reflective }) {
  const mid = FLOOR_LENGTH / 2 - 30
  const map = concreteMap({ repeat: 30 })
  const rough = concreteRough({ repeat: 30 })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0, 0]}>
        <planeGeometry args={[FLOOR_LENGTH, 54]} />
        {/* A mirror floor re-renders the whole aisle every frame; at twelve
            stations that was the entire frame budget. The concrete texture
            carries it instead. */}
        <meshStandardMaterial map={map} roughnessMap={rough} color="#9ba4b1" metalness={0.22} roughness={0.92} />
      </mesh>

      {/* aisle safety striping */}
      {[-AISLE_HALF_WIDTH, AISLE_HALF_WIDTH].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.013, z]}>
          <planeGeometry args={[FLOOR_LENGTH, 0.18]} />
          <meshBasicMaterial color="#e9eef5" transparent opacity={0.75} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mid, 0.013, 0]}>
        <planeGeometry args={[FLOOR_LENGTH, 0.1]} />
        <meshBasicMaterial color={AZURE} transparent opacity={0.4} />
      </mesh>

      {/* direction arrows so the lane reads as one flow, not twelve cells */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[mid, 0.014, 3.2]}>
        <planeGeometry args={[1.1, FLOOR_LENGTH]} />
        <meshBasicMaterial map={arrowMap({ repeat: Math.round(FLOOR_LENGTH / 9) })} transparent opacity={0.3} depthWrite={false} />
      </mesh>

      {/* a painted bay marking per station, each with its own number */}
      {STATION_X.map((x, i) => {
        const style = STATION_STYLE[i]
        if (!style) return null
        return (
          <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x - 1.4, 0.015, -7.4]}>
            <planeGeometry args={[9, 9]} />
            <meshBasicMaterial
              map={cellMarking({ number: style.number, label: style.label, accent: style.accent })}
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function Structure() {
  const bays = useMemo(() => {
    const out = []
    for (let x = -24; x < FLOOR_LENGTH - 24; x += 20) out.push(x)
    return out
  }, [])
  const painted = paintedMap('#aeb8c4', { repeat: 4 })
  const brushed = brushedMap({ repeat: 2 })

  return (
    <group>
      {bays.map((x) =>
        [-BAY_HALF_DEPTH, BAY_HALF_DEPTH].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 4.5, 0]}>
              <boxGeometry args={[0.46, 9, 0.46]} />
              <meshStandardMaterial map={painted} color="#aeb8c4" roughness={0.65} metalness={0.4} />
            </mesh>
            {/* base plate and guard bollard */}
            <mesh position={[0, 0.06, 0]}>
              <boxGeometry args={[0.9, 0.12, 0.9]} />
              <meshStandardMaterial color="#8a95a3" roughness={0.8} metalness={0.4} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.26, 0.3, 0.9, 16]} />
              <meshStandardMaterial map={brushed} color="#c3cbd5" roughness={0.45} metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.72, 0]}>
              <cylinderGeometry args={[0.265, 0.265, 0.12, 16]} />
              <meshStandardMaterial color="#0a0f18" emissive={AZURE} emissiveIntensity={1.6} roughness={0.4} />
            </mesh>
          </group>
        ))
      )}

      {/* roof trusses */}
      {bays.map((x) => (
        <mesh key={`t${x}`} position={[x, 9, 0]}>
          <boxGeometry args={[0.3, 0.3, BAY_HALF_DEPTH * 2]} />
          <meshStandardMaterial color="#9aa5b2" roughness={0.8} metalness={0.35} />
        </mesh>
      ))}
      {[-BAY_HALF_DEPTH, BAY_HALF_DEPTH].map((z) => (
        <mesh key={`r${z}`} position={[FLOOR_LENGTH / 2 - 30, 9.1, z]}>
          <boxGeometry args={[FLOOR_LENGTH, 0.34, 0.34]} />
          <meshStandardMaterial color="#9aa5b2" roughness={0.8} metalness={0.35} />
        </mesh>
      ))}

      {/* cable tray and compressed-air main — the services that make it a plant */}
      {[-BAY_HALF_DEPTH + 0.8, BAY_HALF_DEPTH - 0.8].map((z) => (
        <group key={`svc${z}`}>
          <mesh position={[FLOOR_LENGTH / 2 - 30, 7.5, z]}>
            <boxGeometry args={[FLOOR_LENGTH, 0.22, 0.5]} />
            <meshStandardMaterial color="#7f8b99" roughness={0.75} metalness={0.5} />
          </mesh>
          <mesh position={[FLOOR_LENGTH / 2 - 30, 7.1, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, FLOOR_LENGTH, 10]} />
            <meshStandardMaterial color="#6f7d8d" roughness={0.45} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* roof glazing */}
      {bays
        .filter((_, i) => i % 2 === 0)
        .map((x) => (
          <group key={`l${x}`} position={[x, 8.6, 0]}>
            <mesh>
              <boxGeometry args={[3.4, 0.1, 5.2]} />
              <meshBasicMaterial color="#e9f0f8" />
            </mesh>
            <mesh position={[0, -0.06, 0]}>
              <boxGeometry args={[3.2, 0.02, 5.0]} />
              <meshBasicMaterial color="#dfe9f4" />
            </mesh>
            {[-2.4, 0, 2.4].map((z) => (
              <mesh key={z} position={[0, 0.02, z]}>
                <boxGeometry args={[3.5, 0.12, 0.1]} />
                <meshStandardMaterial color="#c6cfd9" roughness={0.7} metalness={0.3} />
              </mesh>
            ))}
          </group>
        ))}
    </group>
  )
}

/** Dim silhouettes outside the aisle so the bay does not end in empty space. */
function Backdrop() {
  const painted = paintedMap('#b4bdc8', { repeat: 2 })
  const racks = useMemo(() => {
    const out = []
    for (let x = -18; x < FLOOR_LENGTH - 30; x += 22) {
      out.push({ x, z: -(BAY_HALF_DEPTH + 4 + ((x * 7) % 5)), h: 3 + ((x * 3) % 3) })
      out.push({ x: x + 7, z: BAY_HALF_DEPTH + 4 + ((x * 11) % 5), h: 2.6 + ((x * 5) % 3) })
    }
    return out
  }, [])

  return (
    <group>
      {racks.map((r, i) => (
        <mesh key={i} position={[r.x, r.h / 2, r.z]}>
          <boxGeometry args={[5.5, r.h, 2.4]} />
          <meshStandardMaterial map={painted} color="#b4bdc8" roughness={0.9} metalness={0.15} />
        </mesh>
      ))}
    </group>
  )
}

/** Carriers running the line, so the floor is never still. */
function Conveyor() {
  const ref = useRef()
  const count = 18
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const x = (((i / count) * FLOOR_LENGTH + t * 2.2) % FLOOR_LENGTH) - 26
      dummy.position.set(x, 1.08, -8.2)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <mesh position={[FLOOR_LENGTH / 2 - 30, 0.95, -8.2]}>
        <boxGeometry args={[FLOOR_LENGTH, 0.18, 1.5]} />
        <meshStandardMaterial map={brushedMap({ repeat: 60 })} color="#9fa9b6" roughness={0.45} metalness={0.72} />
      </mesh>
      <mesh position={[FLOOR_LENGTH / 2 - 30, 0.45, -8.2]}>
        <boxGeometry args={[FLOOR_LENGTH, 0.1, 0.3]} />
        <meshStandardMaterial color="#7e8a97" roughness={0.85} />
      </mesh>
      <instancedMesh ref={ref} args={[null, null, count]}>
        <boxGeometry args={[1.1, 0.12, 0.8]} />
        <meshStandardMaterial color="#9aa4b1" roughness={0.42} metalness={0.82} />
      </instancedMesh>
    </group>
  )
}

export default function World({ reflective = true }) {
  return (
    <group>
      <Floor reflective={reflective} />
      <Structure />
      <BackWall />
      <BaySigns />
      <Monorail />
      <TransferLine />
      <Backdrop />
      <Conveyor />
    </group>
  )
}

/**
 * The thing that makes it one line rather than twelve rooms: a skid conveyor
 * running the whole length at the centre of the aisle, with bodies on it
 * between the stations as well as in them.
 */
function TransitBody({ color = '#a4aebc' }) {
  return (
    <group>
      {/* skid */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[4.6, 0.13, 1.8]} />
        <meshStandardMaterial color="#54606e" roughness={0.65} metalness={0.55} />
      </mesh>
      {/* simplified body: rockers, sides, roof, rear */}
      {[-0.72, 0.72].map((z) => (
        <group key={z}>
          {/* rocker, sill-to-belt panel, pillars and roof rail rather than one slab */}
          <mesh position={[0.1, 0.58, z]}>
            <boxGeometry args={[4.1, 0.34, 0.07]} />
            <meshStandardMaterial color="#8a96a5" roughness={0.42} metalness={0.84} />
          </mesh>
          <mesh position={[0.1, 1.62, z]}>
            <boxGeometry args={[3.5, 0.16, 0.07]} />
            <meshStandardMaterial color={color} roughness={0.36} metalness={0.88} />
          </mesh>
          {[-1.5, 0.15, 1.5].map((px) => (
            <mesh key={px} position={[0.1 + px, 1.16, z]}>
              <boxGeometry args={[0.22, 0.95, 0.07]} />
              <meshStandardMaterial color={color} roughness={0.36} metalness={0.88} />
            </mesh>
          ))}
          <mesh position={[-1.75, 1.2, z]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[0.2, 1.0, 0.07]} />
            <meshStandardMaterial color={color} roughness={0.36} metalness={0.88} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.1, 0.47, 0]}>
        <boxGeometry args={[3.9, 0.22, 1.45]} />
        <meshStandardMaterial color="#828e9d" roughness={0.45} metalness={0.8} />
      </mesh>
      <mesh position={[0.5, 1.72, 0]}>
        <boxGeometry args={[1.8, 0.06, 1.45]} />
        <meshStandardMaterial color="#bcc6d3" roughness={0.32} metalness={0.9} />
      </mesh>
      <mesh position={[2.05, 1.0, 0]}>
        <boxGeometry args={[0.08, 1.1, 1.45]} />
        <meshStandardMaterial color="#828e9d" roughness={0.45} metalness={0.8} />
      </mesh>
    </group>
  )
}

export function TransferLine() {
  const span = FLOOR_LENGTH
  // Loaded skids park between the bays. They used to travel the length of the
  // track, which drove them straight through the bodies parked in each cell.
  const parked = useMemo(
    () => STATION_X.slice(0, -1).map((x, i) => x + 10).filter((_, i) => i % 2 === 0),
    []
  )

  return (
    <group>
      {/* rails and rollers, continuous from one end to the other */}
      {[-0.86, 0.86].map((z) => (
        <group key={z}>
          <mesh position={[span / 2 - 30, 0.2, z]}>
            <boxGeometry args={[span, 0.14, 0.26]} />
            <meshStandardMaterial map={brushedMap({ repeat: 80 })} color="#97a2b0" roughness={0.42} metalness={0.82} />
          </mesh>
          <mesh position={[span / 2 - 30, 0.07, z]}>
            <boxGeometry args={[span, 0.14, 0.5]} />
            <meshStandardMaterial color="#79848f" roughness={0.75} metalness={0.5} />
          </mesh>
        </group>
      ))}
      {/* cross sleepers */}
      {Array.from({ length: Math.floor(span / 4) }, (_, i) => (
        <mesh key={i} position={[i * 4 - 28, 0.08, 0]}>
          <boxGeometry args={[0.22, 0.1, 2.1]} />
          <meshStandardMaterial color="#8a95a3" roughness={0.8} metalness={0.4} />
        </mesh>
      ))}

      {/* the line is loaded end to end, not just where the camera stops */}
      {parked.map((x) => (
        <group key={x} position={[x - 2.3, 0.08, 0]}>
          <TransitBody />
        </group>
      ))}
    </group>
  )
}

/**
 * One continuous back wall for the whole hall, panelled in each bay's colour.
 * Per-bay enclosures made the aisle read as a row of separate rooms.
 */
export function BackWall({ z = -7.6, height = 4.2 }) {
  const painted = paintedMap('#aab5c3', { repeat: 6 })
  return (
    <group>
      <mesh position={[FLOOR_LENGTH / 2 - 30, height / 2, z]}>
        <planeGeometry args={[FLOOR_LENGTH, height]} />
        <meshStandardMaterial map={painted} color="#aab5c3" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* each bay paints its own panel and accent band onto the shared wall */}
      {STATION_X.map((x, i) => {
        const style = STATION_STYLE[i]
        if (!style) return null
        return (
          <group key={x} position={[x, 0, z + 0.04]}>
            <mesh position={[0, height / 2 - 0.3, 0]}>
              <planeGeometry args={[14, height - 0.6]} />
              <meshStandardMaterial color={style.light} roughness={0.95} transparent opacity={0.3} />
            </mesh>
            <mesh position={[0, height - 0.45, 0.01]}>
              <planeGeometry args={[14, 0.22]} />
              <meshStandardMaterial color={style.accent} emissive={style.accent} emissiveIntensity={0.25} roughness={0.6} />
            </mesh>
          </group>
        )
      })}
      {/* kick rail the full length */}
      <mesh position={[FLOOR_LENGTH / 2 - 30, 0.18, z + 0.06]}>
        <boxGeometry args={[FLOOR_LENGTH, 0.36, 0.1]} />
        <meshStandardMaterial color="#79838f" roughness={0.9} />
      </mesh>
    </group>
  )
}

/** Overhead monorail with hangers — another line that never breaks. */
export function Monorail({ y = 6.2, z = 3.4, carriers = 6 }) {
  const span = FLOOR_LENGTH
  const group = useRef()

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime() * 1.6
    group.current.children.forEach((c, i) => {
      c.position.x = span - 30 - (((i / carriers) * span + t) % span)
    })
  })

  return (
    <group>
      {/* empty carriers returning to the head of the line */}
      <group ref={group}>
        {Array.from({ length: carriers }, (_, i) => (
          <group key={i} position={[0, y - 0.3, z]}>
            <mesh>
              <boxGeometry args={[0.5, 0.26, 0.3]} />
              <meshStandardMaterial color="#79848f" roughness={0.5} metalness={0.7} />
            </mesh>
            {[-0.5, 0.5].map((dz) => (
              <mesh key={dz} position={[0, -0.6, dz]}>
                <boxGeometry args={[0.06, 1.0, 0.06]} />
                <meshStandardMaterial color="#8d98a6" roughness={0.6} metalness={0.6} />
              </mesh>
            ))}
            <mesh position={[0, -1.14, 0]}>
              <boxGeometry args={[1.9, 0.12, 1.3]} />
              <meshStandardMaterial color="#54606e" roughness={0.65} metalness={0.55} />
            </mesh>
          </group>
        ))}
      </group>
      <mesh position={[span / 2 - 30, y, z]}>
        <boxGeometry args={[span, 0.3, 0.22]} />
        <meshStandardMaterial color="#8d98a6" roughness={0.6} metalness={0.6} />
      </mesh>
      {Array.from({ length: Math.floor(span / 10) }, (_, i) => (
        <mesh key={i} position={[i * 10 - 26, y + 1.4, z]}>
          <boxGeometry args={[0.12, 2.8, 0.12]} />
          <meshStandardMaterial color="#9aa5b2" roughness={0.7} metalness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Identical sign gantries over every bay entrance. Repetition at a fixed pitch
 * is what tells your eye this is one line — you can see the next three bay
 * numbers down the aisle from wherever you are standing.
 */
function signTexture(number, label, accent) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = '#10171f'
  g.fillRect(0, 0, 512, 128)
  g.fillStyle = accent
  g.fillRect(0, 0, 14, 128)
  g.fillStyle = '#ffffff'
  g.font = '700 74px Archivo, Helvetica, Arial, sans-serif'
  g.textAlign = 'left'
  g.fillText(number, 36, 94)
  g.fillStyle = accent
  g.font = '500 34px "IBM Plex Mono", monospace'
  g.fillText(label, 150, 84)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

export function BaySigns({ y = 5.2 }) {
  const signs = useMemo(
    () =>
      STATION_X.map((x, i) => {
        const style = STATION_STYLE[i]
        return style ? { x, style, tex: signTexture(style.number, style.label, style.accent) } : null
      }).filter(Boolean),
    []
  )

  return (
    <group>
      {signs.map(({ x, style, tex }) => (
        <group key={x} position={[x - 9, 0, 0]}>
          {[-AISLE_HALF_WIDTH - 0.6, AISLE_HALF_WIDTH + 0.6].map((z) => (
            <mesh key={z} position={[0, y / 2, z]}>
              <boxGeometry args={[0.18, y, 0.18]} />
              <meshStandardMaterial color="#9aa5b2" roughness={0.65} metalness={0.5} />
            </mesh>
          ))}
          <mesh position={[0, y, 0]}>
            <boxGeometry args={[0.22, 0.22, AISLE_HALF_WIDTH * 2 + 1.4]} />
            <meshStandardMaterial color="#8d98a6" roughness={0.6} metalness={0.6} />
          </mesh>
          <mesh position={[0, y - 0.52, 0]}>
            <boxGeometry args={[0.1, 0.8, 3.2]} />
            <meshStandardMaterial color="#10171f" roughness={0.7} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.055, y - 0.52, 0]} rotation={[0, s * (Math.PI / 2), 0]}>
              <planeGeometry args={[3.2, 0.8]} />
              <meshBasicMaterial map={tex} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0, y - 1.0, 0]}>
            <boxGeometry args={[0.14, 0.06, 3.0]} />
            <meshStandardMaterial color={style.accent} emissive={style.accent} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
