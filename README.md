# 🚕 NYC Taxi Fare Prediction

Predicting New York City taxi fares from trip, location and weather data — with an end-to-end pipeline that treats data quality as the main problem rather than an afterthought.

**R² 0.920 · MAE $6.02 · served through a Flask REST API**

---

## Results

| Metric | Value |
|---|---|
| R² | **0.920** |
| MAE | **$6.02** |
| RMSE | $8.55 |
| MAPE | 14.8% |
| Baseline MAE (predict the mean) | $22.45 |
| **Improvement over baseline** | **73.2%** |

Benchmarked against a Random Forest for context:

| Model | R² |
|---|---|
| Mean-prediction baseline | — (MAE $22.45) |
| Artificial Neural Network | 0.920 |
| Random Forest (200 trees) | 0.941 |

The Random Forest edges out the neural network by 0.021 R². It is reported here rather than omitted: the ANN was the required architecture for this milestone, and knowing that a tree ensemble matches or beats it on 5,120 tabular rows is a more useful finding than a single unchallenged number.

---

## The actual problem: the data

A null check reports this dataset as mostly clean. It is not. Every defect below is stored as a **valid value**, so `df.isnull().sum()` cannot see any of it.

### Sentinel values masquerading as measurements

`temperature_f` contains **37 records set to −999**, separated by a wide empty gap from the genuine readings of 1.0 °F to 105.0 °F. A temperature of −999 °F is physically impossible; it is the source system's marker for a missing weather reading.

| | Skewness |
|---|---|
| As stored | **−10.789** |
| With −999 excluded | **−0.125** |

Thirty-seven rows out of 5,120 dragged the column from near-symmetric to severely skewed, and pulled the mean down by about seven degrees.

### Coordinates: two separate defects

1. **Missing coordinates stored as `0.0`** — the point 0°N 0°E lies in the Atlantic Ocean off West Africa, and cannot represent a New York taxi trip.
2. **Latitude and longitude written into each other's columns** — a set of records hold a negative latitude and a positive longitude, the exact reverse of the correct signs for New York (lat 40.4 to 41.0, lon −74.3 to −73.6).

Plotting the raw coordinates makes both visible immediately; neither is visible to any missing-value summary.

### One category, many labels

Three categorical columns carry the same real-world category under multiple labels, which would fragment any encoding applied downstream.

| Column | Labels stored | Real categories | Example of the split |
|---|---|---|---|
| `payment_type` | 7 | 4 | `CRD` (732) and `Credit Card` (2,544) are the same method |
| `weather_condition` | 6 | 4 | `RAIN` (89) and `Rain` (1,049); `Clear` (2,964) and `clear` (238) |
| `rate_code` | 10 | ~5 | numeric codes `1`–`5` stored alongside their own text descriptions |

`rate_code` is the worst case: it mixes codes with descriptions in the same column. Group statistics confirm they are duplicates rather than distinct tariffs — code `1` (mean fare $35.05) and `Standard Rate` ($40.30) describe the same rate, as do code `4` ($163.73) and `Nassau/Westchester` ($167.49). This also explains its 37.93% missing rate: the column is populated by two different upstream systems.

### Impossible records

- **88 records** report a `trip_distance` of exactly 0
- **64 records** report a `passenger_count` of 0
- **120 duplicate rows**
- Negative `fare_amount` values, down to −$85.09

All of these carry a positive fare. A journey of zero miles carrying zero passengers cannot generate a charge.

---

## Target leakage audit

Every candidate feature was tested against one question: **would this value be known at the moment the prediction has to be made?**

| Column | r with `fare_amount` | Why it was excluded |
|---|---|---|
| `total_amount` | **0.752** | Defined as `fare + tip + tolls + surcharges` — it contains the target by construction |
| `tip_amount` | 0.447 | Recorded after the trip ends |
| `tolls_amount` | 0.425 | Recorded after the trip ends |
| `extra_surcharge`, `mta_tax`, `improvement_surcharge`, `congestion_surcharge` | — | Billing components added to the fare |
| `trip_rating` | — | Submitted after the trip ends |

`total_amount` appearing near the top of the correlation table is not evidence of a useful predictor; it is evidence of leakage. A model given that column would report near-perfect accuracy while having learned nothing, and would fail immediately on live data where the total is not yet known.

`trip_duration` (r = 0.634) sits in the middle: legitimate for predicting a fare **after** the trip, unavailable for predicting one **at pickup**. The prediction point is stated explicitly so the feature set can match it.

---

## Target transformation

`fare_amount` is heavily right-skewed. Four candidates were compared on skewness and Q-Q alignment:

| Transformation | Skewness |
|---|---|
| Raw | 7.941 |
| Square root | 1.991 |
| Log | 0.084 |
| **Box-Cox** | **−0.004** |

