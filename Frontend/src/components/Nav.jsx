import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#estimate', label: 'Estimate' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#model', label: 'Model' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-surface-0/80 backdrop-blur-xl">
      <a
        href="#estimate"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-signal focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-surface-0"
      >
        Skip to the estimator
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span
            className="grid h-7 w-7 place-items-center rounded-md bg-signal text-[13px] font-bold text-surface-0"
            aria-hidden="true"
          >
            M
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Meter</span>
          <span className="hidden text-[13px] text-fg-3 sm:inline">
            / fare estimation
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#estimate"
            className="ml-2 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-surface-0 transition-colors hover:bg-[#ffd84d]"
          >
            Run a prediction
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-fg-2 md:hidden"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="m5 5 14 14" />
                <path d="m19 5-14 14" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-line bg-surface-0 px-5 py-3 md:hidden"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-fg-2 hover:bg-surface-2 hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#estimate"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-signal px-4 py-3 text-center text-sm font-semibold text-surface-0"
          >
            Run a prediction
          </a>
        </nav>
      )}
    </header>
  )
}
