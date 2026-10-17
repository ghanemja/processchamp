import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { AZURE, CYAN, GREEN } from './layout'
import { Blob } from './World'

/** Wheeled skid the cell rolls in on — "factory mobility", literally. */
export function MobileBase({ size = [3.2, 2.6], children, accent = AZURE }) {
  const [w, d] = size
  const casters = [
    [-w / 2 + 0.3, -d / 2 + 0.3],
    [w / 2 - 0.3, -d / 2 + 0.3],
    [-w / 2 + 0.3, d / 2 - 0.3],
    [w / 2 - 0.3, d / 2 - 0.3],
  ]
  return (
    <group>
      <Blob scale={Math.max(w, d) / 2} opacity={0.6} />
      {casters.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.11, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.1, 16]} />
          <meshStandardMaterial color="#6f7a87" roughness={0.85} metalness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[w, 0.28, d]} />
        <meshStandardMaterial color="#cbd3dc" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[w - 0.16, 0.04, d - 0.16]} />
        <meshStandardMaterial color="#aab4c0" roughness={0.42} metalness={0.72} />
      </mesh>
      <mesh position={[0, 0.3, d / 2 + 0.002]}>
        <planeGeometry args={[w * 0.55, 0.045]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <group position={[0, 0.47, 0]}>{children}</group>
    </group>
  )
}

/** Controller / vision cabinet with a live status column. */
export function Cabinet({ position = [0, 0, 0], rotation = [0, 0, 0], accent = CYAN, label }) {
  const bars = useRef([])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    bars.current.forEach((m, i) => {
      if (m) m.material.opacity = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 3 + i * 1.1))
    })
  })

  return (
    <group position={position} rotation={rotation}>
      <Blob scale={0.75} opacity={0.5} />
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.1, 2, 0.75]} />
        <meshStandardMaterial color="#dfe5ec" roughness={0.45} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.55, 0.38]}>
        <planeGeometry args={[0.72, 0.5]} />
        <meshBasicMaterial color="#061119" />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(el) => (bars.current[i] = el)} position={[-0.26 + i * 0.17, 1.55, 0.382]}>
          <planeGeometry args={[0.08, 0.3]} />
          <meshBasicMaterial color={accent} transparent opacity={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 2.06, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.16]} />
        <meshStandardMaterial color="#1a222c" emissive={accent} emissiveIntensity={1.6} />
      </mesh>
      {label}
    </group>
  )
}

