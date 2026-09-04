import { useId } from 'react'

/* Every control here follows the same rules:
   - a real <label> bound to the control (not a floating placeholder)
   - hint and error text wired through aria-describedby
   - aria-invalid so screen readers announce the failure
   - a 44px minimum touch target on the segmented control
   - error text that says what to do, not just "invalid" */

function Shell({ id, label, hint, error, children }) {
  const hintId = `${id}-hint`
  const errId = `${id}-err`
  return (
    <div>
      <label htmlFor={id} className="label-xs mb-1.5 block">
        {label}
      </label>
      {children({ hintId, errId })}
      {error ? (
        <p id={errId} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-fg-3">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border bg-surface-2 px-3 py-2.5 text-sm text-fg ' +
  'transition-colors placeholder:text-fg-3 ' +
  'hover:border-line-strong focus:outline-none'

export function NumberField({ label, value, onChange, hint, error, ...rest }) {
  const id = useId()
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      {({ hintId, errId }) => (
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errId : hint ? hintId : undefined}
          className={`${inputClass} tnum ${
            error ? 'border-danger/60' : 'border-line'
          }`}
          {...rest}
        />
      )}
    </Shell>
  )
}

export function SelectField({ label, value, onChange, options, hint, error }) {
  const id = useId()
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      {({ hintId, errId }) => (
        <div className="relative">
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errId : hint ? hintId : undefined}
            className={`${inputClass} appearance-none pr-9 ${
              error ? 'border-danger/60' : 'border-line'
            }`}
          >
            {options.map((o) => {
              const v = typeof o === 'string' ? o : o.value
              const l = typeof o === 'string' ? o : o.label
              return (
                <option key={v} value={v} className="bg-surface-2 text-fg">
                  {l}
                </option>
              )
            })}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      )}
    </Shell>
  )
}

export function SegmentedField({ label, value, onChange, options, hint }) {
  const id = useId()
  return (
    <div>
      <span className="label-xs mb-1.5 block" id={`${id}-label`}>
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="flex gap-1 rounded-lg border border-line bg-surface-2 p-1"
      >
        {options.map((o) => {
          const active = String(value) === String(o.value)
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`min-h-11 flex-1 rounded-md px-3 text-sm font-medium transition-colors ${
                active
                  ? 'bg-signal text-surface-0'
                  : 'text-fg-2 hover:bg-surface-3 hover:text-fg'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
      {hint && <p className="mt-1.5 text-xs text-fg-3">{hint}</p>}
    </div>
  )
}
