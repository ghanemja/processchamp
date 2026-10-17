/**
 * Wordmark rebuilt as vector: the shipped PNG was a low-res footer lockup with
 * contact text baked in, which cannot scale into a header.
 */
export default function Logo({ className = '', showWord = true }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 44 44" className="h-7 w-7 shrink-0" aria-hidden="true">
        <circle cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeWidth="3.5" opacity="0.22" />
        <path d="M36.5 10.5A19 19 0 1 0 22 41" fill="none" stroke="var(--color-blue-600)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M17 33V13h6.4a5.6 5.6 0 0 1 0 11.2H17" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showWord && (
        <span className="text-[18px] font-bold tracking-[-0.03em] text-current">
          Process<span className="text-blue-600">Champ</span>
        </span>
      )}
    </span>
  )
}
