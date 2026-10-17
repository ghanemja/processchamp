import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden bg-paper-100 px-5 pt-24 text-center">
      <div className="pointer-events-none absolute inset-0 blueprint opacity-30" />
      <div className="relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-blue-600">Error 404</p>
        <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-ink-900 sm:text-7xl">Off the datum.</h1>
        <p className="mx-auto mt-5 max-w-md text-ink-500">
          That page is not in the cell. Let us put you back on a critical dimension.
        </p>
        <Link
          to="/"
          className="mt-9 inline-flex rounded-[3px] bg-blue-600 px-7 py-3.5 text-[15px] font-semibold text-ink-900 transition-colors hover:bg-blue-700"
        >
          Back to home
        </Link>
      </div>
    </section>
  )
}
