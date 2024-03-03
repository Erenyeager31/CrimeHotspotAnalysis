// const host = "http://127.0.0.1:8000"

var map
function initMap(jsonData) {
    map = L.map('map').setView([19.2307, 72.8567], 13)

    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    osm.addTo(map)

    addMarkers(map, jsonData)
    addHeatMap(map, jsonData)
}

const addMarkers = (map, jsonData) => {
    jsonData.map((jsonItems) => {
        try {
            const coordinates = jsonItems['crime Location'].split(",")
            // console.log(coordinates)
            var marker = L.marker([coordinates[0], coordinates[1]]);
            var tooltip = `<b>${jsonItems['crime description']}</b><br><a href="${jsonItems['Link/source']}" target="_blank">More info</a>`;
            marker.bindPopup(tooltip)
            marker.addTo(map);
        } catch (error) {
            // console.log("Coordinates not in proper format", jsonItems['crime Location']);
        }
    })
}

const addHeatMap = (map, jsonData) => {
    // Assuming your jsonData contains coordinates in an array
    var heatmapData = []
    jsonData.map((jsonItems) => {
        try {
            const coordinates = jsonItems['crime Location'].split(",")
            if (coordinates[0][2] == '.') {
                heatmapData.push(coordinates)
            }
        } catch (error) {
        }
    })
    // Create heatmap layer
    console.log(heatmapData)
    const heatmap = L.heatLayer(heatmapData).addTo(map);

    // Configure heatmap options (optional)
    heatmap.setOptions({
        radius: 100, // Adjust heatmap radius (in pixels)
        blur: 30, // Adjust heatmap blur (higher value means smoother transitions)
        maxZoom:15, // Set maximum zoom level for displaying heatmap
    });
}

const fetchData = async () => {
    const response = await fetch(`${host}/fetchData`, {
        method: 'GET',
        headers: {
            'Content-Type': 'appplication/json'
        }
    })

    const data = await response.json()
    // console.log(data.Data)
    var jsonData = []
    const lines = data.Data.split('\n');
    lines.forEach((line, index) => {
        try {
            jsonData.push(JSON.parse(line))
            // console.log(`Line ${index + 1}:`, jsonData); // Start indexing from 1
        } catch (error) {
            console.error(`Error parsing line ${index + 1}: ${line}`, error);
        }
    });
    console.log(jsonData)
    initMap(jsonData);
}

document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});
