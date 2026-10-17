import { useMemo, useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import RobotArm from '../RobotArm'
import { DatumPin, LaserSweep, ScanCloud } from '../Bits'
import { SPECIMENS } from '../showcase/Specimens'
import CarBody, { BodySide, Door, STEEL_LIGHT } from './Car'
import {
  AGV,
  Bin,
  Cabinet,
  DeviationArrow,
  Gantry,
  HMIKiosk,
  HoloTwin,
  MobileBase,
  PickCandidate,
  ProjectedGrid,
  Readout,
  StackLight,
  ToleranceGauge,
  ToolRack,
  VisionHead,
  Weld,
} from './Parts'
import {
  Banner,
  ControlRoom,
  Enclosure,
  FrontDesk,
  Operator,
  Pylon,
  Racking,
  WeldCurtains,
} from './Fixtures'
import { Blob, Fence, Threshold, TransitBody } from './World'
import {
  FaultZone,
  FixtureStore,
  Hoist,
  ManualInspection,
  OfflineDesk,
  ReworkBay,
  WeldJig,
  WipQueue,
} from './Legacy'
import { brushedMap } from './textures'
import { AZURE, CYAN, GREEN, STATION_STYLE, STATION_X } from './layout'

const S = (i) => STATION_STYLE[i]

/** Work stand used wherever something is presented rather than carried. */
function Stand({ size = [2.7, 2.1], top = 0.94, accent = AZURE }) {
  const [w, d] = size
  return (
    <group>
      <Blob scale={Math.max(w, d) / 1.8} opacity={0.5} />
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[w, 0.2, d]} />
        <meshStandardMaterial color="#aab4c0" roughness={0.6} metalness={0.5} />
      </mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[(sx * (w - 0.6)) / 2, top / 2 + 0.1, (sz * (d - 0.5)) / 2]}>
          <boxGeometry args={[0.16, top - 0.1, 0.16]} />
          <meshStandardMaterial color="#8e99a6" roughness={0.6} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, top, 0]}>
        <boxGeometry args={[w - 0.1, 0.12, d - 0.1]} />
        <meshStandardMaterial map={brushedMap({ repeat: 2 })} color="#8d97a5" roughness={0.42} metalness={0.74} />
      </mesh>
      <mesh position={[0, top + 0.07, (d - 0.1) / 2 - 0.04]}>
        <boxGeometry args={[w * 0.6, 0.03, 0.02]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

/** 00 — the floor itself: mobile cells, no fixed tooling anywhere in sight. */
function Arrival({ x, legacy }) {
  const st = S(0)
  return (
    <group position={[x, 0, 0]}>
      <Threshold position={[0, 0, 4.8]} width={11} accent={legacy ? '#9a6a1b' : st.accent} />

      <group position={[-2.2, 0.2, 0]} rotation={[0, 0.06, 0]}>
        <CarBody stage="complete" />
      </group>

      {legacy ? (
        <>
          {/* the body is clamped into dedicated steel and moved by hand */}
          <WeldJig position={[-0.1, 0, 0]} length={5.6} width={2.8} clamps={10} />
          <Hoist position={[-0.1, 0, 0]} span={7} height={4.6} />
          <FixtureStore position={[-4.4, 0, -4.6]} rotation={[0, 0.2, 0]} bays={3} />
          <ManualInspection position={[4.6, 0, 3.0]} rotation={[0, -1.1, 0]} />
          <StackLight position={[3.4, 0, -2.4]} state="fault" />
        </>
      ) : (
        <>
          <group position={[-2.6, 0, 2.4]} rotation={[0, 0.5, 0]}>
            <MobileBase size={[2.8, 2.3]}>
              <RobotArm program="assemble" tool="gripper" scale={1.1} />
            </MobileBase>
            <StackLight position={[1.5, 0, -0.9]} state="run" />
          </group>
          <group position={[2.9, 0, -3.0]} rotation={[0, -2.2, 0]}>
            <MobileBase size={[2.4, 2.0]}>
              <RobotArm program="scan" tool="scanner" scale={0.95} />
            </MobileBase>
          </group>
          <ScanCloud count={170} radius={2.4} height={2.2} color={AZURE} size={0.032} />
          <HMIKiosk position={[-4.6, 0, 4.4]} rotation={[0, 0.7, 0]} />
          <ToolRack position={[5.6, 0, 4.2]} rotation={[0, -0.8, 0]} />
          <Cabinet position={[5.4, 0, 2.6]} rotation={[0, -0.9, 0]} accent={AZURE} />
        </>
      )}
      <Fence position={[1, 0, -6.4]} panels={5} />
      <Banner position={[6.5, 4.4, 0]} rotation={[0, -Math.PI / 2, 0]} width={7} height={1.5} title="BODY SHOP" sub={legacy ? 'HARD TOOLED · CELLS 01–06' : 'FIXTURELESS · CELLS 01–06'} bg={legacy ? '#6b5c54' : '#0d5fc4'} />
    </group>
  )
}

/** 01 — parts arrive unsorted; the cell locates them where they actually are. */
function Intake({ x, legacy }) {
  const st = S(1)
  return (
    <group position={[x, 0, 0]}>
      <Threshold position={[0, 0, 3.4]} width={10} accent={st.accent} />

      <Racking position={[-3.4, 0, -4.4]} rotation={[0, 0.06, 0]} bays={3}>
        {[0.98, 2.38].map((y, i) => (
          <group key={y} position={[1.9, y + 0.1, 0]} rotation={[0.04, 0, 0]} scale={0.92}>
            <BodySide z={0} color={i ? STEEL_LIGHT : undefined} />
          </group>
        ))}
      </Racking>

      {legacy ? (
        <>
          {/* loaded by hand into a nest cut for this part and no other */}
          <group position={[2.4, 0, -2.6]} rotation={[0, 0.5, 0]}>
            <WeldJig position={[0, 0, 0]} length={3.0} width={1.8} clamps={4} />
          </group>
          <ManualInspection position={[0.4, 0, 2.6]} rotation={[0, -0.3, 0]} />
          <FixtureStore position={[4.6, 0, -4.4]} rotation={[0, -0.3, 0]} bays={2} />
          <WipQueue position={[-7.5, 0, 0]} count={3} pitch={5.4} Body={TransitBody} />
          <StackLight position={[1.4, 0, -2.8]} state="fault" />
        </>
      ) : (
        <>
          <group position={[0.8, 2.6, -4.2]} rotation={[0, 0.06, 0]}>
            <ProjectedGrid position={[0, 0.02, 0]} size={[4.4, 1.5]} />
            <PickCandidate position={[-1.2, 0.08, 0]} size={[1.5, 0.12, 0.9]} delay={0} />
            <PickCandidate position={[0.9, 0.1, 0.1]} size={[1.4, 0.12, 0.8]} delay={0.4} />
          </group>
          <VisionHead position={[0.8, 4.6, -4.2]} throwLength={2.1} sweep={0.12} />
          <group position={[2.6, 0, -2.8]} rotation={[0, 2.2, 0]}>
            <MobileBase size={[2.4, 2.0]}>
              <RobotArm program="pick" tool="vacuum" scale={1.0} />
            </MobileBase>
          </group>
          <group position={[-0.6, 0, 3.0]} rotation={[0, -0.5, 0]} scale={0.9}>
            <Bin />
          </group>
          <StackLight position={[1.4, 0, -2.8]} state="measure" />
          <Readout
            position={[0.8, 5.4, -4.2]}
            title="Stamping located"
            rows={[
              { k: 'body sides', v: '6 in rack' },
              { k: 'pose solved', v: 'yes', ok: true },
              { k: 'cycle', v: '2.4 s' },
            ]}
          />
          <HMIKiosk position={[4.0, 0, 2.4]} rotation={[0, -1.1, 0]} />
        </>
      )}
    </group>
  )
}

/** 02 — scan critical datums, inside a shrouded booth so the light is known. */
function ScanStation({ x, legacy }) {
  const st = S(2)
  return (
    <group position={[x, 0, 0]}>
      {/* a metrology booth: dark liner, controlled light. There is no such
          thing in the conventional bay — it is a gauge on a table. */}
      {!legacy && (
        <Enclosure position={[0, 0, -2.6]} size={[11, 3.6, 7.5]} color="#36404e" accent={st.accent} roof backWall={false} />
      )}
      <Threshold position={[0, 0, 2.2]} width={10} accent={st.accent} />
      <Fence position={[-4.6, 0, 1.0]} rotation={[0, Math.PI / 2, 0]} panels={2} />
      <Fence position={[4.6, 0, 1.0]} rotation={[0, Math.PI / 2, 0]} panels={2} />

      <group position={[-2.3, 0.2, 0]}>
        <CarBody stage="underbody" />
      </group>
      {legacy ? (
        <>
          {/* checked off the line, by hand, one at a time — so the line queues */}
          <ManualInspection position={[3.2, 0, 2.6]} rotation={[0, -0.8, 0]} />
          <FaultZone position={[-1.0, 0, 0]} radius={3.6} />
          <WipQueue position={[-8.0, 0, 0]} count={4} pitch={5.4} Body={TransitBody} />
          <StackLight position={[3.8, 0, 2.8]} state="fault" />
        </>
      ) : (
        <>
          <group position={[0, 0, 0]}>
            <ProjectedGrid position={[0, 0.42, 0]} size={[4.4, 1.7]} />
            <LaserSweep width={4.6} depth={2.1} from={0.4} to={2.0} speed={0.7} color={CYAN} />
            <ScanCloud count={420} radius={2.4} height={1.8} color={CYAN} />
          </group>
          <group position={[-2.6, 0, 2.6]} rotation={[0, 0.5, 0]}>
            <MobileBase size={[2.6, 2.2]}>
              <RobotArm program="scan" tool="scanner" scale={1.0} />
            </MobileBase>
          </group>
          <group position={[2.8, 0, 2.4]} rotation={[0, -2.3, 0]}>
            <MobileBase size={[2.4, 2.0]}>
              <RobotArm program="assemble" tool="gripper" scale={0.95} />
            </MobileBase>
          </group>
          <Gantry position={[0, 0, 0]} span={7.4} height={4.4}>
            <VisionHead position={[0, 4.0, -1.4]} throwLength={2.2} />
            <VisionHead position={[0, 4.0, 1.4]} throwLength={2.2} />
          </Gantry>
          <StackLight position={[3.8, 0, 2.8]} state="measure" />
          <Readout
            position={[0, 4.6, 0]}
            title="Underbody datums"
            accent={CYAN}
            rows={[
              { k: 'A1 · A2 · A3', v: 'locked', ok: true },
              { k: 'points', v: '18.4 k' },
              { k: 'as-found dev', v: '1.82 mm' },
            ]}
          />
        </>
      )}
    </group>
  )
}

/** 03 — the solver, in a glazed control room beside the line. */
function Solve({ x, legacy }) {
  const st = S(3)
  const group = useRef()
  const nodes = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        p: new THREE.Vector3(((i * 37) % 100) / 20 - 2.5, 1.2 + ((i * 53) % 100) / 38, -1 + ((i * 71) % 100) / 25 - 2),
        o: ((i * 97) % 100) / 100,
      })),
    []
  )
  const sink = useMemo(() => new THREE.Vector3(1.9, 3.1, -3.4), [])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.children.forEach((c, i) => {
      const n = nodes[i]
      if (!n) return
      const k = (n.o + t * 0.3) % 1
      c.position.lerpVectors(n.p, sink, k)
      c.scale.setScalar(Math.max(0.001, (1 - k) * 0.85 + 0.14))
      c.rotation.x = t * 0.8 + i
      c.rotation.y = t * 0.6 + i
    })
  })

  return (
    <group position={[x, 0, 0]}>
      <Threshold position={[0, 0, 3.0]} width={10} accent={st.accent} />

      <group position={[-2.6, 0.2, 0]} rotation={[0, 0.04, 0]}>
        <CarBody stage="one-side" />
      </group>

      {legacy ? (
        <>
          {/* the correction happens on paper, days later, away from the line */}
          <OfflineDesk position={[2.4, 0, -4.4]} rotation={[0, 0.3, 0]} />
          <FixtureStore position={[-4.8, 0, -4.6]} rotation={[0, 0.25, 0]} bays={2} />
          <StackLight position={[-0.4, 0, -3.4]} state="fault" />
        </>
      ) : (
        <>
          <ControlRoom position={[1.9, 0, -4.6]} rotation={[0, 0.06, 0]} />
          <group position={[-2.4, 0, -3.0]} rotation={[0, 0.55, 0]}>
            <MobileBase size={[2.6, 2.2]}>
              <RobotArm program="assemble" tool="gripper" scale={1.05} />
            </MobileBase>
          </group>
          <group ref={group}>
            {nodes.map((n, i) => (
              <mesh key={i} position={n.p}>
                <octahedronGeometry args={[0.075, 0]} />
                <meshStandardMaterial color="#04101a" emissive={CYAN} emissiveIntensity={2.8} />
              </mesh>
            ))}
          </group>
          <HoloTwin position={[1.9, 4.3, -4.6]} scale={1.05} />
          <StackLight position={[-0.4, 0, -3.4]} state="measure" />
          <Readout
            position={[-1.4, 4.2, -0.6]}
            title="GeoSet solver"
            rows={[
              { k: 'priority set', v: '6 dims' },
              { k: 'solution', v: 'converged', ok: true },
              { k: 'solve time', v: '38 ms' },
            ]}
          />
        </>
      )}
    </group>
  )
}

