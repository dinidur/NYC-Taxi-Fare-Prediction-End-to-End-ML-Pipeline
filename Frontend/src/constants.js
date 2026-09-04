/* ------------------------------------------------------------------
   Category vocabularies.

   These are NOT invented. They were read directly out of your
   Backend/onehot_encoder.pkl (`encoder.categories_`).

   The encoder was fitted with handle_unknown="ignore", which means any
   string not in these lists is silently encoded as all-zeros instead of
   raising an error. The model then receives a row with a whole feature
   group blanked out and returns a confident, wrong number.

   That is why "Verifone", "Rain" and "Standard Rate" produced a bad
   prediction: the encoder knows "VERIFONE", "rain" and "1".

   Casing here is exact. Do not "tidy" it.
   ------------------------------------------------------------------ */

export const VENDORS = ['CMT', 'VERIFONE', 'VTS']

export const PAYMENT_TYPES = ['Cash', 'Credit Card', 'Dispute', 'No Charge']

export const VEHICLE_TYPES = ['Hybrid', 'Minivan', 'SUV', 'Sedan']

export const WEATHER_CONDITIONS = ['clear', 'fog', 'rain', 'snow']

export const BOROUGHS = [
  'Bronx',
  'Brooklyn',
  'Manhattan',
  'New Jersey',
  'Queens',
  'Staten Island',
]

/* rate_code is stored as *strings* in the encoder, not integers.
   Sending the number 1 instead of the string "1" is an unknown category. */
export const RATE_CODES = [
  { value: '1', label: 'Standard rate' },
  { value: '2', label: 'JFK flat fare' },
  { value: '3', label: 'Newark' },
  { value: '4', label: 'Nassau / Westchester' },
  { value: '5', label: 'Negotiated fare' },
  { value: '-1', label: 'Unknown / unmapped' },
]

export const WEATHER_LABELS = {
  clear: 'Clear',
  fog: 'Fog',
  rain: 'Rain',
  snow: 'Snow',
}

/* ------------------------------------------------------------------
   Presets — real rows, so the demo can be checked against ground truth.
   ------------------------------------------------------------------ */
export const PRESETS = [
  {
    id: 'downtown',
    name: 'Manhattan → Brooklyn, wet evening',
    note: 'Record NYC-2023-403274 · actual fare $16.55',
    actual: 16.55,
    values: {
      driver_experience_years: 9.4,
      vendor_name: 'VERIFONE',
      vehicle_type: 'Sedan',
      pickup_latitude: 40.702822,
      pickup_longitude: -74.027676,
      dropoff_latitude: 40.682758,
      dropoff_longitude: -74.000835,
      trip_distance: 2.51,
      pickup_borough: 'Manhattan',
      dropoff_borough: 'Brooklyn',
      passenger_count: 1,
      rate_code: '1',
      payment_type: 'Credit Card',
      store_and_fwd_flag: 'Y',
      weather_condition: 'rain',
      temperature_f: 68,
      precipitation_in: 0.53,
      wind_speed_mph: 3.6,
      traffic_index: 8.5,
      is_holiday: 0,
      pickup_month: 7,
      pickup_day: 19,
      pickup_hour: 19,
      pickup_minute: 36,
    },
  },
  {
    id: 'jfk',
    name: 'JFK flat fare, clear afternoon',
    note: 'Airport rate code · long distance',
    actual: null,
    values: {
      driver_experience_years: 3.1,
      vendor_name: 'VTS',
      vehicle_type: 'SUV',
      pickup_latitude: 40.6413,
      pickup_longitude: -73.7781,
      dropoff_latitude: 40.7580,
      dropoff_longitude: -73.9855,
      trip_distance: 17.4,
      pickup_borough: 'Queens',
      dropoff_borough: 'Manhattan',
      passenger_count: 2,
      rate_code: '2',
      payment_type: 'Credit Card',
      store_and_fwd_flag: 'N',
      weather_condition: 'clear',
      temperature_f: 71,
      precipitation_in: 0,
      wind_speed_mph: 6.2,
      traffic_index: 3.4,
      is_holiday: 0,
      pickup_month: 5,
      pickup_day: 12,
      pickup_hour: 14,
      pickup_minute: 5,
    },
  },
  {
    id: 'snow',
    name: 'Short Bronx hop, snow, holiday',
    note: 'Stress-tests the weather and holiday features',
    actual: null,
    values: {
      driver_experience_years: 15.0,
      vendor_name: 'CMT',
      vehicle_type: 'Hybrid',
      pickup_latitude: 40.8448,
      pickup_longitude: -73.8648,
      dropoff_latitude: 40.8621,
      dropoff_longitude: -73.8918,
      trip_distance: 1.2,
      pickup_borough: 'Bronx',
      dropoff_borough: 'Bronx',
      passenger_count: 1,
      rate_code: '1',
      payment_type: 'Cash',
      store_and_fwd_flag: 'N',
      weather_condition: 'snow',
      temperature_f: 28,
      precipitation_in: 0.31,
      wind_speed_mph: 14.8,
      traffic_index: 9.1,
      is_holiday: 1,
      pickup_month: 12,
      pickup_day: 25,
      pickup_hour: 8,
      pickup_minute: 45,
    },
  },
]

export const DEFAULT_VALUES = PRESETS[0].values

/* ------------------------------------------------------------------
   Model facts. Everything here is verified from your artefacts.
   ------------------------------------------------------------------ */
export const FEATURE_GROUPS = [
  {
    name: 'Trip geometry',
    count: 6,
    items: ['pickup_latitude', 'pickup_longitude', 'dropoff_latitude', 'dropoff_longitude', 'trip_distance', 'passenger_count'],
  },
  {
    name: 'Temporal',
    count: 5,
    items: ['pickup_month', 'pickup_day', 'pickup_hour', 'pickup_minute', 'is_holiday'],
  },
  {
    name: 'Environment',
    count: 8,
    items: ['temperature_f', 'precipitation_in', 'wind_speed_mph', 'traffic_index', 'weather_condition ×4'],
  },
  {
    name: 'Vendor & vehicle',
    count: 12,
    items: ['vendor_name ×3', 'vehicle_type ×4', 'payment_type ×4', 'store_and_fwd_flag'],
  },
  {
    name: 'Route class',
    count: 18,
    items: ['pickup_borough ×6', 'dropoff_borough ×6', 'rate_code ×6'],
  },
  {
    name: 'Driver',
    count: 1,
    items: ['driver_experience_years'],
  },
]

/* Fill these in from your own test set:
     from sklearn.metrics import mean_absolute_error, r2_score
     mean_absolute_error(y_test, model.predict(X_test))
   Leave a value as null and the card shows an honest "not measured"
   state rather than a fabricated number. */
export const EVALUATION = [
  { key: 'MAE', label: 'Mean absolute error', value: null, unit: 'USD' },
  { key: 'RMSE', label: 'Root mean squared error', value: null, unit: 'USD' },
  { key: 'R2', label: 'R² on held-out set', value: null, unit: '' },
]
