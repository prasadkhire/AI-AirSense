from flask import Flask, render_template, jsonify
import requests
import joblib
import numpy as np

app = Flask(__name__)

# Load trained ML model and scaler
model = joblib.load("aqi_logistic_model.pkl")
scaler = joblib.load("aqi_scaler.pkl")

# Pune coordinates
LATITUDE = 18.5204
LONGITUDE = 73.8567


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/air-quality")
def air_quality():

    url = (
        "https://air-quality-api.open-meteo.com/v1/air-quality"
        f"?latitude={LATITUDE}"
        f"&longitude={LONGITUDE}"
        "&current=us_aqi,pm2_5,pm10,carbon_monoxide,"
        "nitrogen_dioxide,sulphur_dioxide,ozone"
        "&timezone=Asia%2FKolkata"
    )

    response = requests.get(url, timeout=10)
    response.raise_for_status()

    data = response.json()
    current = data["current"]

    # Live pollutant values
    pm25 = current["pm2_5"]
    pm10 = current["pm10"]
    no2 = current["nitrogen_dioxide"]
    co = current["carbon_monoxide"]
    so2 = current["sulphur_dioxide"]
    o3 = current["ozone"]

    # The model was trained using these same 6 features
    features = np.array([[
        pm25,
        pm10,
        no2,
        co,
        so2,
        o3
    ]])

    # Scale live data
    features_scaled = scaler.transform(features)

    # ML prediction
    prediction = model.predict(features_scaled)[0]

    probability = (
        model.predict_proba(features_scaled)[0][1] * 100
    )

    live_aqi = current.get("us_aqi")

    status = "HARMFUL" if prediction == 1 else "SAFE"

    return jsonify({
        "aqi": live_aqi,
        "status": status,
        "confidence": round(probability, 2),
        "pm25": round(pm25, 2),
        "pm10": round(pm10, 2),
        "no2": round(no2, 2),
        "co": round(co, 2),
        "so2": round(so2, 2),
        "o3": round(o3, 2),
        "time": current["time"],
        "location": "Pune"
    })


@app.route("/api/aqi-history")
def aqi_history():

    url = (
        "https://air-quality-api.open-meteo.com/v1/air-quality"
        f"?latitude={LATITUDE}"
        f"&longitude={LONGITUDE}"
        "&hourly=us_aqi"
        "&past_hours=24"
        "&forecast_hours=0"
        "&timezone=Asia%2FKolkata"
    )

    response = requests.get(url, timeout=10)
    response.raise_for_status()

    data = response.json()

    return jsonify({
        "time": data["hourly"]["time"],
        "aqi": data["hourly"]["us_aqi"]
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)