/** 04 — fixtureless assembly, behind weld curtains. */
function Assembly({ x, legacy }) {
  const st = S(4)
  const ghost = useRef()
  useFrame(({ clock }) => {
    if (!ghost.current) return
    const k = (Math.sin(clock.getElapsedTime() * 0.35) + 1) / 2
    ghost.current.traverse((o) => {
      if (o.material) o.material.opacity = 0.04 + k * 0.1
    })
  })

  return (
    <group position={[x, 0, 0]}>
      <Enclosure position={[0, 0, -3.4]} size={[12, 3.6, 7]} color="#6b5c54" accent={st.accent} roof backWall={false} />
      <Threshold position={[0, 0, 3.2]} width={11} accent={st.accent} />
      <WeldCurtains position={[1.4, 0, 3.0]} width={5} height={2.8} strips={8} />
      <WeldCurtains position={[0, 0, -6.6]} width={9} height={2.8} strips={9} />

      <group position={[-2.3, 0.2, 0]}>
        <CarBody stage="one-side" />
        {!legacy && (
          <Float speed={1.2} floatIntensity={0.16} rotationIntensity={0.03}>
            <group position={[0, 0.42, -0.95]}>
              <BodySide z={0} side={-1} color={STEEL_LIGHT} />
            </group>
          </Float>
        )}
        {legacy && (
          <group position={[0, 0.3, -0.95]}>
            <BodySide z={0} side={-1} color={STEEL_LIGHT} />
          </group>
        )}
        <Weld position={[1.3, 0.28, -0.78]} />
        <Weld position={[3.3, 0.28, -0.78]} />
        {!legacy && <Weld position={[2.3, 1.64, -0.78]} />}
      </group>

      {legacy ? (
        <>
          {/* the jig the robots replace: bolted down, cut for one body only */}
          <WeldJig position={[0.1, 0, 0]} length={5.8} width={3.0} clamps={12} />
          <Hoist position={[0.1, 0, 0]} span={7.2} height={4.6} />
          <FixtureStore position={[5.2, 0, -4.4]} rotation={[0, -0.4, 0]} bays={2} />
          <ManualInspection position={[-4.4, 0, 3.0]} rotation={[0, 0.9, 0]} />
          <StackLight position={[2.6, 0, -3.4]} state="fault" />
        </>
      ) : (
        <>
          <group position={[-2.9, 0, 2.8]} rotation={[0, 0.5, 0]}>
            <MobileBase size={[2.8, 2.3]}>
              <RobotArm program="assemble" tool="gripper" scale={1.05} />
            </MobileBase>
          </group>
          <group position={[2.9, 0, 2.8]} rotation={[0, -0.5, 0]}>
            <MobileBase size={[2.8, 2.3]}>
              <RobotArm program="assemble" tool="gripper" scale={1.05} />
            </MobileBase>
          </group>
          <group position={[0, 0, -3.0]} rotation={[0, Math.PI, 0]}>
            <MobileBase size={[2.6, 2.1]}>
              <RobotArm program="assemble" tool="weld" scale={1.0} />
            </MobileBase>
            <StackLight position={[1.4, 0, 0.9]} state="run" />
          </group>
          <group ref={ghost}>
            <mesh position={[0, 1.0, 0]}>
              <boxGeometry args={[5.4, 2.0, 2.6]} />
              <meshBasicMaterial color={AZURE} wireframe transparent opacity={0.1} />
            </mesh>
          </group>
          <ToolRack position={[5.0, 0, -4.2]} rotation={[0, -0.5, 0]} />
          <Readout
            position={[0, 4.4, 0]}
            title="Fixtureless assembly"
            rows={[
              { k: 'jigs required', v: '0', ok: true },
              { k: 'critical dims', v: 'in tol', ok: true },
              { k: 'changeover', v: 'software' },
            ]}
          />
        </>
      )}
    </group>
  )
}

