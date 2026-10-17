import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Glyph from '../components/Glyph'
import CTA from '../components/CTA'
import { PRODUCTS } from '../data/site'

export default function Products() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }, [hash])

  return (
    <>
      <PageHeader
        label="Products & services"
        title="A portfolio of AI software solutions for Industry 4.0."
        body="Positional alignment, machinery guidance, autonomous inspection and quality reporting, predictive failure analysis, and digital twin process optimization — all hardware agnostic, designed to integrate with commercial robotic arms and controllers, end-of-arm grippers, servo-controlled tooling, 3D vision systems and PLCs."
      >
        <div className="mt-10 flex flex-wrap gap-2">
          {PRODUCTS.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="rounded-[3px] border border-line-300 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700 transition-colors hover:border-blue-600 hover:text-ink-900"
            >
              {p.name}
            </a>
          ))}
        </div>
      </PageHeader>

      <div className="bg-paper-100">
        {PRODUCTS.map((p, i) => (
          <section
            key={p.id}
            id={p.id}
            className={`scroll-mt-24 border-b border-line-200 py-20 ${i % 2 ? 'bg-paper-50' : 'bg-paper-100'}`}
          >
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <div className={`grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <Reveal>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-400">
                      0{i + 1} / {String(PRODUCTS.length).padStart(2, '0')}
                    </p>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{p.name}</h2>
                    <p className="mt-2 text-base font-medium text-blue-600">{p.tagline}</p>
                    <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-500">{p.blurb}</p>
                    {p.to && (
                      <Link
                        to={p.to}
                        className="group mt-8 inline-flex items-center gap-2 rounded-[3px] bg-blue-600 px-6 py-3 text-[14px] font-semibold text-ink-900 transition-all hover:bg-blue-700"
                      >
                        Explore {p.name}
                        <svg width="15" height="11" viewBox="0 0 16 12" fill="none" className="transition-transform group-hover:translate-x-1">
                          <path d="M1 6h13M9.5 1.5L14 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="relative aspect-square w-full max-w-sm border border-line-200 bg-paper-50 p-10 text-blue-600/35">
                    <div className="absolute inset-0 blueprint rounded-[4px] opacity-40" />
                    <div className="relative h-full w-full">
                      <Glyph name={p.glyph} />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ))}
      </div>

      <CTA label="Next step" title="Not sure which piece you need first?" body="Our engineering services team runs Smart Factory assessments and application selection analysis so the first cell you build is the right one." />
    </>
  )
}
