import { motion } from 'framer-motion'

export default function PageHeader({ eyebrow, title, body, children }) {
  return (
    <section className="relative overflow-hidden border-b border-line-200 bg-paper-50 pt-32 pb-16">
      <div className="pointer-events-none absolute inset-0 blueprint opacity-60" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl border-l-2 border-blue-600 pl-6"
        >
          {eyebrow && <p className="label">{eyebrow}</p>}
          <h1 className="mt-4 text-balance text-[clamp(2.1rem,5vw,3.75rem)] font-bold leading-[1.02] text-ink-900">
            {title}
          </h1>
          {body && <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-[1.65] text-ink-500">{body}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  )
}
