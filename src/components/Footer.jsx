import { Link } from 'react-router-dom'
import Logo from './Logo'
import { NAV, CONTACT, PRODUCTS } from '../data/site'

export default function Footer() {
  return (
    <footer className="border-t border-line-200 bg-paper-50">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 border-b border-line-200 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo className="text-ink-900" />
            <p className="mt-5 max-w-sm text-[15px] leading-[1.6] text-ink-500">
              Autonomous AI-driven manufacturing. Modular smart work cells with factory mobility, built without the
              need for skilled labor — a tech subsidiary of Atlas Industrial Contractors.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={`mailto:${CONTACT.email}`}
                className="rounded-[3px] border border-line-300 px-4 py-2 font-mono text-[12px] text-ink-700 transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                {CONTACT.email}
              </a>
              <a
                href={CONTACT.phoneHref}
                className="rounded-[3px] border border-line-300 px-4 py-2 font-mono text-[12px] text-ink-700 transition-colors hover:border-blue-600 hover:text-blue-600"
              >
                {CONTACT.phone}
              </a>
            </div>
          </div>

          <div>
            <h3 className="label-mute">Navigate</h3>
            <ul className="mt-5 space-y-2.5">
              {NAV.map((n) => (
                <li key={n.label}>
                  <Link to={n.to} className="text-[15px] text-ink-700 transition-colors hover:text-blue-600">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label-mute">Products &amp; Services</h3>
            <ul className="mt-5 space-y-2.5">
              {PRODUCTS.map((p) => (
                <li key={p.id}>
                  <Link to={p.to ?? `/products#${p.id}`} className="text-[15px] text-ink-700 transition-colors hover:text-blue-600">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 pt-7 sm:flex-row sm:items-center">
          <p className="font-mono text-[11.5px] text-ink-400">© {new Date().getFullYear()} ProcessChamp — All Rights Reserved</p>
          <p className="font-mono text-[11.5px] text-ink-400">Ohio · Michigan · North America</p>
        </div>
      </div>
    </footer>
  )
}