/** 05 — inline vision correction: measure, compute, nudge, re-measure. */
function InlineCorrection({ x, legacy }) {
  const st = S(5)
  const correction = useRef(0)
  const part = useRef()
  const ghost = useRef()
  const scanBar = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const k = (t % 8) / 8
    const c = k < 0.22 ? 0 : k < 0.72 ? (k - 0.22) / 0.5 : 1
    const eased = c * c * (3 - 2 * c)
    correction.current = eased

    if (part.current) {
      // in the conventional bay nothing corrects it — the error just stays
      if (legacy) {
        part.current.position.set(-0.35, 1.02, 0.92)
        part.current.rotation.z = 0.07
      } else {
      part.current.position.y = 0.95 + (1 - eased) * 0.07
      part.current.position.x = -0.42 + (1 - eased) * 0.07
      part.current.position.z = 0.86 + (1 - eased) * 0.06
      part.current.rotation.z = (1 - eased) * 0.07
      }
    }
    if (ghost.current) {
      ghost.current.visible = !legacy && eased < 0.98
      ghost.current.traverse((o) => {
        if (o.material) o.material.opacity = 0.28 * (1 - eased)
      })
    }
    if (scanBar.current) {
      scanBar.current.position.y = 0.95 + Math.sin(t * 1.4) * 0.42
      scanBar.current.material.opacity = 0.22 + 0.12 * Math.sin(t * 3)
    }
  })

  return (
    <group position={[x, 0, 0]}>
      <Threshold position={[0, 0, 3.6]} width={10} accent={st.accent} />
      <Fence position={[0, 0, -5.9]} panels={5} height={1.6} />

      <group position={[-2.3, 0.2, 0]}>
        <CarBody stage="complete" />
      </group>

      <group ref={ghost} position={[-0.35, 0.98, 0.9]} rotation={[0, 0, 0.07]}>
        <mesh>
          <boxGeometry args={[1.22, 0.88, 0.06]} />
          <meshBasicMaterial color="#c3362f" wireframe transparent opacity={0.3} />
        </mesh>
      </group>

      <group ref={part} position={[-0.42, 0.95, 0.86]}>
        <Door rotation={[0, Math.PI / 2, 0]} />
        <DatumPin position={[0, 0.5, -0.62]} color={AZURE} />
        <DatumPin position={[0, -0.42, -0.62]} color={AZURE} />
        {!legacy && (
          <>
            <DeviationArrow position={[0, 0.46, -0.1]} dir={[0, 1, 0]} length={0.3} correctionRef={correction} />
            <DeviationArrow position={[0, -0.4, -0.1]} dir={[0, -1, 0]} length={0.26} correctionRef={correction} />
            <DeviationArrow position={[0.55, 0.04, -0.1]} dir={[1, 0, 0]} length={0.3} correctionRef={correction} />
            <DeviationArrow position={[-0.58, 0.04, -0.1]} dir={[-1, 0, 0]} length={0.26} correctionRef={correction} />
          </>
        )}
      </group>

      {legacy ? (
        <>
          {/* found at the end, fixed by hand, or scrapped */}
          <ReworkBay position={[1.8, 0, 2.0]} rotation={[0, -0.4, 0]} />
          <FaultZone position={[-0.6, 0, 0]} radius={3.8} />
          <WipQueue position={[-8.4, 0, 0]} count={3} pitch={5.4} Body={TransitBody} />
          <StackLight position={[2.6, 0, -2.4]} state="fault" />
        </>
      ) : (
        <>
          <mesh ref={scanBar} position={[-0.42, 0.95, 0.95]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.5, 0.04]} />
            <meshBasicMaterial color={AZURE} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <Gantry position={[0, 0, 0]} span={7} height={4.0}>
            <VisionHead position={[0, 3.6, -1.1]} throwLength={2.4} />
            <VisionHead position={[0, 3.6, 1.1]} throwLength={2.4} />
          </Gantry>
          <group position={[-3.6, 0, -3.6]} rotation={[0, 2.5, 0]}>
            <MobileBase size={[2.4, 2.0]}>
              <RobotArm program="assemble" tool="gripper" scale={0.9} />
            </MobileBase>
          </group>
          <group position={[3.2, 0, 3.4]} rotation={[0, -0.6, 0]}>
            <MobileBase size={[2.4, 2.0]}>
              <RobotArm program="assemble" tool="gripper" scale={0.9} />
            </MobileBase>
          </group>
          <ToleranceGauge position={[-0.4, 2.5, 1.5]} valueRef={correction} width={1.1} />
          <StackLight position={[2.6, 0, -2.4]} state="measure" />
          <Readout
            position={[-0.6, 3.6, 1.6]}
            title="Gap & flush"
            accent={AZURE}
            rows={[
              { k: 'gap', v: '3.9 ± 0.2', ok: true },
              { k: 'flush', v: '0.1 mm', ok: true },
              { k: 'loop', v: 'closed', ok: true },
            ]}
          />
        </>
      )}
    </group>
  )
}

