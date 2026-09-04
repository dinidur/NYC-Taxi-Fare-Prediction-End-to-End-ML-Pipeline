import { useMemo, useState } from 'react'
import {
  BOROUGHS,
  DEFAULT_VALUES,
  PAYMENT_TYPES,
  PRESETS,
  RATE_CODES,
  VEHICLE_TYPES,
  VENDORS,
  WEATHER_CONDITIONS,
  WEATHER_LABELS,
} from '../constants.js'
import { predictFare, usd } from '../api.js'
import { NumberField, SegmentedField, SelectField } from './Field.jsx'
import { IconAlert, IconCloud, IconRefresh, IconRoute, IconTag } from './Icons.jsx'

const RANGES = {
  trip_distance: [0.01, 200, 'Distance must be greater than 0.'],
  passenger_count: [1, 6, 'A yellow cab seats between 1 and 6 passengers.'],
  pickup_latitude: [39.5, 41.5, 'Latitude is outside the New York metro area.'],
  dropoff_latitude: [39.5, 41.5, 'Latitude is outside the New York metro area.'],
  pickup_longitude: [-75.5, -71.5, 'Longitude is outside the New York metro area.'],
  dropoff_longitude: [-75.5, -71.5, 'Longitude is outside the New York metro area.'],
  pickup_month: [1, 12, 'Month runs from 1 to 12.'],
  pickup_day: [1, 31, 'Day runs from 1 to 31.'],
  pickup_hour: [0, 23, 'Hour runs from 0 to 23.'],
  pickup_minute: [0, 59, 'Minute runs from 0 to 59.'],
  traffic_index: [0, 10, 'The traffic index is scaled from 0 to 10.'],
  temperature_f: [-20, 125, 'Temperature is outside a plausible range.'],
  precipitation_in: [0, 12, 'Precipitation cannot be negative.'],
  wind_speed_mph: [0, 120, 'Wind speed is outside a plausible range.'],
  driver_experience_years: [0, 60, 'Experience must be between 0 and 60 years.'],
}

function validate(form) {
  const errors = {}
  for (const [field, [min, max, message]] of Object.entries(RANGES)) {
    const n = Number(form[field])
    if (form[field] === '' || Number.isNaN(n) || n < min || n > max) {
      errors[field] = message
    }
  }
  return errors
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-signal">
        <Icon className="h-[17px] w-[17px]" />
      </span>
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
        <p className="mt-0.5 text-[13px] text-fg-3">{description}</p>
      </div>
    </div>
  )
}

