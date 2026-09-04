import { IconArrowDown, IconArrowRight } from './Icons.jsx'

const STATS = [
  { value: '50', label: 'model inputs' },
  { value: '7', label: 'categorical vocabularies' },
  { value: '2023', label: 'NYC trip records' },
  { value: 'TF 2.19', label: 'Keras 3 regressor' },
]

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid-field pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:pt-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 py-1 pl-1.5 pr-3">
          <span className="rounded-full bg-signal px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-surface-0">
            Live
          </span>
          <span className="text-[13px] text-fg-2">
            Served from a local Flask endpoint
          </span>
        </div>

        <h1 className="mt-7 max-w-4xl text-[clamp(2.25rem,6.2vw,4.25rem)] font-bold leading-[1.04] tracking-[-0.03em]">
          Know the fare
          <br className="hidden sm:block" />{' '}
          <span className="text-fg-2">before the meter starts.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-fg-2 sm:text-lg">
          A dense neural regressor trained on 2023 New York City taxi trips. It
          reads fifty engineered signals — route geometry, time of day, weather,
          congestion, vendor and rate class — and returns an expected fare in
          under a second.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#estimate"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-signal px-6 text-[15px] font-semibold text-surface-0 transition-colors hover:bg-[#ffd84d]"
          >
            Estimate a fare
            <IconArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#pipeline"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface-1 px-6 text-[15px] font-medium text-fg-2 transition-colors hover:border-line-strong hover:text-fg"
          >
            How it works
            <IconArrowDown className="h-[18px] w-[18px]" />
          </a>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:mt-20 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-surface-1 px-5 py-5 sm:px-6 sm:py-6">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="tnum block text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">
                  {s.value}
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-fg-3">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
