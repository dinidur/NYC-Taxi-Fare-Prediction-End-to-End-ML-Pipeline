export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-0">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-7 w-7 place-items-center rounded-md bg-signal text-[13px] font-bold text-surface-0"
              aria-hidden="true"
            >
              M
            </span>
            <div>
              <p className="text-[14px] font-semibold tracking-tight">Meter</p>
              <p className="text-[12px] text-fg-3">
                NYC taxi fare estimation · 2023 trip records
              </p>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#estimate" className="text-[13px] text-fg-2 hover:text-fg">
              Estimate
            </a>
            <a href="#pipeline" className="text-[13px] text-fg-2 hover:text-fg">
              Pipeline
            </a>
            <a href="#model" className="text-[13px] text-fg-2 hover:text-fg">
              Model
            </a>
          </nav>
        </div>

        <p className="mt-8 border-t border-line pt-6 text-[12px] leading-relaxed text-fg-3">
          Estimates are produced by a statistical model trained on historical
          records and are not a quotation. Actual metered fares are set by the
          NYC Taxi and Limousine Commission.
        </p>
      </div>
    </footer>
  )
}