/** 3D vision head: housing, lens, and the cone of light it actually casts. */
export function VisionHead({ position = [0, 0, 0], rotation = [0, 0, 0], color = CYAN, throwLength = 2.4, sweep = 0 }) {
  const cone = useRef()
  const group = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (cone.current) cone.current.material.opacity = 0.09 + 0.05 * Math.sin(t * 2.4)
    if (group.current && sweep) group.current.rotation.z = Math.sin(t * 0.6) * sweep
  })

  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.52, 0.2, 0.26]} />
        <meshStandardMaterial color="#2c3642" roughness={0.45} metalness={0.5} />
      </mesh>
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.07, 0.09, 16]} />
          <meshStandardMaterial color="#05121a" emissive={color} emissiveIntensity={2.4} />
        </mesh>
      ))}
      <mesh ref={cone} position={[0, -throwLength / 2 - 0.1, 0]}>
        <coneGeometry args={[throwLength * 0.45, throwLength, 24, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

/** Overhead gantry the inline cameras ride on. */
export function Gantry({ position = [0, 0, 0], span = 7, height = 4.2, children }) {
  return (
    <group position={position}>
      {[-span / 2, span / 2].map((z) => (
        <group key={z}>
          <mesh position={[0, height / 2, z]}>
            <boxGeometry args={[0.26, height, 0.26]} />
            <meshStandardMaterial color="#c3ccd6" roughness={0.5} metalness={0.68} />
          </mesh>
          <Blob position={[0, 0, z]} scale={0.4} opacity={0.4} />
        </group>
      ))}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[0.34, 0.34, span]} />
        <meshStandardMaterial color="#b4bec9" roughness={0.48} metalness={0.72} />
      </mesh>
      <mesh position={[0, height - 0.2, 0]}>
        <boxGeometry args={[0.06, 0.03, span * 0.9]} />
        <meshBasicMaterial color={AZURE} />
      </mesh>
      {children}
    </group>
  )
}

/** Tote of incoming parts — unsorted, which is the point of bin picking. */
export function Bin({ position = [0, 0, 0], rotation = [0, 0, 0], count = 8 }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        p: [(Math.random() - 0.5) * 0.95, 0.5 + i * 0.05, (Math.random() - 0.5) * 0.72],
        r: [Math.random() * 0.4 - 0.2, Math.random() * Math.PI, Math.random() * 0.3 - 0.15],
      })),
    [count]
  )
  const slots = [0, 1, 2, 3, 4]

  return (
    <group position={position} rotation={rotation}>
      <Blob scale={0.9} opacity={0.5} />
      {/* slotted steel tote rather than a solid crate */}
      {[-1, 1].map((s) => (
        <group key={`x${s}`} position={[(s * 1.75) / 2, 0.44, 0]}>
          <mesh>
            <boxGeometry args={[0.05, 0.86, 1.34]} />
            <meshStandardMaterial color="#b6c0cb" roughness={0.6} metalness={0.5} />
          </mesh>
          {slots.map((i) => (
            <mesh key={i} position={[s * 0.03, 0.1, -0.5 + i * 0.25]}>
              <boxGeometry args={[0.02, 0.46, 0.1]} />
              <meshStandardMaterial color="#8a95a2" roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`z${s}`} position={[0, 0.44, (s * 1.34) / 2]}>
          <boxGeometry args={[1.75, 0.86, 0.05]} />
          <meshStandardMaterial color="#b6c0cb" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.8, 0.08, 1.4]} />
        <meshStandardMaterial color="#9ba6b3" roughness={0.75} metalness={0.4} />
      </mesh>
      {/* rolled lip */}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[1.86, 0.06, 1.44]} />
        <meshStandardMaterial color="#aab4c0" roughness={0.45} metalness={0.72} />
      </mesh>
      {parts.map((pt, i) => (
        <mesh key={i} position={pt.p} rotation={pt.r}>
          <boxGeometry args={[0.66, 0.045, 0.46]} />
          <meshStandardMaterial color="#8d97a5" roughness={0.38} metalness={0.88} />
        </mesh>
      ))}
    </group>
  )
}

/** Finished assembly leaving under its own power. */
export function AGV({ from = 0, to = 20, speed = 0.06, children }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const k = (clock.getElapsedTime() * speed) % 1
    ref.current.position.x = from + (to - from) * k
  })
  return (
    <group ref={ref}>
      <Blob scale={0.9} opacity={0.5} />
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[2.4, 0.4, 1.5]} />
        <meshStandardMaterial color="#c6cfd9" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[2.2, 0.06, 1.3]} />
        <meshStandardMaterial color="#aab4c0" roughness={0.42} metalness={0.72} />
      </mesh>
      <mesh position={[1.21, 0.26, 0]}>
        <planeGeometry args={[0.001, 0.001]} />
        <meshBasicMaterial color={AZURE} />
      </mesh>
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, 0.26, 0.76]}>
          <planeGeometry args={[0.5, 0.06]} />
          <meshBasicMaterial color={AZURE} />
        </mesh>
      ))}
      <group position={[0, 0.51, 0]}>{children}</group>
    </group>
  )
}

