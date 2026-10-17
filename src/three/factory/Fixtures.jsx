import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Blob } from './World'
import { brushedMap, gratingMap, paintedMap } from './textures'
import { ALERT, AZURE, CYAN, GREEN } from './layout'

/** Painted enclosure walls — what actually makes one bay read differently. */
export function Enclosure({
  position = [0, 0, 0],
  size = [9, 3.4, 8],
  color = '#b7c1cd',
  accent = AZURE,
  open = 'front',
  roof = false,
  backWall = true,
}) {
  const [w, h, d] = size
  const painted = paintedMap(color, { repeat: 3 })

  const wall = (key, pos, rot, len) => (
    <mesh key={key} position={pos} rotation={rot}>
      <planeGeometry args={[len, h]} />
      <meshStandardMaterial map={painted} color={color} roughness={0.85} metalness={0.15} side={THREE.DoubleSide} />
    </mesh>
  )

  return (
    <group position={position}>
      {backWall && wall('back', [0, h / 2, -d / 2], [0, 0, 0], w)}
      {open !== 'left' && wall('left', [-w / 2, h / 2, 0], [0, Math.PI / 2, 0], d)}
      {open !== 'right' && wall('right', [w / 2, h / 2, 0], [0, -Math.PI / 2, 0], d)}
      {roof && (
        <mesh position={[0, h, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}
      {backWall && (
        <>
          <mesh position={[0, h - 0.3, -d / 2 + 0.02]}>
            <planeGeometry args={[w, 0.16]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.25} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.16, -d / 2 + 0.03]}>
            <boxGeometry args={[w, 0.3, 0.08]} />
            <meshStandardMaterial color="#79838f" roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  )
}

/** Weld curtains: the translucent amber strips every weld cell is hung with. */
export function WeldCurtains({ position = [0, 0, 0], rotation = [0, 0, 0], width = 7, height = 2.6, strips = 9 }) {
  const group = useRef()
  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.children.forEach((c, i) => {
      c.rotation.y = Math.sin(t * 0.7 + i * 0.6) * 0.035
    })
  })
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height + 0.08, 0]}>
        <boxGeometry args={[width + 0.3, 0.1, 0.12]} />
        <meshStandardMaterial color="#8d98a6" roughness={0.6} metalness={0.6} />
      </mesh>
      <group ref={group}>
        {Array.from({ length: strips }, (_, i) => {
          const x = (i - (strips - 1) / 2) * (width / strips)
          return (
            <mesh key={i} position={[x, height / 2, 0]}>
              <planeGeometry args={[width / strips - 0.015, height]} />
              <meshStandardMaterial
                color="#e07a3c"
                transparent
                opacity={0.42}
                roughness={0.55}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

/** Glazed control room: the solver has to live somewhere. */
export function ControlRoom({ position = [0, 0, 0], rotation = [0, 0, 0], width = 6.5, depth = 3.4, height = 3 }) {
  const screens = useRef([])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    screens.current.forEach((m, i) => {
      if (m) m.material.emissiveIntensity = 0.9 + Math.sin(t * 2 + i) * 0.35
    })
  })

  return (
    <group position={position} rotation={rotation}>
      <Blob scale={2.4} opacity={0.42} />
      {/* plinth */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[width + 0.4, 0.24, depth + 0.4]} />
        <meshStandardMaterial color="#8d98a6" roughness={0.8} metalness={0.3} />
      </mesh>
      {/* glazing */}
      <mesh position={[0, height / 2 + 0.24, depth / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#cfe3f7" transparent opacity={0.22} roughness={0.1} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * width) / 2, height / 2 + 0.24, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[depth, height]} />
          <meshStandardMaterial color="#cfe3f7" transparent opacity={0.18} roughness={0.1} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* mullions */}
      {[-width / 2, -width / 6, width / 6, width / 2].map((x) => (
        <mesh key={x} position={[x, height / 2 + 0.24, depth / 2]}>
          <boxGeometry args={[0.08, height, 0.1]} />
          <meshStandardMaterial color="#79848f" roughness={0.6} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, height + 0.26, 0]}>
        <boxGeometry args={[width + 0.3, 0.14, depth + 0.3]} />
        <meshStandardMaterial color="#aeb8c4" roughness={0.8} metalness={0.3} />
      </mesh>
      {/* wall of screens inside */}
      {[-1.6, 0, 1.6].map((x, i) => (
        <mesh key={x} ref={(el) => (screens.current[i] = el)} position={[x, 1.6, -depth / 2 + 0.12]}>
          <boxGeometry args={[1.35, 0.8, 0.06]} />
          <meshStandardMaterial color="#121a24" emissive={CYAN} emissiveIntensity={1} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.85, -depth / 2 + 0.5]}>
        <boxGeometry args={[width - 1.2, 0.08, 0.7]} />
        <meshStandardMaterial map={brushedMap({ repeat: 3 })} color="#c3ccd6" roughness={0.45} metalness={0.7} />
      </mesh>
    </group>
  )
}

/** Pallet racking — the press shop's output waiting its turn. */
export function Racking({ position = [0, 0, 0], rotation = [0, 0, 0], bays = 3, height = 4.2, children }) {
  const painted = paintedMap('#c9801b', { repeat: 2 })
  return (
    <group position={position} rotation={rotation}>
      <Blob position={[(bays * 2.4) / 2 - 1.2, 0, 0]} scale={2.2} opacity={0.38} />
      {Array.from({ length: bays + 1 }, (_, i) => (
        <group key={i} position={[i * 2.4, 0, 0]}>
          {[-0.65, 0.65].map((z) => (
            <mesh key={z} position={[0, height / 2, z]}>
              <boxGeometry args={[0.16, height, 0.16]} />
              <meshStandardMaterial map={painted} color="#c9801b" roughness={0.65} metalness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, height * 0.55, 0]}>
            <boxGeometry args={[0.1, 0.1, 1.4]} />
            <meshStandardMaterial color="#a5a0a0" roughness={0.7} metalness={0.4} />
          </mesh>
        </group>
      ))}
      {[0.9, 2.3].map((y) => (
        <group key={y}>
          {[-0.65, 0.65].map((z) => (
            <mesh key={z} position={[(bays * 2.4) / 2, y, z]}>
              <boxGeometry args={[bays * 2.4 + 0.3, 0.14, 0.1]} />
              <meshStandardMaterial color="#1b5fb8" roughness={0.6} metalness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
      {children}
    </group>
  )
}

/** Hanging fabric banner with real lettering. */
export function Banner({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 5,
  height = 1.6,
  title = '',
  sub = '',
  bg = '#0d5fc4',
  fg = '#ffffff',
}) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = Math.round((1024 * height) / width)
    const g = c.getContext('2d')
    g.fillStyle = bg
    g.fillRect(0, 0, c.width, c.height)
    g.fillStyle = 'rgba(255,255,255,0.1)'
    g.fillRect(0, c.height - 10, c.width, 10)
    g.fillStyle = fg
    g.textAlign = 'center'
    g.font = `700 ${Math.round(c.height * 0.4)}px Archivo, Helvetica, Arial, sans-serif`
    g.fillText(title, c.width / 2, c.height * 0.52)
    if (sub) {
      g.globalAlpha = 0.75
      g.font = `500 ${Math.round(c.height * 0.14)}px "IBM Plex Mono", monospace`
      g.fillText(sub, c.width / 2, c.height * 0.78)
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
    return t
  }, [title, sub, bg, fg, width, height])

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height / 2 + 0.1, 0]}>
        <boxGeometry args={[width + 0.4, 0.08, 0.08]} />
        <meshStandardMaterial color="#8d98a6" roughness={0.6} metalness={0.6} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={tex} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/** Free-standing info pylon with a lit face — one per benefit / product. */
export function Pylon({ position = [0, 0, 0], rotation = [0, 0, 0], accent = AZURE, label = '', value = '', height = 2.4 }) {
  const face = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 384
    const g = c.getContext('2d')
    g.fillStyle = '#0e1620'
    g.fillRect(0, 0, 256, 384)
    g.fillStyle = accent
    g.fillRect(0, 0, 256, 8)
    g.globalAlpha = 0.16
    for (let y = 40; y < 384; y += 14) {
      g.fillStyle = '#ffffff'
      g.fillRect(16, y, 224, 1)
    }
    g.globalAlpha = 1
    g.fillStyle = accent
    g.font = '700 86px Archivo, Helvetica, Arial, sans-serif'
    g.textAlign = 'center'
    g.fillText(value, 128, 150)
    g.fillStyle = 'rgba(255,255,255,0.8)'
    g.font = '500 22px "IBM Plex Mono", monospace'
    g.fillText(label, 128, 200)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [accent, label, value])

  return (
    <group position={position} rotation={rotation}>
      <Blob scale={0.5} opacity={0.42} />
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.8, 0.12, 0.6]} />
        <meshStandardMaterial color="#8d98a6" roughness={0.8} metalness={0.3} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.72, height, 0.26]} />
        <meshStandardMaterial map={brushedMap({ repeat: 1 })} color="#c3ccd6" roughness={0.45} metalness={0.7} />
      </mesh>
      <mesh position={[0, height * 0.62, 0.14]}>
        <planeGeometry args={[0.6, 0.9]} />
        <meshBasicMaterial map={face} toneMapped={false} />
      </mesh>
    </group>
  )
}

/**
 * The one person on the floor. Deliberately a stylised mannequin — a realistic
 * face at this fidelity lands in the uncanny valley and reads worse.
 */
export function Operator({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const body = useRef()
  const tablet = useRef()
  const armR = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (body.current) {
      body.current.position.y = Math.sin(t * 1.1) * 0.012
      body.current.rotation.y = Math.sin(t * 0.32) * 0.07
    }
    if (tablet.current) tablet.current.rotation.x = -0.6 + Math.sin(t * 0.8) * 0.06
    if (armR.current) armR.current.rotation.x = -0.9 + Math.sin(t * 0.8) * 0.05
  })

  const NAVY = '#2b3647'
  const SLEEVE = '#dfe4ea'
  const VEST = '#1668dd'
  const SKIN = '#b9c1ca'

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Blob scale={0.42} opacity={0.5} />
      <group ref={body}>
        {/* boots and legs */}
        {[-0.14, 0.14].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, 0.06, 0.04]}>
              <boxGeometry args={[0.17, 0.12, 0.3]} />
              <meshStandardMaterial color="#1d242e" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.46, 0]}>
              <cylinderGeometry args={[0.095, 0.12, 0.76, 12]} />
              <meshStandardMaterial color={NAVY} roughness={0.85} />
            </mesh>
          </group>
        ))}

        {/* torso */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[0.44, 0.56, 0.26]} />
          <meshStandardMaterial color={SLEEVE} roughness={0.8} />
        </mesh>
        {/* hi-vis vest with reflective bands */}
        <mesh position={[0, 1.04, 0]}>
          <boxGeometry args={[0.47, 0.5, 0.29]} />
          <meshStandardMaterial color={VEST} roughness={0.6} metalness={0.1} />
        </mesh>
        {[0.94, 1.14].map((y) => (
          <mesh key={y} position={[0, y, 0.148]}>
            <planeGeometry args={[0.46, 0.055]} />
            <meshStandardMaterial color="#e8eef5" roughness={0.3} metalness={0.5} />
          </mesh>
        ))}

        {/* arms */}
        <mesh position={[-0.3, 1.02, 0]} rotation={[0.1, 0, 0.12]}>
          <cylinderGeometry args={[0.075, 0.07, 0.6, 12]} />
          <meshStandardMaterial color={SLEEVE} roughness={0.8} />
        </mesh>
        <group ref={armR} position={[0.3, 1.24, 0]}>
          <mesh position={[0, -0.22, 0.1]}>
            <cylinderGeometry args={[0.075, 0.07, 0.58, 12]} />
            <meshStandardMaterial color={SLEEVE} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.48, 0.22]}>
            <sphereGeometry args={[0.07, 12, 10]} />
            <meshStandardMaterial color={SKIN} roughness={0.9} />
          </mesh>
        </group>

        {/* head, neck, hard hat */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.1, 10]} />
          <meshStandardMaterial color={SKIN} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.54, 0]}>
          <sphereGeometry args={[0.135, 20, 16]} />
          <meshStandardMaterial color={SKIN} roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.158, 22, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f2f5f8" roughness={0.45} metalness={0.1} />
        </mesh>
        <mesh position={[0, 1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.225, 24]} />
          <meshStandardMaterial color="#f2f5f8" roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.71, 0]}>
          <boxGeometry args={[0.05, 0.1, 0.3]} />
          <meshStandardMaterial color="#dbe2ea" roughness={0.5} />
        </mesh>

        {/* the tablet they are holding out */}
        <group ref={tablet} position={[0.3, 0.84, 0.32]} rotation={[-0.6, -0.25, 0]}>
          <mesh>
            <boxGeometry args={[0.34, 0.46, 0.02]} />
            <meshStandardMaterial color="#1d242e" roughness={0.5} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.3, 0.41]} />
            <meshStandardMaterial color="#0e1620" emissive={AZURE} emissiveIntensity={0.9} roughness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/** Reception desk the operator stands behind at the end of the line. */
export function FrontDesk({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Blob scale={1.4} opacity={0.45} />
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3.2, 1.0, 0.7]} />
        <meshStandardMaterial map={paintedMap('#e4e9ef', { repeat: 2 })} color="#e4e9ef" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.03, 0.04]}>
        <boxGeometry args={[3.4, 0.08, 0.86]} />
        <meshStandardMaterial map={brushedMap({ repeat: 2 })} color="#c3ccd6" roughness={0.4} metalness={0.72} />
      </mesh>
      <mesh position={[0, 0.52, 0.36]}>
        <planeGeometry args={[3.0, 0.1]} />
        <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}