/** 06 — quality report, then the finished body rolls out. */
function Output({ x, legacy }) {
  const st = S(6)
  const pass = useRef()
  useFrame(({ clock }) => {
    if (pass.current) pass.current.material.emissiveIntensity = 1.6 + Math.sin(clock.getElapsedTime() * 2.4) * 0.8
  })

  return (
    <group position={[x, 0, 0]}>
      <Threshold position={[0, 0, 3.4]} width={10} accent={st.accent} />

      {!legacy && (
        <>
          <group position={[-3.8, 0, -3.0]} rotation={[0, 0.9, 0]}>
            <MobileBase size={[2.2, 1.9]}>
              <RobotArm program="scan" tool="scanner" scale={0.85} />
            </MobileBase>
          </group>
          <Gantry position={[0, 0, 0]} span={6.6} height={4.0}>
            <VisionHead position={[0, 3.6, 0]} throwLength={2.6} color={GREEN} />
          </Gantry>
        </>
      )}
      {legacy && (
        <>
          {/* finished bodies waiting on one person with a gauge */}
          <ManualInspection position={[3.0, 0, 2.8]} rotation={[0, -0.9, 0]} />
          <FaultZone position={[-0.6, 0, 0]} radius={3.6} />
          <WipQueue position={[-8.4, 0, 0]} count={4} pitch={5.4} Body={TransitBody} />
          <StackLight position={[-3.4, 0, -3.0]} state="fault" />
        </>
      )}

      <group position={[-2.3, 0.2, 0]}>
        <CarBody stage="complete" />
        {!legacy && (
          <>
            <DatumPin position={[1.2, 0.3, 0.8]} color={GREEN} />
            <DatumPin position={[3.6, 0.3, -0.8]} color={GREEN} />
          </>
        )}
      </group>
      {!legacy && <ProjectedGrid position={[0, 1.72, 0]} size={[4.6, 1.8]} color={GREEN} />}

      <group position={[0, 0, -6.2]} visible={!legacy}>
        <AGV from={-13} to={15} speed={0.04}>
          <group position={[-2.3, 0.1, 0]} scale={0.9}>
            <CarBody stage="complete" skid={false} />
          </group>
          <StackLight position={[-1.6, 0, 0]} state="done" />
        </AGV>
      </group>

      {!legacy && (
        <>
          <mesh ref={pass} position={[3.6, 2.42, -2.2]}>
            <boxGeometry args={[0.46, 0.46, 0.12]} />
            <meshStandardMaterial color="#071510" emissive={GREEN} emissiveIntensity={2} />
          </mesh>
          <Cabinet position={[3.6, 0, -2.2]} rotation={[0, 0.7, 0]} accent={GREEN} />
          <HMIKiosk position={[-3.4, 0, 3.4]} rotation={[0, 0.9, 0]} accent={GREEN} />
          <Readout
            position={[0, 4.6, 0]}
            title="Quality report"
            accent={GREEN}
            rows={[
              { k: 'critical dims', v: '24 / 24', ok: true },
              { k: 'defects', v: 'none', ok: true },
              { k: 'logged', v: 'auto' },
            ]}
          />
        </>
      )}
    </group>
  )
}