/** Weld flash: a flicker light plus a burst of additive points. */
export function Weld({ position = [0, 0, 0] }) {
  const light = useRef()
  const pts = useRef()
  const count = 50
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        dir: new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9, Math.random() - 0.5).normalize(),
        v: 0.6 + Math.random() * 1.6,
        o: Math.random(),
      })),
    []
  )
  const positions = useMemo(() => new Float32Array(count * 3), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const duty = Math.sin(t * 1.6) > 0.25
    const flicker = duty ? 6 + Math.random() * 14 : 0
    if (light.current) light.current.intensity = flicker
    const geo = pts.current?.geometry
    if (!geo) return
    const arr = geo.attributes.position.array
    for (let i = 0; i < count; i++) {
      const s = seeds[i]
      const k = ((s.o + t * s.v) % 1)
      const life = duty ? 1 - k : 0
      arr[i * 3] = s.dir.x * k * 0.9
      arr[i * 3 + 1] = s.dir.y * k * 0.9 - k * k * 0.5
      arr[i * 3 + 2] = s.dir.z * k * 0.9
      if (!life) arr[i * 3 + 1] = -99
    }
    geo.attributes.position.needsUpdate = true
  })

  return (
    <group position={position}>
      <pointLight ref={light} color="#bcd8ff" distance={7} decay={2} intensity={0} />
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffd9a0"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

/**
 * A measured deviation drawn as an arrow from where the feature is to where it
 * should be. `correction` 0 = raw error, 1 = driven out.
 */
export function DeviationArrow({ position = [0, 0, 0], dir = [1, 0, 0], length = 0.6, correctionRef }) {
  const shaft = useRef()
  const head = useRef()
  const d = useMemo(() => new THREE.Vector3(...dir).normalize(), [dir])
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d), [d])
  const col = useMemo(() => new THREE.Color(), [])

  useFrame(() => {
    const k = 1 - (correctionRef?.current ?? 0)
    const len = Math.max(0.0001, length * k)
    col.set(AZURE).lerp(new THREE.Color(GREEN), 1 - k)
    if (shaft.current) {
      shaft.current.scale.set(1, len / length, 1)
      shaft.current.position.copy(d).multiplyScalar(len / 2)
      shaft.current.material.color.copy(col)
      shaft.current.material.opacity = 0.35 + 0.65 * k
    }
    if (head.current) {
      head.current.position.copy(d).multiplyScalar(len)
      head.current.scale.setScalar(0.5 + 0.5 * k)
      head.current.material.color.copy(col)
    }
  })

  return (
    <group position={position}>
      <mesh ref={shaft} quaternion={quat}>
        <cylinderGeometry args={[0.016, 0.016, length, 8]} />
        <meshBasicMaterial color={AZURE} transparent depthWrite={false} />
      </mesh>
      <mesh ref={head} quaternion={quat}>
        <coneGeometry args={[0.055, 0.14, 12]} />
        <meshBasicMaterial color={AZURE} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={GREEN} />
      </mesh>
    </group>
  )
}

/**
 * Floating readout, drawn to a canvas texture and billboarded.
 * A DOM overlay (drei <Html>) was the first attempt: it ignores depth and fog,
 * and panels behind the camera scaled up and blacked out the viewport.
 */
export function Readout({ position = [0, 0, 0], title, rows = [], accent = CYAN, width = 2.1 }) {
  const texture = useMemo(() => {
    const W = 512
    const H = 256
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const g = c.getContext('2d')

    const r = 18
    g.beginPath()
    g.moveTo(r, 0)
    g.arcTo(W, 0, W, H, r)
    g.arcTo(W, H, 0, H, r)
    g.arcTo(0, H, 0, 0, r)
    g.arcTo(0, 0, W, 0, r)
    g.closePath()
    g.fillStyle = 'rgba(255,255,255,0.94)'
    g.fill()
    g.strokeStyle = accent
    g.globalAlpha = 0.9
    g.lineWidth = 3
    g.stroke()
    g.globalAlpha = 1

    g.fillStyle = accent
    g.beginPath()
    g.arc(34, 42, 7, 0, Math.PI * 2)
    g.fill()
    g.font = '600 22px ui-monospace, SFMono-Regular, Menlo, monospace'
    g.fillText(String(title).toUpperCase(), 54, 50)

    g.strokeStyle = 'rgba(12,19,27,0.14)'
    g.lineWidth = 2
    g.beginPath()
    g.moveTo(30, 72)
    g.lineTo(W - 30, 72)
    g.stroke()

    rows.forEach((row, i) => {
      const y = 116 + i * 46
      g.font = '400 24px ui-monospace, SFMono-Regular, Menlo, monospace'
      g.fillStyle = 'rgba(77,90,105,0.95)'
      g.fillText(row.k, 32, y)
      g.textAlign = 'right'
      g.fillStyle = row.ok ? '#0f8a4d' : '#0c131b'
      g.fillText(row.v, W - 32, y)
      g.textAlign = 'left'
    })

    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [title, rows, accent])

  const glow = useRef()
  useFrame(({ clock }) => {
    if (glow.current) glow.current.material.opacity = 0.1 + 0.05 * Math.sin(clock.getElapsedTime() * 2)
  })

  const h = (width * 256) / 512

  return (
    <Billboard position={position} follow lockZ>
      <mesh ref={glow} position={[0, 0, -0.01]} scale={1.08}>
        <planeGeometry args={[width, h]} />
        <meshBasicMaterial color={accent} transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, h]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </Billboard>
  )
}

