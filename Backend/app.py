from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf

app = Flask(__name__)

# Load artifacts
model = tf.keras.models.load_model('fare_model.keras')
scaler = joblib.load('scaler.pkl')
encoder = joblib.load('onehot_encoder.pkl')
feature_names = joblib.load('feature_names.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        df_input = pd.DataFrame([data])

        # 1. Binary Mapping
        if 'store_and_fwd_flag' in df_input.columns:
            df_input['store_and_fwd_flag'] = df_input['store_and_fwd_flag'].map({'N': 0, 'Y': 1}).fillna(0)

        # 2. One-Hot Encoding
        onehot_cols = ['vendor_name', 'payment_type', 'vehicle_type', 'weather_condition', 'pickup_borough', 'dropoff_borough', 'rate_code']
        encoded_data = encoder.transform(df_input[onehot_cols])
        encoded_df = pd.DataFrame(encoded_data, columns=encoder.get_feature_names_out(onehot_cols), index=df_input.index)
        
        # Combine and align with training features
        df_final = pd.concat([df_input.drop(columns=onehot_cols), encoded_df], axis=1)
        
        # Ensure all training features exist (fill missing with 0)
        for col in feature_names:
            if col not in df_final.columns:
                df_final[col] = 0
        
        # Reorder columns to match scaler
        df_final = df_final[feature_names]

        # 3. Scale and Predict
        scaled_input = scaler.transform(df_final)
        prediction = model.predict(scaled_input, verbose=0)[0][0]

        return jsonify({'predicted_fare': float(prediction)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