/** 07 — what the cell actually changes, as a row of floor pylons. */
function Gains({ x, items = [] }) {
  const st = S(7)
  return (
    <group position={[x, 0, 0]}>
      <Threshold position={[0, 0, 3.4]} width={12} accent={st.accent} />
      <Banner position={[0, 4.6, 1.2]} width={9} height={1.4} title="WHAT CHANGES" sub="WHEN THE FIXTURES LEAVE" bg="#0a4aa0" />
      {items.map((it, i) => (
        <Pylon
          key={it.short}
          position={[-4.6 + i * 2.3, 0, -3.3 + (i % 2) * 0.7]}
          rotation={[0, 0.12 - i * 0.06, 0]}
          accent={st.accent}
          value={`0${i + 1}`}
          label={it.short.toUpperCase()}
        />
      ))}
      <group position={[4.6, 0, 3.0]} rotation={[0, -0.9, 0]}>
        <MobileBase size={[2.4, 2.0]}>
          <RobotArm program="scan" tool="scanner" scale={0.9} />
        </MobileBase>
      </group>
    </group>
  )
}

/** 08 — the demo bay: the specimen for whichever film you pick. */
function DemoBay({ x, specimen = 'tailgate' }) {
  const st = S(8)
  const { Component } = SPECIMENS[specimen] ?? {}
  return (
    <group position={[x, 0, 0]}>
      <Enclosure position={[0, 0, -3.2]} size={[12, 3.4, 7]} color="#c3d6df" accent={st.accent} roof backWall={false} />
      <Threshold position={[0, 0, 3.4]} width={11} accent={st.accent} />
      <Banner position={[0, 4.6, 1.2]} width={8} height={1.3} title="DEMO BAY" sub="APPLICATION AREAS" bg="#1593b8" />

      <group position={[-0.9, 0, 2.9]}>
        <Stand size={[3.0, 2.4]} accent={st.accent} />
        <group position={[0, 1.18, 0]} scale={1.0}>{Component && <Component />}</group>
      </group>

      <group position={[3.8, 0, 3.0]} rotation={[0, -1.1, 0]}>
        <MobileBase size={[2.4, 2.0]}>
          <RobotArm program="scan" tool="scanner" scale={0.95} />
        </MobileBase>
      </group>
      <HMIKiosk position={[-4.4, 0, -3.2]} rotation={[0, 2.2, 0]} accent={CYAN} />
      <StackLight position={[2.4, 0, -3.6]} state="measure" />
    </group>
  )
}

