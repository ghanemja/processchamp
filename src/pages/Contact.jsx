import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { CONTACT } from '../data/site'

/**
 * Set VITE_FORM_ENDPOINT (Formspree, Basin, your own handler) to POST the form.
 * With no endpoint configured the form falls back to composing an email, so a
 * visitor is never left with a submit button that silently does nothing.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT

const FIELD =
  'w-full rounded-[3px] border border-line-300 bg-paper-50 px-4 py-3.5 text-[15px] text-ink-900 placeholder:text-ink-300 outline-none transition-colors focus:border-blue-600'

export default function Contact() {
  const [status, setStatus] = useState('idle')

  async function onSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const name = `${data.first ?? ''} ${data.last ?? ''}`.trim()

    if (ENDPOINT) {
      setStatus('sending')
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, name }),
        })
        setStatus(res.ok ? 'sent' : 'error')
        if (res.ok) e.currentTarget.reset()
      } catch {
        setStatus('error')
      }
      return
    }

    const body = `Name: ${name}\nEmail: ${data.email ?? ''}\n\n${data.message ?? ''}`
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      `Website enquiry from ${name || 'a visitor'}`
    )}&body=${encodeURIComponent(body)}`
    setStatus('mail')
  }

  return (
    <>
      <PageHeader label="Contact us" title="How can we help?" body="Tell us what you are trying to build, automate or measure. We will come back with the shortest route to it." />

      <section className="bg-paper-100 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal>
            <form onSubmit={onSubmit} className="rounded-[4px] border border-line-200 bg-paper-50 p-7 sm:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                    First name <span className="text-blue-600">*</span>
                  </span>
                  <input name="first" required autoComplete="given-name" className={FIELD} placeholder="Jane" />
                </label>
                <label className="block">
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                    Last name <span className="text-blue-600">*</span>
                  </span>
                  <input name="last" required autoComplete="family-name" className={FIELD} placeholder="Doe" />
                </label>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  Email <span className="text-blue-600">*</span>
                </span>
                <input name="email" type="email" required autoComplete="email" className={FIELD} placeholder="jane@company.com" />
              </label>

              <label className="mt-5 block">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  Company
                </span>
                <input name="company" autoComplete="organization" className={FIELD} placeholder="Company name" />
              </label>

              <label className="mt-5 block">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                  Message <span className="text-blue-600">*</span>
                </span>
                <textarea name="message" required rows={6} className={`${FIELD} resize-y`} placeholder="What would you like to automate?" />
              </label>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-7 w-full rounded-[3px] bg-blue-600 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              <p aria-live="polite" className="mt-4 min-h-[20px] text-center text-[13px]">
                {status === 'sent' && <span className="text-pass-600">Thanks — we have your message and will be in touch.</span>}
                {status === 'mail' && <span className="text-ink-500">Opening your email client…</span>}
                {status === 'error' && (
                  <span className="text-blue-600">
                    Something went wrong. Email us directly at {CONTACT.email}.
                  </span>
                )}
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="space-y-px overflow-hidden rounded-[4px] border border-line-200 bg-line-200">
              <a href={`mailto:${CONTACT.email}`} className="block bg-paper-100 p-8 transition-colors hover:bg-paper-200">
                <p className="label">Email</p>
                <p className="mt-3 font-mono text-lg text-ink-900">{CONTACT.email}</p>
              </a>
              <a href={CONTACT.phoneHref} className="block bg-paper-100 p-8 transition-colors hover:bg-paper-200">
                <p className="label">Phone</p>
                <p className="mt-3 font-mono text-lg text-ink-900">{CONTACT.phone}</p>
              </a>
              <div className="bg-paper-100 p-8">
                <p className="label">Locations</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
                  Ohio and Michigan, with access to Atlas Industrial Contractors locations throughout North America.
                </p>
              </div>
              <div className="bg-paper-100 p-8">
                <p className="label">Book a demo</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
                  Ask for a fixtureless assembly demonstration and we will walk your part through the cell.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
