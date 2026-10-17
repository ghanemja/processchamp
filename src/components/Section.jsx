export function SectionHead({ eyebrow, title, body, align = 'left', className = '', index }) {
  return (
    <div className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <p className="label flex items-center gap-3">
          {index && <span className="text-ink-300">{index}</span>}
          {eyebrow}
        </p>
      )}
      <h2 className="mt-4 text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.08] text-ink-900">
        {title}
      </h2>
      {body && <p className="mt-5 max-w-2xl text-pretty text-[17px] leading-[1.65] text-ink-500">{body}</p>}
    </div>
  )
}

export function Rule({ className = '' }) {
  return <div className={`h-px w-full bg-line-200 ${className}`} />
}
