import webbrowser
from threading import Timer
from flask import Flask, render_template, jsonify
import sys
import os

# Add the main project folder to Python's path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_ROOT)

from gui.database import get_all_weather_data

app = Flask(__name__)


# ---------------------------------------------------------
# HOME PAGE
# ---------------------------------------------------------

@app.route("/")
def home():
    return render_template("index.html")


# ---------------------------------------------------------
# API — WEATHER DATA
# ---------------------------------------------------------

@app.route("/api/weather")
def weather_data():

    data = get_all_weather_data()

    records = []

    for row in data:

        data_id = row[0]
        timestamp = row[1]
        temperature = float(row[2])
        longitude = float(row[3])
        latitude = float(row[4])
        region = row[5]
        station_id = row[6]

        fahrenheit = (temperature * 9 / 5) + 32

        records.append({
            "data_id": data_id,
            "timestamp": timestamp.strftime("%Y-%m-%d %H:%M"),
            "temperature": round(temperature, 1),
            "fahrenheit": round(fahrenheit, 1),
            "longitude": longitude,
            "latitude": latitude,
            "region": region,
            "station_id": station_id,
            "heatwave": temperature >= 35
        })

    return jsonify(records)


# ---------------------------------------------------------
# API — DASHBOARD STATISTICS
# ---------------------------------------------------------

@app.route("/api/statistics")
def statistics():

    data = get_all_weather_data()

    if not data:
        return jsonify({
            "total": 0,
            "average": 0,
            "maximum": 0,
            "minimum": 0,
            "heatwave_count": 0,
            "heatwave_percentage": 0
        })

    temperatures = [float(row[2]) for row in data]

    total = len(temperatures)
    average = sum(temperatures) / total
    maximum = max(temperatures)
    minimum = min(temperatures)

    heatwave_count = len(
        [temp for temp in temperatures if temp >= 35]
    )

    heatwave_percentage = (heatwave_count / total) * 100

    return jsonify({
        "total": total,
        "average": round(average, 1),
        "maximum": round(maximum, 1),
        "minimum": round(minimum, 1),
        "heatwave_count": heatwave_count,
        "heatwave_percentage": round(heatwave_percentage, 1)
    })


# ---------------------------------------------------------
# RUN SERVER
# ---------------------------------------------------------

if __name__ == "__main__":

    def open_browser():
        webbrowser.open_new("http://127.0.0.1:5000/")

    Timer(1.5, open_browser).start()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )