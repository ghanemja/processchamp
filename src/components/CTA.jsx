import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { CONTACT } from '../data/site'

export default function CTA({
  eyebrow = 'Book a demo',
  title = 'Replace rigid fixtures with adaptive automation.',
  body = 'Our experts will work with you to find the best solution for your needs — from building a better body in white to automating on a shoestring budget.',
}) {
  return (
    <section className="border-t border-line-200 bg-blue-800 py-24 text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <Reveal>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-blue-200">{eyebrow}</p>
            <h2 className="mt-5 max-w-2xl text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-bold leading-[1.06]">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-[17px] leading-[1.65] text-blue-100/85">{body}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-3 lg:items-end">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-between gap-6 rounded-[3px] bg-white px-7 py-4 text-[15px] font-semibold text-blue-800 transition-colors hover:bg-blue-100"
            >
              Book a Demo
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M1 6h13M9.5 1.5L14 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex items-center justify-between gap-6 rounded-[3px] border border-white/30 px-7 py-4 font-mono text-[13px] transition-colors hover:border-white hover:bg-white/10"
            >
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.phoneHref}
              className="inline-flex items-center justify-between gap-6 rounded-[3px] border border-white/30 px-7 py-4 font-mono text-[13px] transition-colors hover:border-white hover:bg-white/10"
            >
              {CONTACT.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
