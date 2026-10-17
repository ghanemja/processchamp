import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BENEFITS, CONTACT, OVERVIEW_VIDEO, PRODUCTS, STEPS, VIDEOS } from '../data/site'
import { STATION_STYLE } from '../three/factory/layout'
import { setProgress } from '../three/factory/progress'

const FactoryCanvas = lazy(() => import('../three/FactoryCanvas'))

const STATS = [
  { k: '2016', v: 'Founded to advance AI-enabled manufacturing' },
  { k: '65+ yrs', v: 'Atlas Industrial Contractors heritage behind it' },
  { k: 'OH · MI', v: 'Locations, plus Atlas sites across North America' },
]

const srcFor = (v) =>
  v.kind === 'vimeo'
    ? `https://player.vimeo.com/video/${v.id}?autoplay=1&autopause=0&title=0&byline=0&portrait=0`
    : `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1`

/** One panel per camera waypoint — the DOM and the flight share an index. */
export const STATIONS = [
  { id: 'floor', side: 'left', kind: 'hero', eyebrow: 'The floor', tag: 'Body shop · cells 01–06' },
  {
    id: 'intake',
    side: 'right',
    eyebrow: 'Station 01 · Intake',
    tag: 'Bin picking & precision geo-locating',
    title: 'Body sides arrive as they are.',
    body: 'Nothing is pre-positioned. A 3D vision system finds each stamping in the rack, solves its pose, and hands the robot a grip — so incoming stamping variation is measured instead of assumed away.',
    chips: ['Unsorted racks', 'Pose per stamping', 'No part-specific nest'],
  },
  {
    id: 'scan',
    side: 'left',
    eyebrow: 'Station 02 · Step 01',
    tag: 'Underbody on the skid',
    title: STEPS[0].title,
    body: STEPS[0].body,
    chips: ['3D vision', 'As-found geometry', 'No teach pendant'],
  },
  {
    id: 'solve',
    side: 'right',
    eyebrow: 'Station 03 · Step 02',
    tag: 'Digital twin of the body',
    title: STEPS[1].title,
    body: STEPS[1].body,
    chips: ['Priority-based math', 'Patent pending', 'Solved in milliseconds'],
  },
  {
    id: 'assemble',
    side: 'left',
    eyebrow: 'Station 04 · Step 03',
    tag: 'Body side to underbody',
    title: STEPS[2].title,
    body: STEPS[2].body,
    chips: ['Robots are the fixture', 'Weld in free space', 'Changeover in software'],
  },
  {
    id: 'correct',
    side: 'right',
    eyebrow: 'Station 05 · Closed loop',
    tag: 'Closure fit — gap & flush',
    title: 'The door is corrected while it is still held.',
    body: 'Measurement does not end when the robot takes hold. Overhead vision reads gap and flush all the way around the door aperture, the solver re-computes the offset, and the robot drives the deviation out before the hinge is set — then confirms it on the way back out.',
    chips: ['Gap & flush, four corners', 'Error driven out in-cycle', 'Process control, not inspection'],
  },
  {
    id: 'output',
    side: 'left',
    eyebrow: 'Station 06 · Output',
    tag: 'Body in white, released',
    title: 'Quality reporting, then the cell rolls to the next job.',
    body: 'Autonomous inspection logs every critical dimension on the finished body against the record instead of a clipboard. Because the cells are mobile and the tooling is software, the same floor space runs the next model without a steel program.',
    chips: ['24 / 24 critical dims', 'Auto-logged quality record', 'Cell redeploys, not retools'],
  },
  {
    id: 'benefits',
    side: 'right',
    kind: 'benefits',
    eyebrow: 'Station 07 · Gains',
    tag: 'What changes',
    title: 'Five things change the day the fixtures leave.',
    body: 'Every cell is hardware agnostic — it integrates with commercial robotic arms and controllers, end-of-arm grippers, servo-controlled tooling, 3D vision systems and PLCs you already run.',
  },
  {
    id: 'in-action',
    side: 'left',
    kind: 'videos',
    eyebrow: 'Station 08 · Demo bay',
    tag: 'Technology in action',
    title: 'Watch it run on a real cell.',
    body: 'Pick an application area — the bay changes to that specimen, and the footage plays over it.',
  },
  {
    id: 'products',
    side: 'right',
    kind: 'products',
    eyebrow: 'Station 09 · Software',
    tag: 'Products & services',
    title: 'A portfolio of AI software for the whole cell.',
    body: 'Positional alignment, machinery guidance, autonomous inspection and quality reporting, predictive failure analysis, and digital twin process optimization.',
  },
  {
    id: 'automate',
    side: 'left',
    kind: 'automate',
    eyebrow: 'Station 10 · Showcase',
    tag: 'Automate 24',
    title: 'Thank you for visiting our booth at Automate24.',
    body: 'We enjoyed discussing your automation needs and the potential of Atlas / ProcessChamp AI Fixtureless Assembly for Toyota. Great reception of the technology.',
  },
  {
    id: 'contact',
    side: 'center',
    kind: 'contact',
    eyebrow: 'Station 11 · Front desk',
    tag: 'End of the line',
    title: 'Bring us your part.',
    body: 'Our experts will work with you to find the best solution for your needs — from building a better body in white to automating on a shoestring budget.',
  },
]