/** 09 — the software portfolio, one lit pod per product. */
function Software({ x, items = [] }) {
  const st = S(9)
  return (
    <group position={[x, 0, 0]}>
      <Threshold position={[0, 0, 3.2]} width={12} accent={st.accent} />
      <Banner position={[0, 4.6, 1.2]} width={9} height={1.4} title="SOFTWARE" sub="HARDWARE AGNOSTIC · INDUSTRY 4.0" bg="#4b4fc9" />
      {items.map((p, i) => (
        <group key={p.id} position={[-5.0 + i * 2.5, 0, -3.5 + (i % 2) * 0.8]}>
          <Pylon rotation={[0, 0.1 - i * 0.05, 0]} accent={st.accent} value={`0${i + 1}`} label={p.name.toUpperCase()} height={2.6} />
        </group>
      ))}
      <Cabinet position={[4.6, 0, 2.8]} rotation={[0, -0.8, 0]} accent={CYAN} />
    </group>
  )
}

/** 10 — the trade-show stand the conversation started on. */
function Showcase({ x }) {
  const st = S(10)
  const logo = useLoader(THREE.TextureLoader, '/assets/automate_logo.png')
  logo.colorSpace = THREE.SRGBColorSpace

  return (
    <group position={[x, 0, 0]}>
      <Threshold position={[0, 0, 3.0]} width={10} accent={st.accent} />
      {/* stand carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.016, -4.4]}>
        <planeGeometry args={[9, 4.4]} />
        <meshStandardMaterial color="#20304a" roughness={0.95} />
      </mesh>
      {/* back wall with the show logo */}
      <mesh position={[0, 1.9, -6.7]}>
        <planeGeometry args={[6.4, 2.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.1, -6.68]}>
        <planeGeometry args={[4.4, 1.1]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
      <Banner position={[0, 3.9, -4.4]} width={7} height={1.1} title="AUTOMATE 24" sub="ATLAS · PROCESSCHAMP" bg="#0a4aa0" />

      <group position={[-2.6, 0, -3.5]} rotation={[0, 0.5, 0]}>
        <MobileBase size={[2.6, 2.2]}>
          <RobotArm program="assemble" tool="gripper" scale={1.0} />
        </MobileBase>
      </group>
      <group position={[2.2, 0, -3.5]} rotation={[0, -0.4, 0]}>
        <Stand size={[2.4, 1.8]} accent={st.accent} />
        <group position={[0, 1.2, 0]} scale={0.8}>
          <Door rotation={[0, 0, 0.1]} />
        </group>
      </group>
      <HMIKiosk position={[3.8, 0, 2.6]} rotation={[0, -1.3, 0]} />
    </group>
  )
}

/** 11 — the front desk at the end of the line. */
function Contact({ x }) {
  const st = S(11)
  return (
    <group position={[x, 0, 0]}>
      <Threshold position={[0, 0, 3.2]} width={10} accent={st.accent} />
      <Banner position={[0, 4.6, 1.2]} width={7.5} height={1.5} title="BOOK A DEMO" sub="BRING US YOUR PART" bg="#0f8a4d" />

      <group position={[0.2, 0, -3.1]} rotation={[0, 0.1, 0]}>
        <FrontDesk />
        <Operator position={[-0.2, 0, -0.85]} rotation={[0, 0.16, 0]} />
      </group>

      {/* a last cell idling behind the desk */}
      <group position={[-3.8, 0, -4.0]} rotation={[0, 0.5, 0]}>
        <MobileBase size={[2.4, 2.0]}>
          <RobotArm program="assemble" tool="gripper" scale={0.9} />
        </MobileBase>
        <StackLight position={[1.4, 0, -0.8]} state="done" />
      </group>
      <group position={[3.9, 0, -3.4]} rotation={[0, -0.6, 0]}>
        <CarBody stage="complete" scale={0.85} />
      </group>
      <HMIKiosk position={[3.4, 0, 2.8]} rotation={[0, -1.1, 0]} accent={GREEN} />
    </group>
  )
}

const BUILDERS = [Arrival, Intake, ScanStation, Solve, Assembly, InlineCorrection, Output, Gains, DemoBay, Software, Showcase, Contact]

/**
 * Only the bays near the camera are mounted. Twelve dressed stations in the
 * scene at once cost roughly a second a frame — almost all of it on geometry
 * and shader setup for bays nobody can see from where they are standing.
 */
export default function Stations({ specimen = 'tailgate', benefits = [], products = [], window: span = 1, mode = 'processchamp' }) {
  const { camera } = useThree()
  const [center, setCenter] = useState(0)

  useFrame(() => {
    const x = camera.position.x
    let nearest = 0
    let best = Infinity
    for (let i = 0; i < STATION_X.length; i++) {
      const d = Math.abs(STATION_X[i] - x)
      if (d < best) {
        best = d
        nearest = i
      }
    }
    setCenter((prev) => (prev === nearest ? prev : nearest))
  })

  const live = []
  for (let i = center - span; i <= center + span; i++) {
    if (i >= 0 && i < BUILDERS.length) live.push(i)
  }

  return (
    <group>
      {live.map((i) => {
        const Station = BUILDERS[i]
        const extra =
          i === 7 ? { items: benefits } : i === 8 ? { specimen } : i === 9 ? { items: products } : {}
        // only the body shop has a conventional counterpart
        if (i <= 6) extra.legacy = mode === 'conventional'
        return <Station key={i} x={STATION_X[i]} {...extra} />
      })}
    </group>
  )
}