Box-Cox was selected — its Q-Q plot aligns most closely with the normal line.

Outlier exposure was quantified with two methods: IQR flags 168 records (3.37%, bounds −$33.31 to $121.53), Z-score `|Z| > 3` flags 171 (3.43%). The 99th percentile is $176.54 against a maximum of $986.60.

---

## What drives the fare

Random Forest feature importances:

| Feature | Importance |
|---|---|
| `trip_distance` | 0.588 |
| `dropoff_borough_Staten Island` | 0.185 |
| `pickup_latitude` | 0.080 |
| `pickup_longitude` | 0.025 |
| `dropoff_latitude` | 0.025 |
| `dropoff_longitude` | 0.024 |

Geography is the strongest categorical driver. Mean fare by pickup borough:

| Borough | Mean fare |
|---|---|
| Staten Island | **$165.02** |
| New Jersey | $81.92 |
| Manhattan | $41.97 |
| Brooklyn | $39.94 |

Staten Island trips average roughly four times the Manhattan fare — consistent with the geography, since those journeys cross water and cover far longer distances.

By contrast, `vehicle_type` varies only between $45.71 and $49.85 across all four categories, and `is_holiday` between $47.43 and $52.97 — differences far smaller than the within-group spread. The weather and traffic predictors produce flat, formless scatter against the target.

**Multicollinearity:** VIF peaks at 4.01 (`trip_duration`) and 3.70 (`trip_distance`), both below the conventional threshold of 5. Their pairwise correlation is 0.811, so rather than dropping either, an `average_speed` feature captures the relationship more efficiently.

---

## Repository structure

```
.
├── notebooks/
│   ├── EDA_DiniduRukshan.ipynb          # Part A — exploratory analysis, defect catalogue
│   └── Model_Training.ipynb             # Part B — cleaning, features, ANN, evaluation
├── artifacts/
│   ├── fare_model.keras                 # trained ANN
│   ├── scaler.pkl                       # fitted StandardScaler
│   ├── onehot_encoder.pkl               # fitted OneHotEncoder
│   └── feature_names.pkl                # training column order
├── app.py                               # Flask REST API
├── requirements.txt
└── README.md
```

---

## Setup

```bash
git clone <repo-url> && cd nyc-taxi-fare-prediction
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

### Run the notebooks

```bash
jupyter lab notebooks/EDA_DiniduRukshan.ipynb      # Part A
jupyter lab notebooks/Model_Training.ipynb         # Part B — writes artifacts/
```

### Serve the API

```bash
python app.py            # http://127.0.0.1:5000
```

---

## API

### `POST /predict`

```bash
curl -X POST http://127.0.0.1:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "trip_distance": 3.5,
    "pickup_borough": "Manhattan",
    "dropoff_borough": "Manhattan",
    "pickup_latitude": 40.75,
    "pickup_longitude": -73.98,
    "dropoff_latitude": 40.76,
    "dropoff_longitude": -73.99,
    "passenger_count": 1,
    "rate_code": "1",
    "payment_type": "Credit Card",
    "vendor_name": "VTS",
    "vehicle_type": "Sedan",
    "store_and_fwd_flag": "N",
    "weather_condition": "clear",
    "temperature_f": 65.0,
    "precipitation_in": 0.0,
    "wind_speed_mph": 5.5,
    "traffic_index": 4.2,
    "driver_experience_years": 5.0,
    "is_holiday": 0,
    "pickup_month": 10,
    "pickup_day": 25,
    "pickup_hour": 14,
    "pickup_minute": 30
  }'
```

**Input validation is explicit.** The column-alignment step fills any missing training column with `0`, which is correct for one-hot columns but would silently turn a forgotten `trip_distance` into `trip_distance = 0` and return a confident, wrong fare. The endpoint therefore checks the raw input fields first and returns an error naming what is missing.

---

## Limitations

- **5,120 records** is a small dataset for a neural network. The Random Forest reaching a higher R² is consistent with that — tree ensembles are generally stronger on tabular data at this scale.
- **The prediction point matters.** `trip_duration` correlates well but is unknown at pickup. A model intended for fare *estimation* rather than fare *reconstruction* must be trained without it, at a cost in accuracy.
- **Geographic scope is New York only.** Nothing here transfers to another city without retraining.
- **Weather and traffic features contribute almost nothing** in this dataset. That may be a property of this sample rather than a general finding.
- **No temporal validation.** The split is random, not chronological, so the reported figures do not test how the model would hold up on future trips as fares and surcharges change.

---

## Tech stack

Python · TensorFlow/Keras · scikit-learn · pandas · NumPy · statsmodels · SciPy · Matplotlib · Seaborn · Flask · joblib

---

## Author

**Dinidu Rukshan**
Milestone Project 2 — Certified Advanced AI/ML Engineer Professional