const TOYOTA_POINTS = [
  ['Fixtureless Automation', 'Eliminate the need for expensive, time-consuming jigs and fixtures.'],
  ['High-Quality Output', 'Maintain consistent, high-quality production with AI-powered process control.'],
  ['Flexibility', 'Easily adapt to new products and variants without reprogramming.'],
  ['Reduced Manpower', 'Streamline your production process and minimize reliance on manual labor.'],
]

function Chip({ children }) {
  return (
    <span className="border border-line-300 bg-white/70 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-500">
      {children}
    </span>
  )
}

function Arrow({ className = '' }) {
  return (
    <svg width="15" height="11" viewBox="0 0 16 12" fill="none" className={className}>
      <path d="M1 6h13M9.5 1.5L14 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Hero() {
  return (
    <div>
      <span className="inline-flex items-center gap-2.5 bg-blue-600 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white">Patent-pending GeoSet AI</span>
      </span>
      <h1 className="mt-5 max-w-[14ch] text-balance text-[clamp(2.1rem,5.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.03em] text-ink-900">
        Autonomous AI-driven manufacturing
      </h1>
      <p className="mt-5 max-w-lg text-pretty text-[17px] leading-[1.6] text-ink-700 sm:text-lg">
        We create modular smart work cells with factory mobility — without the need for skilled labor.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link to="/contact" className="group inline-flex items-center gap-2.5 rounded-[3px] bg-blue-600 px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700">
          Book a Demo
          <Arrow className="transition-transform group-hover:translate-x-1" />
        </Link>
        <a href="#intake" className="inline-flex items-center gap-2.5 rounded-[3px] border border-ink-900/20 bg-white/70 px-7 py-4 text-[15px] font-semibold text-ink-900 backdrop-blur transition-colors hover:border-blue-600 hover:text-blue-600">
          Walk the floor
        </a>
      </div>
      <dl className="glass mt-8 grid max-w-xl grid-cols-3 divide-x divide-line-200 rounded-[4px]">
        {STATS.map((s) => (
          <div key={s.k} className="p-3 sm:p-4">
            <dt className="font-mono text-base font-semibold text-blue-700 sm:text-xl">{s.k}</dt>
            <dd className="mt-1.5 text-[11px] leading-snug text-ink-500 sm:text-[12px]">{s.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function Panel({ station, onPickVideo, activeVideo }) {
  const { kind } = station

  return (
    <div className="glass rounded-[4px]">
      <div className="flex items-center justify-between border-b border-line-200/80 px-6 py-3">
        <p className="label">{station.eyebrow}</p>
        {station.tag && <p className="label-mute hidden sm:block">{station.tag}</p>}
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-7">
        <h2 className="text-balance text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-[1.1] text-ink-900">{station.title}</h2>
        <p className="mt-4 text-pretty text-[15.5px] leading-[1.6] text-ink-700">{station.body}</p>

        {station.chips && (
          <div className="mt-6 flex flex-wrap gap-2">
            {station.chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        )}

        {kind === 'benefits' && (
          <ul className="mt-6 divide-y divide-line-200 border-y border-line-200">
            {BENEFITS.map((b, i) => (
              <li key={b.title} className="flex gap-4 py-3">
                <span className="font-mono text-[11px] text-blue-700">0{i + 1}</span>
                <span>
                  <span className="block text-[14.5px] font-semibold leading-snug text-ink-900">{b.title}</span>
                  <span className="label-mute">{b.short}</span>
                </span>
              </li>
            ))}
          </ul>
        )}

        {kind === 'videos' && (
          <div className="mt-6 divide-y divide-line-200 border-y border-line-200">
            {VIDEOS.map((v, i) => (
              <button
                key={v.id}
                onMouseEnter={() => onPickVideo(i, false)}
                onClick={() => onPickVideo(i, true)}
                className="group flex w-full items-center gap-4 py-3 text-left"
              >
                <span className={`font-mono text-[11px] ${activeVideo === i ? 'text-blue-700' : 'text-ink-300'}`}>0{i + 1}</span>
                <span className="flex-1">
                  <span className="block text-[14.5px] font-semibold leading-snug text-ink-900">{v.title}</span>
                  <span className="label-mute">{v.tag}</span>
                </span>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activeVideo === i ? 'bg-blue-600 text-white' : 'border border-line-300 text-ink-400 group-hover:border-blue-600 group-hover:text-blue-600'}`}>
                  <svg width="8" height="10" viewBox="0 0 16 18" fill="currentColor" className="ml-0.5">
                    <path d="M16 9L0 18V0z" />
                  </svg>
                </span>
              </button>
            ))}
            <a href={`https://player.vimeo.com/video/${OVERVIEW_VIDEO.id}`} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 py-3">
              <span className="text-[14px] font-semibold text-ink-900">Full technology overview</span>
              <span className="label-mute">Vimeo ↗</span>
            </a>
          </div>
        )}

        {kind === 'products' && (
          <ul className="mt-6 divide-y divide-line-200 border-y border-line-200">
            {PRODUCTS.map((p, i) => (
              <li key={p.id}>
                <Link to={p.to ?? `/products#${p.id}`} className="group flex items-center gap-4 py-3">
                  <span className="font-mono text-[11px] text-ink-300">0{i + 1}</span>
                  <span className="flex-1">
                    <span className="block text-[14.5px] font-semibold leading-snug text-ink-900 group-hover:text-blue-600">{p.name}</span>
                    <span className="label-mute">{p.tagline}</span>
                  </span>
                  <Arrow className="text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {kind === 'automate' && (
          <dl className="mt-6 divide-y divide-line-200 border-y border-line-200">
            {TOYOTA_POINTS.map(([k, v]) => (
              <div key={k} className="py-3">
                <dt className="text-[14.5px] font-semibold text-blue-700">{k}</dt>
                <dd className="mt-0.5 text-[14px] leading-snug text-ink-500">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {kind === 'contact' && (
          <div className="mt-6 flex flex-col gap-2.5">
            <Link to="/contact" className="group inline-flex items-center justify-between gap-6 rounded-[3px] bg-blue-600 px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700">
              Book a Demo
              <Arrow className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center justify-between gap-6 rounded-[3px] border border-line-300 bg-white/70 px-6 py-3.5 font-mono text-[13px] text-ink-700 transition-colors hover:border-blue-600 hover:text-blue-600">
              {CONTACT.email}
            </a>
            <a href={CONTACT.phoneHref} className="inline-flex items-center justify-between gap-6 rounded-[3px] border border-line-300 bg-white/70 px-6 py-3.5 font-mono text-[13px] text-ink-700 transition-colors hover:border-blue-600 hover:text-blue-600">
              {CONTACT.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

/** Fixed rail showing where you are on the line. */
function Rail({ index }) {
  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-2.5 xl:flex">
      {STATION_STYLE.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3">
          <span className={`font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-300 ${i === index ? 'text-blue-700' : 'text-ink-300'}`}>
            {s.number} {s.label}
          </span>
          <span className={`block transition-all duration-300 ${i === index ? 'h-5 w-[3px] bg-blue-600' : 'h-2 w-[3px] bg-line-300'}`} />
        </div>
      ))}
    </div>
  )
}

export default function Journey() {
  const track = useRef(null)
  const [active, setActive] = useState(true)
  const [index, setIndex] = useState(0)
  const [webgl, setWebgl] = useState(true)
  const [videoIdx, setVideoIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setWebgl(!!(c.getContext('webgl2') || c.getContext('webgl')))
    } catch {
      setWebgl(false)
    }
  }, [])

  // Drive the flight from raw scroll position; no React state in the hot path.
  useEffect(() => {
    let raf = 0
    const read = () => {
      const el = track.current
      if (el) {
        const total = el.offsetHeight - window.innerHeight
        const scrolled = -el.getBoundingClientRect().top
        const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0
        setProgress(p)
        const i = Math.round(p * (STATIONS.length - 1))
        setIndex((prev) => (prev === i ? prev : i))
      }
      raf = requestAnimationFrame(read)
    }
    raf = requestAnimationFrame(read)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Stop rendering entirely once the journey scrolls out of view.
  useEffect(() => {
    const el = track.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // leaving the demo bay closes whatever was playing
  useEffect(() => {
    if (index !== 8 && playing) setPlaying(false)
  }, [index, playing])

  const onPickVideo = useCallback((i, play) => {
    setVideoIdx(i)
    if (play) setPlaying(true)
  }, [])

  const video = VIDEOS[videoIdx]

  return (
    <div ref={track} className="relative">
      <div
        className="fixed inset-0 z-0 transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0, visibility: active ? 'visible' : 'hidden' }}
        aria-hidden="true"
      >
        {webgl ? (
          <Suspense fallback={null}>
            <FactoryCanvas
              active={active}
              lively={!reduced}
              specimen={video.specimen}
              benefits={BENEFITS}
              products={PRODUCTS}
            />
          </Suspense>
        ) : (
          <video className="h-full w-full object-cover" autoPlay loop muted playsInline poster="/assets/SnipImage-e1626790597370.jpg">
            <source src="/assets/Site-Header_E1_WebM_VP9_1500kbps_1080p.webm" type="video/webm" />
          </video>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper-100/70 via-transparent to-paper-100/55" />
      </div>

      <Rail index={index} />

      {/* the footage plays over the bay it belongs to */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-30 w-[min(92vw,900px)] -translate-x-1/2 -translate-y-1/2 border border-line-300 bg-black shadow-[0_30px_80px_-30px_rgba(12,19,27,0.7)]"
          >
            <div className="aspect-video w-full">
              <iframe
                key={video.id}
                src={srcFor(video)}
                title={video.title}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => setPlaying(false)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-[3px] bg-white/90 text-ink-900 transition-colors hover:bg-white"
              aria-label="Close video"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none relative z-10">
        {STATIONS.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={`flex h-screen px-5 sm:px-8 lg:items-center lg:pb-0 lg:pt-0 ${i === 0 ? 'items-center pt-16' : 'items-end pb-20'}`}
          >
            <div className="mx-auto w-full max-w-[1440px] xl:pr-44">
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: '-32% 0px -32% 0px' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={`pointer-events-auto w-full max-w-[32rem] ${
                  s.side === 'right' ? 'lg:ml-auto lg:mr-0' : s.side === 'center' ? 'lg:mx-auto' : 'lg:mr-auto lg:ml-0'
                }`}
              >
                {s.kind === 'hero' ? <Hero /> : <Panel station={s} onPickVideo={onPickVideo} activeVideo={videoIdx} />}
              </motion.div>
            </div>
          </section>
        ))}
      </div>

      <div
        className="pointer-events-none fixed bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 lg:flex"
        style={{ opacity: index === 0 && active ? 1 : 0 }}
      >
        <span className="bg-white/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-500 backdrop-blur">
          Keep scrolling
        </span>
      </div>
    </div>
  )
}
