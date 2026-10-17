import { Suspense, lazy, useState } from 'react'
import Reveal from '../components/Reveal'
import { SectionHead } from '../components/Section'
import { VideoCard } from '../components/VideoPlayer'
import CTA from '../components/CTA'
import { OVERVIEW_VIDEO, VIDEOS } from '../data/site'

const FixtureScene = lazy(() => import('../three/FixtureScene'))

const MODES = [
  {
    id: 'fixture',
    label: 'Rigid fixture',
    head: 'One part, one jig, one long lead time.',
    body: 'Conventional tooling holds the part to a nominal that was decided months before the metal arrived. Every variant needs new steel, new clamps and new capital.',
  },
  {
    id: 'geoset',
    label: 'GeoSet AI',
    head: 'Math holds the part instead.',
    body: 'The vision system finds the datums as they actually are, the solver computes a robot position that hits the critical dimensions, and the robots become the fixture.',
  },
]

const APPLICATIONS = [
  { k: 'Body in white', v: 'Build a better body in white by driving every panel to its critical datums instead of to a fixed jig.' },
  { k: 'Adaptive tooling', v: 'Smart fixture tooling that repositions itself for the part in front of it, not the part it was designed for.' },
  { k: 'Fixtureless manufacturing', v: 'Remove the jig entirely — robots hold, align and join components in free space.' },
  { k: 'Shoestring automation', v: 'Automate without a tooling program, so low-volume and high-mix work becomes reachable.' },
]

export default function GeoSetAI() {
  const [mode, setMode] = useState('geoset')
  const active = MODES.find((m) => m.id === mode)

  return (
    <>
      <section className="relative overflow-hidden border-b border-line-200 bg-paper-100 pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 blueprint opacity-25" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="label">Patent pending</p>
            <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold leading-[1.02] tracking-tight text-ink-900">
              GeoSet{' '}
              <span className="text-blue-600">AI</span>
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-ink-700">
              A patent-pending software solution consisting of priority-based intelligent math algorithms supported by
              integrated systems and hardware for smart fixture tooling and robotic guidance. With applications for both
              fixtureless manufacturing and adaptive tooling, the system uses a 3D vision system to inspect incoming
              parts, then computes a robot solution to assemble components that achieve critical dimensions.
            </p>
            <p className="mt-5 text-pretty text-base leading-relaxed text-ink-500">
              From building a better body in white to automating on a shoestring budget, our experts will work with you
              to find the best solution for your needs by replacing rigid fixtures with adaptive automation.
            </p>

            <div className="mt-9 inline-flex rounded-[3px] border border-line-300 bg-paper-100 p-1">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded-[3px] px-5 py-2.5 text-[13px] font-semibold transition-all ${
                    mode === m.id ? 'bg-blue-600 text-ink-900' : 'text-ink-700 hover:text-ink-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="mt-6 max-w-md">
              <h2 className="text-lg font-semibold text-ink-900">{active.head}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{active.body}</p>
            </div>
          </div>

          <div className="relative h-[58vh] min-h-[420px] overflow-hidden rounded-[4px] border border-line-200 bg-paper-50">
            <Suspense fallback={<div className="absolute inset-0 blueprint opacity-40" />}>
              <FixtureScene mode={mode} />
            </Suspense>
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5">
              <span className="rounded-[3px] border border-line-300 bg-paper-50/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-blue-600 backdrop-blur">
                {active.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">Drag to orbit</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line-200 bg-paper-50 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHead
              label="See it run"
              title="Watch our technology in action in the video below to see how you can put the power of AI-powered manufacturing to work for your company."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <VideoCard video={OVERVIEW_VIDEO} poster="/assets/SnipImage-e1626790597370.jpg" large className="lg:h-full" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {VIDEOS.slice(0, 2).map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper-100 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionHead label="Where it applies" title="Two modes, one solver." />
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[4px] border border-line-200 bg-line-200 sm:grid-cols-2">
            {APPLICATIONS.map((a, i) => (
              <Reveal key={a.k} delay={i * 0.06} className="h-full">
                <div className="h-full bg-paper-100 p-8 transition-colors hover:bg-paper-200">
                  <h3 className="text-xl font-semibold text-ink-900">{a.k}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{a.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA title="Put the power of AI-powered manufacturing to work." />
    </>
  )
}
