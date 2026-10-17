import { Link } from 'react-router-dom'
import Logo from './Logo'

/**
 * Just the mark. The walk carries its own navigation — each station links on
 * to the page it belongs to — and the footer holds the full index.
 */
export default function Nav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1440px] items-center px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center rounded-[3px] bg-paper-50/85 px-3 py-2 backdrop-blur transition-colors hover:bg-paper-50"
          aria-label="ProcessChamp home"
        >
          <Logo className="text-ink-900" />
        </Link>
      </div>
    </header>
  )
}
