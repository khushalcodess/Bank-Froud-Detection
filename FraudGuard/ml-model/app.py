from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import json
import numpy as np
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ✅ Load model with error handling
print("Loading V2 model...")
try:
    model = pickle.load(open('models/fraud_model_v2.pkl', 'rb'))
    scaler = pickle.load(open('models/scaler_v2.pkl', 'rb'))
    explainer = pickle.load(open('models/shap_explainer_v2.pkl', 'rb'))
    feature_names = json.load(open('models/feature_names_v2.json', 'r'))
    print("✅ V2 Model loaded!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    scaler = None
    explainer = None
    feature_names = []

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'FraudGuard ML API V2 running!',
        'model': 'XGBoost V2',
        'features': feature_names,
        'status': 'active' if model else 'model not loaded'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # ✅ Check model loaded
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500

        data = request.json

        # ✅ Extract features
        amount = data.get('amount', 0)
        hour = data.get('hour', datetime.now().hour)
        day_of_week = data.get('day_of_week', datetime.now().weekday())
        is_night = 1 if (hour >= 22 or hour <= 6) else 0
        is_weekend = 1 if day_of_week >= 5 else 0
        freq_1hr = data.get('freq_1hr', 0)
        freq_24hr = data.get('freq_24hr', 0)
        is_new_receiver = data.get('is_new_receiver', 0)
        user_avg_amount = data.get('user_avg_amount', 5000)
        amount_ratio = amount / user_avg_amount if user_avg_amount > 0 else 1

        # ✅ Build feature array
        features = np.array([[
            amount,
            hour,
            day_of_week,
            is_night,
            is_weekend,
            freq_1hr,
            freq_24hr,
            is_new_receiver,
            amount_ratio,
            user_avg_amount
        ]])

        # ✅ Scale features
        features_scaled = scaler.transform(features)

        # ✅ Predict
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0][1]
        risk_score = round(probability * 100)

        # ✅ Determine status
        if risk_score >= 71:
            status = 'flagged'
        elif risk_score >= 31:
            status = 'suspicious'
        else:
            status = 'safe'

        # ✅ SHAP explanation
        shap_vals = explainer.shap_values(features_scaled)[0]
        top_reasons = sorted(
            zip(feature_names, shap_vals),
            key=lambda x: abs(x[1]),
            reverse=True
        )[:3]

        reasons = []
        for feature, value in top_reasons:
            impact = 'increases fraud risk' if value > 0 else 'decreases fraud risk'
            readable = {
                'amount_ratio': f'Amount is {amount_ratio:.1f}x your normal spending',
                'freq_1hr': f'{freq_1hr} transactions in last hour',
                'is_new_receiver': 'Sending to new account' if is_new_receiver else 'Known receiver',
                'is_night': 'Transaction at night time' if is_night else 'Normal time',
                'is_weekend': 'Weekend transaction' if is_weekend else 'Weekday transaction',
                'freq_24hr': f'{freq_24hr} transactions today',
                'amount': f'Transaction amount {amount}',
                'hour': f'Transaction at {hour}:00',
                'day_of_week': f'Day {day_of_week} of week',
                'user_avg_amount': f'Your average: {user_avg_amount:.0f}'
            }

            reasons.append({
                'feature': feature,
                'readable': readable.get(feature, feature),
                'impact': impact,
                'value': round(float(value), 3)
            })

        return jsonify({
            'success': True,
            'risk_score': risk_score,
            'status': status,
            'prediction': int(prediction),
            'reasons': reasons
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # ✅ Use PORT environment variable for Render
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)