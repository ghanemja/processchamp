import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { SectionHead } from '../components/Section'
import CTA from '../components/CTA'

const FACTS = [
  { k: '2016', v: 'ProcessChamp founded to advance manufacturing and workforce effectiveness using AI-enabled manufacturing.' },
  { k: '65+ years', v: 'Of Atlas Industrial Contractors heritage supporting industry across North America.' },
  { k: 'Ohio & Michigan', v: 'Company locations, with access to Atlas’s other multiple locations throughout North America.' },
]

const PORTFOLIO = [
  'Positional alignment',
  'Machinery guidance',
  'Autonomous inspection and quality reporting',
  'Predictive failure analysis',
  'Digital twin process optimization',
]

const INTEGRATIONS = [
  'Robotic arms & controllers',
  'End of arm grippers',
  'Servo-controlled tooling',
  '3D vision systems',
  'Programmable logic controllers',
]

export default function About() {
  return (
    <>
      <PageHeader
        label="Our company"
        title="A tech startup with 65 years of shop floor behind it."
        body="ProcessChamp was founded in 2016 to advance manufacturing and workforce effectiveness using AI-enabled manufacturing."
      />

      <section className="border-b border-line-200 bg-paper-100 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <Reveal>
              <div className="space-y-6 text-pretty text-[17px] leading-relaxed text-ink-700">
                <p>
                  As a tech startup subsidiary of established industrial services company, Atlas Industrial
                  Contractors, it uses its heritage of over 65 years’ experience supporting industry across North
                  America to provide smarter automation solutions for Industry 4.0. With locations in Ohio and
                  Michigan, the company also has access to Atlas’s other multiple locations throughout North America.
                </p>
                <p>
                  ProcessChamp is developing a portfolio of AI software solutions for positional alignment, machinery
                  guidance, autonomous inspection and quality reporting, predictive failure analysis, and digital twin
                  process optimization.
                </p>
                <p>
                  ProcessChamp’s software solutions are hardware agnostic and are designed to integrate with all
                  commercial system components such as robotic arms/controllers, end of arm grippers, servo-controlled
                  tooling, 3D vision systems, and programmable logic controllers.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="overflow-hidden rounded-[4px] border border-line-200">
                <img
                  src="/assets/SnipImage-e1626790597370.jpg"
                  alt="ProcessChamp AI-guided robotic work cell"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[4px] border border-line-200 bg-line-200 sm:grid-cols-3">
            {FACTS.map((f) => (
              <div key={f.k} className="bg-paper-100 p-7">
                <p className="font-mono text-2xl font-medium text-blue-600">{f.k}</p>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{f.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-50 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <Reveal>
              <div>
                <SectionHead label="The portfolio" title="What we are building." />
                <ul className="mt-8 space-y-px overflow-hidden rounded-[4px] border border-line-200 bg-line-200">
                  {PORTFOLIO.map((p) => (
                    <li key={p} className="flex items-center gap-4 bg-paper-50 px-6 py-5 text-[15px] text-ink-700">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-[3px] bg-blue-600" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div>
                <SectionHead label="Hardware agnostic" title="What it plugs into." />
                <ul className="mt-8 space-y-px overflow-hidden rounded-[4px] border border-line-200 bg-line-200">
                  {INTEGRATIONS.map((p) => (
                    <li key={p} className="flex items-center gap-4 bg-paper-50 px-6 py-5 text-[15px] text-ink-700">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTA label="Work with us" title="Smarter automation solutions for Industry 4.0." />
    </>
  )
}