/** Andon tower — the fastest way to read a cell's state from across the floor. */
export function StackLight({ position = [0, 0, 0], state = 'run' }) {
  const lamps = useRef([])
  const order = ['#2fd07a', AZURE, '#e8f1fb']
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    lamps.current.forEach((m, i) => {
      if (!m) return
      const active = state === 'run' ? i === 0 : state === 'measure' ? i === 1 : i === 2
      m.material.emissiveIntensity = active ? 1.6 + Math.sin(t * 3) * 0.7 : 0.08
    })
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.8, 10]} />
        <meshStandardMaterial color="#b9c2cd" roughness={0.6} metalness={0.55} />
      </mesh>
      {order.map((c, i) => (
        <mesh key={c} ref={(el) => (lamps.current[i] = el)} position={[0, 1.86 + i * 0.17, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.15, 16]} />
          <meshStandardMaterial color="#0c1018" emissive={c} emissiveIntensity={0.08} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 2.38, 0]}>
        <sphereGeometry args={[0.085, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#20262f" roughness={0.6} metalness={0.5} />
      </mesh>
    </group>
  )
}

/** Operator HMI on a pedestal, with a live-looking screen. */
export function HMIKiosk({ position = [0, 0, 0], rotation = [0, 0, 0], accent = CYAN }) {
  const screen = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 160
    const g = c.getContext('2d')
    g.fillStyle = '#04080f'
    g.fillRect(0, 0, 256, 160)
    g.strokeStyle = 'rgba(255,255,255,0.07)'
    for (let i = 0; i < 160; i += 16) {
      g.beginPath()
      g.moveTo(0, i)
      g.lineTo(256, i)
      g.stroke()
    }
    g.fillStyle = accent
    g.fillRect(14, 16, 60, 8)
    g.globalAlpha = 0.5
    g.fillRect(14, 34, 110, 5)
    g.fillRect(14, 46, 86, 5)
    g.globalAlpha = 1
    g.strokeStyle = accent
    g.lineWidth = 2
    g.beginPath()
    for (let x = 0; x < 230; x += 6) {
      const y = 120 - Math.sin(x / 22) * 22 - (x / 230) * 18
      x === 0 ? g.moveTo(14 + x, y) : g.lineTo(14 + x, y)
    }
    g.stroke()
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [accent])

  return (
    <group position={position} rotation={rotation}>
      <Blob scale={0.45} opacity={0.45} />
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.07, 0.11, 1.1, 14]} />
        <meshStandardMaterial color="#c9d1db" roughness={0.5} metalness={0.6} />
      </mesh>
      <group position={[0, 1.2, 0]} rotation={[-0.42, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.72, 0.5, 0.07]} />
          <meshStandardMaterial color="#2b3440" roughness={0.45} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.037]}>
          <planeGeometry args={[0.64, 0.42]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

/** Structured-light pattern laid over whatever the projector is aimed at. */
export function ProjectedGrid({ position = [0, 0, 0], size = [2.4, 1.6], color = CYAN }) {
  const mesh = useRef()
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const g = c.getContext('2d')
    g.clearRect(0, 0, 256, 256)
    g.strokeStyle = '#ffffff'
    g.lineWidth = 2
    for (let i = 8; i < 256; i += 16) {
      g.globalAlpha = i % 48 === 8 ? 0.95 : 0.4
      g.beginPath()
      g.moveTo(i, 0)
      g.lineTo(i, 256)
      g.stroke()
    }
    g.globalAlpha = 0.25
    for (let i = 8; i < 256; i += 32) {
      g.beginPath()
      g.moveTo(0, i)
      g.lineTo(256, i)
      g.stroke()
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    return t
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    tex.offset.x = (t * 0.06) % 1
    if (mesh.current) mesh.current.material.opacity = 0.3 + Math.sin(t * 2.2) * 0.12
  })

  return (
    <mesh ref={mesh} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={tex} color={color} transparent opacity={0.6} depthWrite={false} />
    </mesh>
  )
}