export default function Predictor() {
  const [form, setForm] = useState(DEFAULT_VALUES)
  const [activePreset, setActivePreset] = useState(PRESETS[0].id)
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [result, setResult] = useState(null)
  const [failure, setFailure] = useState(null)
  const [touched, setTouched] = useState(false)

  const errors = useMemo(() => validate(form), [form])
  const errorCount = Object.keys(errors).length

  const set = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setActivePreset(null)
  }

  const applyPreset = (preset) => {
    setForm(preset.values)
    setActivePreset(preset.id)
    setStatus('idle')
    setResult(null)
    setFailure(null)
    setTouched(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    if (errorCount > 0) {
      // Wait one frame: aria-invalid only appears after the re-render that
      // setTouched triggers, so querying immediately would find nothing.
      requestAnimationFrame(() => {
        const first = document.querySelector('[aria-invalid="true"]')
        first?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        first?.focus({ preventScroll: true })
      })
      return
    }
    setStatus('loading')
    setFailure(null)
    try {
      const res = await predictFare(form)
      setResult(res)
      setStatus('done')
    } catch (err) {
      setFailure(err)
      setStatus('error')
    }
  }

  const err = (k) => (touched ? errors[k] : undefined)
  const preset = PRESETS.find((p) => p.id === activePreset)
  const groundTruth = preset?.actual ?? null

  return (
    <section id="estimate" className="border-t border-line bg-surface-0">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="label-xs">Live inference</p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-[-0.02em]">
            Estimate a fare
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-2">
            Every field below maps to a column the model was trained on. The
            categorical options are read from the fitted encoder, so nothing you
            can select here is an unknown category.
          </p>
        </div>

        {/* Presets */}
        <div className="mt-8 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p)}
              aria-pressed={activePreset === p.id}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                activePreset === p.id
                  ? 'border-signal/60 bg-signal/10 text-signal'
                  : 'border-line bg-surface-1 text-fg-2 hover:border-line-strong hover:text-fg'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          {/* ---------------- Form ---------------- */}
          <form onSubmit={onSubmit} noValidate className="min-w-0 space-y-6">
            <fieldset className="rounded-[14px] border border-line bg-surface-1 p-5 sm:p-6">
              <SectionHeading
                icon={IconRoute}
                title="Route"
                description="Where the trip starts, where it ends, how far it runs."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Trip distance (miles)"
                  value={form.trip_distance}
                  onChange={set('trip_distance')}
                  error={err('trip_distance')}
                  step="0.01"
                  min="0"
                />
                <NumberField
                  label="Passengers"
                  value={form.passenger_count}
                  onChange={set('passenger_count')}
                  error={err('passenger_count')}
                  step="1"
                  min="1"
                  max="6"
                />
                <SelectField
                  label="Pickup borough"
                  value={form.pickup_borough}
                  onChange={set('pickup_borough')}
                  options={BOROUGHS}
                />
                <SelectField
                  label="Dropoff borough"
                  value={form.dropoff_borough}
                  onChange={set('dropoff_borough')}
                  options={BOROUGHS}
                />
                <NumberField
                  label="Pickup latitude"
                  value={form.pickup_latitude}
                  onChange={set('pickup_latitude')}
                  error={err('pickup_latitude')}
                  step="0.000001"
                />
                <NumberField
                  label="Pickup longitude"
                  value={form.pickup_longitude}
                  onChange={set('pickup_longitude')}
                  error={err('pickup_longitude')}
                  step="0.000001"
                />
                <NumberField
                  label="Dropoff latitude"
                  value={form.dropoff_latitude}
                  onChange={set('dropoff_latitude')}
                  error={err('dropoff_latitude')}
                  step="0.000001"
                />
                <NumberField
                  label="Dropoff longitude"
                  value={form.dropoff_longitude}
                  onChange={set('dropoff_longitude')}
                  error={err('dropoff_longitude')}
                  step="0.000001"
                />
              </div>
            </fieldset>

            <fieldset className="rounded-[14px] border border-line bg-surface-1 p-5 sm:p-6">
              <SectionHeading
                icon={IconCloud}
                title="Conditions"
                description="When the trip happened and what the street looked like."
              />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <NumberField
                  label="Month"
                  value={form.pickup_month}
                  onChange={set('pickup_month')}
                  error={err('pickup_month')}
                  min="1"
                  max="12"
                />
                <NumberField
                  label="Day"
                  value={form.pickup_day}
                  onChange={set('pickup_day')}
                  error={err('pickup_day')}
                  min="1"
                  max="31"
                />
                <NumberField
                  label="Hour"
                  value={form.pickup_hour}
                  onChange={set('pickup_hour')}
                  error={err('pickup_hour')}
                  min="0"
                  max="23"
                />
                <NumberField
                  label="Minute"
                  value={form.pickup_minute}
                  onChange={set('pickup_minute')}
                  error={err('pickup_minute')}
                  min="0"
                  max="59"
                />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label="Weather"
                  value={form.weather_condition}
                  onChange={set('weather_condition')}
                  options={WEATHER_CONDITIONS.map((w) => ({
                    value: w,
                    label: WEATHER_LABELS[w],
                  }))}
                  hint="Sent lowercase — that is how the encoder learned it."
                />
                <SegmentedField
                  label="Public holiday"
                  value={form.is_holiday}
                  onChange={set('is_holiday')}
                  options={[
                    { value: 0, label: 'No' },
                    { value: 1, label: 'Yes' },
                  ]}
                />
                <NumberField
                  label="Temperature (°F)"
                  value={form.temperature_f}
                  onChange={set('temperature_f')}
                  error={err('temperature_f')}
                  step="0.1"
                />
                <NumberField
                  label="Precipitation (in)"
                  value={form.precipitation_in}
                  onChange={set('precipitation_in')}
                  error={err('precipitation_in')}
                  step="0.01"
                  min="0"
                />
                <NumberField
                  label="Wind speed (mph)"
                  value={form.wind_speed_mph}
                  onChange={set('wind_speed_mph')}
                  error={err('wind_speed_mph')}
                  step="0.1"
                  min="0"
                />
                <NumberField
                  label="Traffic index"
                  value={form.traffic_index}
                  onChange={set('traffic_index')}
                  error={err('traffic_index')}
                  step="0.1"
                  min="0"
                  max="10"
                  hint="0 = free flowing, 10 = gridlock."
                />
              </div>
            </fieldset>

            <fieldset className="rounded-[14px] border border-line bg-surface-1 p-5 sm:p-6">
              <SectionHeading
                icon={IconTag}
                title="Trip metadata"
                description="Vendor, vehicle and rate class recorded by the meter."
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label="Vendor"
                  value={form.vendor_name}
                  onChange={set('vendor_name')}
                  options={VENDORS}
                />
                <SelectField
                  label="Vehicle type"
                  value={form.vehicle_type}
                  onChange={set('vehicle_type')}
                  options={VEHICLE_TYPES}
                />
                <SelectField
                  label="Payment type"
                  value={form.payment_type}
                  onChange={set('payment_type')}
                  options={PAYMENT_TYPES}
                />
                <SelectField
                  label="Rate code"
                  value={form.rate_code}
                  onChange={set('rate_code')}
                  options={RATE_CODES}
                  hint="Sent as a string, never as a number."
                />
                <NumberField
                  label="Driver experience (years)"
                  value={form.driver_experience_years}
                  onChange={set('driver_experience_years')}
                  error={err('driver_experience_years')}
                  step="0.1"
                  min="0"
                />
                <SegmentedField
                  label="Store and forward"
                  value={form.store_and_fwd_flag}
                  onChange={set('store_and_fwd_flag')}
                  options={[
                    { value: 'N', label: 'No' },
                    { value: 'Y', label: 'Yes' },
                  ]}
                />
              </div>
            </fieldset>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-signal px-6 text-[15px] font-semibold text-surface-0 transition-colors hover:bg-[#ffd84d] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-8"
              >
                {status === 'loading' ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-surface-0/30 border-t-surface-0"
                      aria-hidden="true"
                    />
                    Predicting…
                  </>
                ) : (
                  'Predict fare'
                )}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(PRESETS[0])}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface-1 px-5 text-[15px] font-medium text-fg-2 transition-colors hover:border-line-strong hover:text-fg"
              >
                <IconRefresh className="h-[17px] w-[17px]" />
                Reset
              </button>
              {touched && errorCount > 0 && (
                <p className="text-[13px] text-danger sm:ml-1">
                  {errorCount === 1
                    ? '1 field needs attention.'
                    : `${errorCount} fields need attention.`}
                </p>
              )}
            </div>
          </form>

          {/* ---------------- Result ---------------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="overflow-hidden rounded-[14px] border border-line bg-surface-1"
              aria-live="polite"
            >
              <div className="border-b border-line px-6 py-4">
                <p className="label-xs">Predicted fare</p>
              </div>

              <div className="px-6 py-7">
                {status === 'error' ? (
                  <div className="flex gap-3">
                    <IconAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
                    <div>
                      <p className="text-sm font-semibold text-danger">
                        {failure?.kind === 'network'
                          ? 'API unreachable'
                          : failure?.kind === 'timeout'
                            ? 'Request timed out'
                            : 'Prediction failed'}
                      </p>
                      <p className="mt-1.5 break-words text-[13px] leading-relaxed text-fg-2">
                        {failure?.message}
                      </p>
                    </div>
                  </div>
                ) : status === 'done' && result ? (
                  <>
                    <p className="tnum text-[clamp(2.5rem,7vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-fg">
                      {usd.format(result.fare)}
                    </p>
                    <p className="mt-3 text-[13px] text-fg-3">
                      Base fare only — excludes tolls, surcharges and tip.
                    </p>

                    {groundTruth !== null && (
                      <div className="mt-6 rounded-lg border border-line bg-surface-2 px-4 py-3.5">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[13px] text-fg-2">
                            Recorded fare
                          </span>
                          <span className="tnum text-sm font-semibold text-fg">
                            {usd.format(groundTruth)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-baseline justify-between gap-3">
                          <span className="text-[13px] text-fg-2">
                            Absolute error
                          </span>
                          <span
                            className={`tnum text-sm font-semibold ${
                              Math.abs(result.fare - groundTruth) < 1.5
                                ? 'text-positive'
                                : 'text-signal'
                            }`}
                          >
                            {usd.format(Math.abs(result.fare - groundTruth))} (
                            {(
                              (Math.abs(result.fare - groundTruth) /
                                groundTruth) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </div>
                      </div>
                    )}

                    <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-[13px]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-fg-3">Round trip latency</dt>
                        <dd className="tnum text-fg-2">{result.latency} ms</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-fg-3">Features sent</dt>
                        <dd className="tnum text-fg-2">
                          {Object.keys(result.payload).length}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-fg-3">Endpoint</dt>
                        <dd className="font-mono text-fg-2">POST /predict</dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <>
                    <p
                      className="tnum text-[clamp(2.5rem,7vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-line-strong"
                      aria-hidden="true"
                    >
                      $--.--
                    </p>
                    <p className="mt-4 text-[13px] leading-relaxed text-fg-3">
                      Pick a preset or fill the form, then run the model. The
                      Flask server must be running on port 5000.
                    </p>
                  </>
                )}
              </div>
            </div>

            {preset?.note && (
              <p className="mt-3 px-1 text-[12px] leading-relaxed text-fg-3">
                {preset.note}
              </p>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
