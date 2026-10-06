async function getAirQuality() {

    document.getElementById("loading").innerText =
        "Fetching live air quality data...";

    try {

        const response = await fetch("/api/air-quality");

        const data = await response.json();

        document.getElementById("aqi").innerText =
            data.aqi;
            const aqi = data.aqi;
const aqiCategory = document.getElementById("aqiCategory");
const aqiCard = document.getElementById("aqiCard");

if (aqi <= 50) {
    aqiCategory.innerText = "GOOD";
    aqiCard.style.borderTop = "6px solid #16a34a";
}
else if (aqi <= 100) {
    aqiCategory.innerText = "MODERATE";
    aqiCard.style.borderTop = "6px solid #eab308";
}
else if (aqi <= 150) {
    aqiCategory.innerText = "UNHEALTHY FOR SENSITIVE GROUPS";
    aqiCard.style.borderTop = "6px solid #f97316";
}
else if (aqi <= 200) {
    aqiCategory.innerText = "UNHEALTHY";
    aqiCard.style.borderTop = "6px solid #dc2626";
}
else if (aqi <= 300) {
    aqiCategory.innerText = "VERY UNHEALTHY";
    aqiCard.style.borderTop = "6px solid #7c3aed";
}
else {
    aqiCategory.innerText = "HAZARDOUS";
    aqiCard.style.borderTop = "6px solid #78350f";
}

        document.getElementById("status").innerText =
            data.status;
            const statusElement = document.getElementById("status");

if (data.status === "HARMFUL") {
    statusElement.style.color = "#dc2626";
} else {
    statusElement.style.color = "#16a34a";
}

        document.getElementById("confidence").innerText =
            data.confidence + "%";

        document.getElementById("pm25").innerText =
            data.pm25;

        document.getElementById("pm10").innerText =
            data.pm10;

        document.getElementById("no2").innerText =
            data.no2;

        document.getElementById("co").innerText =
            data.co;

        document.getElementById("so2").innerText =
            data.so2;

        document.getElementById("o3").innerText =
            data.o3;

        document.getElementById("time").innerText =
            data.time;

        document.getElementById("loading").innerText =
            "Live data loaded successfully.";

    } catch (error) {

        document.getElementById("loading").innerText =
            "Error loading air quality data.";

        console.error(error);
    }async function loadAQIHistory() {

    try {

        const response = await fetch("/api/aqi-history");

        const data = await response.json();

        const labels = data.time.map(time => {

            const date = new Date(time);

            return date.getHours() + ":00";

        });

        const ctx = document.getElementById("aqiChart");

        new Chart(ctx, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label: "AQI",

                    data: data.aqi,

                    tension: 0.3,

                    fill: false,

                    pointRadius: 4

                }]

            },

            options: {

                responsive: true,

                scales: {

                    y: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text: "AQI"

                        }

                    },

                    x: {

                        title: {

                            display: true,

                            text: "Time"

                        }

                    }

                }

            }

        });

    } catch (error) {

        console.error("AQI history error:", error);

    }
}

loadAQIHistory();
}