/** Rotating wireframe twin — the digital model the solver is reasoning about. */
export function HoloTwin({ position = [0, 0, 0], scale = 1, color = CYAN }) {
  const spin = useRef()
  const scan = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (spin.current) spin.current.rotation.y = t * 0.5
    if (scan.current) {
      scan.current.position.y = ((t * 0.4) % 1) * 0.9 - 0.45
      scan.current.material.opacity = 0.35
    }
  })
  return (
    <group position={position} scale={scale}>
      <group ref={spin}>
        <mesh>
          <boxGeometry args={[1.5, 0.08, 0.95]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.65} />
        </mesh>
        <mesh position={[0, 0.34, -0.33]} rotation={[0.42, 0, 0]}>
          <boxGeometry args={[1.35, 0.06, 0.58]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
        </mesh>
        {[[-0.6, -0.3], [0.62, 0.28], [0, 0.4]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.1, z]}>
            <octahedronGeometry args={[0.055, 0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
      <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.7, 1.1]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.8, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/** Confidence box drawn around a part the vision system has located. */
export function PickCandidate({ position = [0, 0, 0], rotation = [0, 0, 0], size = [0.68, 0.12, 0.5], delay = 0 }) {
  const group = useRef()
  useFrame(({ clock }) => {
    if (!group.current) return
    const k = (clock.getElapsedTime() * 0.5 + delay) % 1
    const on = k > 0.15
    group.current.visible = on
    group.current.children.forEach((c) => {
      if (c.material) c.material.opacity = on ? 0.55 + Math.sin(k * 10) * 0.2 : 0
    })
  })
  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={size} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, size[1] / 2 + 0.01, 0]}>
        <ringGeometry args={[0.07, 0.085, 20]} />
        <meshBasicMaterial color={GREEN} transparent opacity={0.8} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

/** Arc gauge whose needle tracks a 0–1 ref. Green once the error is gone. */
export function ToleranceGauge({ position = [0, 0, 0], valueRef, width = 1.4 }) {
  const needle = useRef()
  const arc = useRef()
  const col = useMemo(() => new THREE.Color(), [])
  useFrame(() => {
    const v = valueRef?.current ?? 0
    if (needle.current) needle.current.rotation.z = (0.5 - v) * Math.PI * 0.8
    if (arc.current) {
      col.set('#ff5c7a').lerp(new THREE.Color(GREEN), v)
      arc.current.material.color.copy(col)
    }
  })
  return (
    <Billboard position={position} follow lockZ>
      <mesh position={[0, -0.1, -0.01]}>
        <ringGeometry args={[width * 0.42, width * 0.5, 40, 1, Math.PI * 0.1, Math.PI * 0.8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={arc} position={[0, -0.1, 0]}>
        <ringGeometry args={[width * 0.44, width * 0.48, 40, 1, Math.PI * 0.12, Math.PI * 0.76]} />
        <meshBasicMaterial color={GREEN} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={needle} position={[0, -0.1, 0.01]}>
        <planeGeometry args={[0.025, width * 0.46]} />
        <meshBasicMaterial color="#0c131b" />
      </mesh>
    </Billboard>
  )
}

/** Rack of spare end effectors — what "changeover in software" replaces. */
export function ToolRack({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Blob scale={0.7} opacity={0.45} />
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2.2, 0.1, 0.5]} />
        <meshStandardMaterial color="#c9d1db" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[2.2, 0.1, 0.5]} />
        <meshStandardMaterial color="#c9d1db" roughness={0.5} metalness={0.6} />
      </mesh>
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, 0.85, 0]}>
          <boxGeometry args={[0.1, 1.7, 0.1]} />
          <meshStandardMaterial color="#b2bcc7" roughness={0.6} metalness={0.55} />
        </mesh>
      ))}
      {[-0.65, 0, 0.65].map((x, i) => (
        <group key={x} position={[x, 1.78, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.12, 0.16, 14]} />
            <meshStandardMaterial color="#aeb9c9" roughness={0.35} metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <boxGeometry args={[0.26, 0.22, 0.2]} />
            <meshStandardMaterial color={i === 1 ? AZURE : '#161c26'} roughness={0.5} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Stamped sheet part: flanged edges, a rib and lightening holes. */
export function StampedPart({ size = [2.3, 1.45], color = '#d7deea', holes = 3 }) {
  const [w, d] = size
  return (
    <group>
      <mesh>
        <boxGeometry args={[w, 0.05, d]} />
        <meshStandardMaterial color={color} roughness={0.34} metalness={0.9} />
      </mesh>
      {/* flanges */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, -0.06, (s * d) / 2]} rotation={[s * 0.5, 0, 0]}>
          <boxGeometry args={[w, 0.04, 0.16]} />
          <meshStandardMaterial color={color} roughness={0.36} metalness={0.9} />
        </mesh>
      ))}
      {/* stiffening rib */}
      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[w * 0.72, 0.045, d * 0.18]} />
        <meshStandardMaterial color="#bcc5d3" roughness={0.42} metalness={0.85} />
      </mesh>
      {Array.from({ length: holes }, (_, i) => (
        <mesh key={i} position={[-w * 0.3 + (i * w * 0.3), 0.03, d * 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.085, 0.018, 8, 18]} />
          <meshStandardMaterial color="#9aa4b2" roughness={0.45} metalness={0.85} />
        </mesh>
      ))}
    </group>
  )
}
