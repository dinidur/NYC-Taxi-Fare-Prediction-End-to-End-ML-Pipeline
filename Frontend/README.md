# Meter — NYC taxi fare estimation (frontend)

Single-page React + Tailwind CSS interface for the Flask fare-prediction API
in `../Backend`.

## Requirements

- Node.js 20.19 or newer (`node -v` to check)
- The Flask API running on port 5000

## Run it

```bash
cd Frontend
npm install
npm run dev
```

Open http://localhost:5173.

In a second terminal, start the API:

```bash
cd Backend
.\.venv\Scripts\activate
python app.py
```

The Vite dev server proxies `/api/*` to `http://127.0.0.1:5000/*`
(see `vite.config.js`), so the browser only ever talks to one origin and
**CORS is not involved during development**. You only need `flask-cors` when
you deploy the frontend to a different host than the API.

## Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serves dist/ on port 4173
```

`npm run preview` does **not** run the proxy. For a real deployment, set
`VITE_API_URL` in a `.env` file (copy `.env.example`) and enable CORS on the
Flask side.

## The category vocabularies are not decorative

`src/constants.js` holds the exact category strings read out of
`Backend/onehot_encoder.pkl`:

| Column | Accepted values |
| --- | --- |
| `vendor_name` | `CMT`, `VERIFONE`, `VTS` |
| `payment_type` | `Cash`, `Credit Card`, `Dispute`, `No Charge` |
| `vehicle_type` | `Hybrid`, `Minivan`, `SUV`, `Sedan` |
| `weather_condition` | `clear`, `fog`, `rain`, `snow` |
| `pickup_borough` / `dropoff_borough` | `Bronx`, `Brooklyn`, `Manhattan`, `New Jersey`, `Queens`, `Staten Island` |
| `rate_code` | `"-1"`, `"1"`, `"2"`, `"3"`, `"4"`, `"5"` — **strings** |

The encoder was fitted with `handle_unknown="ignore"`. An unrecognised string
does not raise an error: it is encoded as all zeros, the model receives a row
with a whole feature group blanked out, and it returns a plausible but wrong
number. Sending `"Verifone"` instead of `"VERIFONE"` is enough to do this.

Every control in the UI is a `<select>` bound to these lists, so the interface
cannot produce an unknown category. Keep it that way — do not replace the
selects with free-text inputs.

## Project structure

```
Frontend/
├── index.html
├── vite.config.js          dev proxy to Flask
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css           design tokens (Tailwind v4 @theme)
    ├── api.js              payload coercion, timeout, error handling
    ├── constants.js        encoder vocabularies, presets, model facts
    └── components/
        ├── Nav.jsx
        ├── Hero.jsx
        ├── Predictor.jsx   the form and result panel
        ├── HowItWorks.jsx
        ├── ModelCard.jsx
        ├── Footer.jsx
        ├── Field.jsx       accessible form controls
        └── Icons.jsx
```

## Before you show this to anyone

`EVALUATION` in `src/constants.js` has `null` values, and the model card
renders them as "not measured yet". Fill them in:

```python
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
pred = model.predict(X_test).ravel()
print(mean_absolute_error(y_test, pred), root_mean_squared_error(y_test, pred), r2_score(y_test, pred))
```
