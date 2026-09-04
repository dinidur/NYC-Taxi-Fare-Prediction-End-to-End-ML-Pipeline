/* Base URL.
   In dev this stays "/api" and Vite proxies it to Flask on :5000
   (see vite.config.js), so the browser never makes a cross-origin
   request and CORS is not involved.
   For a real deployment, set VITE_API_URL in a .env file. */
const BASE = import.meta.env.VITE_API_URL ?? '/api'

const NUMERIC_FIELDS = [
  'driver_experience_years',
  'pickup_latitude',
  'pickup_longitude',
  'dropoff_latitude',
  'dropoff_longitude',
  'trip_distance',
  'passenger_count',
  'temperature_f',
  'precipitation_in',
  'wind_speed_mph',
  'traffic_index',
  'is_holiday',
  'pickup_month',
  'pickup_day',
  'pickup_hour',
  'pickup_minute',
]

/**
 * Coerce form state into the exact shape the Flask endpoint expects.
 *
 * Type discipline matters here. app.py does pd.DataFrame([data]), so a
 * numeric arriving as the string "3.5" produces an object-dtype column
 * and scaler.transform raises. And rate_code must stay a *string*,
 * because the encoder's categories are strings.
 */
export function buildPayload(form) {
  const out = {}
  for (const [k, v] of Object.entries(form)) {
    out[k] = NUMERIC_FIELDS.includes(k) ? Number(v) : v
  }
  out.rate_code = String(form.rate_code)
  out.store_and_fwd_flag = form.store_and_fwd_flag === 'Y' ? 'Y' : 'N'
  return out
}

export class ApiError extends Error {
  constructor(message, { kind = 'server', status = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

export async function predictFare(form, { timeoutMs = 15000 } = {}) {
  const payload = buildPayload(form)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const started = performance.now()

  let response
  try {
    response = await fetch(`${BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      throw new ApiError(
        `The API did not respond within ${timeoutMs / 1000}s.`,
        { kind: 'timeout' }
      )
    }
    throw new ApiError(
      'Could not reach the prediction API. Start the Flask server with "python app.py" in the Backend folder.',
      { kind: 'network' }
    )
  }
  clearTimeout(timer)

  const latency = Math.round(performance.now() - started)

  let body
  try {
    body = await response.json()
  } catch {
    throw new ApiError(
      `The API returned a non-JSON response (HTTP ${response.status}).`,
      { kind: 'server', status: response.status }
    )
  }

  if (!response.ok || body?.error) {
    throw new ApiError(body?.error ?? `Request failed (HTTP ${response.status}).`, {
      kind: 'server',
      status: response.status,
    })
  }

  if (typeof body?.predicted_fare !== 'number' || Number.isNaN(body.predicted_fare)) {
    throw new ApiError('The API responded without a numeric predicted_fare.', {
      kind: 'server',
      status: response.status,
    })
  }

  return { fare: body.predicted_fare, latency, payload }
}

export const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
