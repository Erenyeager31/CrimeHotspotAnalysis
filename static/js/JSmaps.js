// const host = "http://127.0.0.1:8000"

var userPosition = []

var polyCoords = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': []
}

var map
var osm
var polygon = {
    '0': "",
    '1': "",
    '2': "",
    '3': "",
    '4': "",
    '5': ""
}

var clusterCharacter = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
}

const clusterColor = {
    0: 'red',
    1: 'blue',
    2: 'yellow',
    3: 'green',
    4: 'black',
    5: 'white',
}

const clusterIcon = {
    0: 'static/red.png',
    1: 'static/blue.png',
    2: 'static/yellow.png',
    3: 'static/green.png',
    4: 'static/black.png',
    5: 'static/white.png',
}

var appliedPolyLayer = 0
var heatMap
var mapMarkers
var clusterMarkers
function initMap(jsonData, jsonData2) {
    map = L.map('map').setView([19.2307, 72.8567], 13)

    osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    osm.addTo(map)

    polygon['0'] = L.polygon(polyCoords['0'], { fillColor: 'red', color: '00000000' })
    polygon['1'] = L.polygon(polyCoords['1'], { fillColor: 'blue', color: '00000000' })
    polygon['2'] = L.polygon(polyCoords['2'], { fillColor: 'yellow', color: '00000000' })
    polygon['3'] = L.polygon(polyCoords['3'], { fillColor: 'green', color: '00000000' })
    polygon['4'] = L.polygon(polyCoords['4'], { fillColor: 'black', color: '00000000' })
    polygon['5'] = L.polygon(polyCoords['5'], { fillColor: 'white', color: '00000000' })

    mapMarkers = addMarkers(map, jsonData)
    heatMap = addHeatMap(map, jsonData)
}

function addUser() {
    //! user marker
    var blackMarker = new L.icon({
        iconUrl: 'static/user.png',
        iconSize: [38, 45], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    try {
        var userMarker = L.marker([userPosition[0], userPosition[1]], {
            icon: blackMarker
        })
        userMarker.addTo(map)
    } catch (error) {
        console.log(error)
    }
}

const addMarkers = (map, jsonData) => {
    // console.log(jsonData)
    var marker
    jsonData.map((jsonItems) => {
        try {
            const coordinates = jsonItems['crime Location'].split(",")
            // console.log(coordinates)
            marker = L.marker([coordinates[0], coordinates[1]]);
            var tooltip = `<b>${jsonItems['crime description']}</b><br><a href="${jsonItems['Link/source']}" target="_blank">More info</a>`;
            marker.bindPopup(tooltip)
            marker.addTo(map);
        } catch (error) {
            // console.log("Coordinates not in proper format", jsonItems['crime Location']);
        }
    })
    return marker
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
    // console.log(heatmapData)
    const heatmap = L.heatLayer(heatmapData).addTo(map);

    // Configure heatmap options (optional)
    heatmap.setOptions({
        radius: 100, // Adjust heatmap radius (in pixels)
        blur: 30, // Adjust heatmap blur (higher value means smoother transitions)
        maxZoom: 15, // Set maximum zoom level for displaying heatmap
    });

    return heatmap
}

const addClusterMarkers = (map, jsonData, clusterNo) => {
    // console.log(clusterNo,":",jsonData)
    var marker
    var blackMarker = new L.icon({
        iconUrl: clusterIcon[clusterNo],
        iconSize: [38, 45], // size of the icon
        shadowSize: [50, 54], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    jsonData.map((items) => {
        console.log(items)
        try {
            marker = L.marker(items, {
                icon: blackMarker
            });
            marker = L.marker([items[0], items[1]],{
                icon:blackMarker
            });
            var tooltip = `<b>${items[2]}</b><br><a href="${items[3]}" target="_blank">More info</a>`;
            marker.bindPopup(tooltip);
            marker.addTo(map);
        } catch (error) {
            console.error("Error adding marker:", error);
        }
    });
    return marker
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
            // console.error(`Error parsing line ${index + 1}: ${line}`, error);
        }
    });

    const response2 = await fetch(`${host}/fetchClusters`, {
        method: 'GET',
        headers: {
            'Content-Type': 'appplication/json'
        }
    })

    const data2 = await response2.json()
    // console.log(data2.Data)
    var jsonData2 = []
    const lines2 = data2.Data.split('\n');
    lines2.forEach((line, index) => {
        try {
            jsonData2.push(JSON.parse(line))
        } catch (error) {
            // console.error(`Error parsing line ${index + 1}: ${line}`, error);
        }
    });

    const lines3 = data2.Data2.split('\n');
    lines3.forEach((line, index) => {
        try {
            // console.log(JSON.parse(line))
            clusterCharacter[index].push(JSON.parse(line))
        } catch (error) {

        }
    });
    // console.log(clusterCharacter)

    for (var resData in jsonData2) {
        // console.log(jsonData2[resData]['lat'])
        var lat = jsonData2[resData]['lat']
        var long = jsonData2[resData]['long']
        var desc = jsonData2[resData]['crime description']
        var link = jsonData2[resData]['Link/source']
        // console.log(resData,jsonData2[resData]['Cluster'])
        polyCoords[jsonData2[resData]['Cluster']].push([lat, long,desc,link])
    }
    // console.log(polyCoords)

    initMap(jsonData, jsonData2);
}

//! waiting for dom to load
document.addEventListener('DOMContentLoaded', async function () {
    const successCallback = (position) => {

        userPosition.push(position['coords']['latitude'])
        userPosition.push(position['coords']['longitude'])

        addUser()
    };

    const errorCallback = (error) => {
        console.log(error);
    };

    await navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    fetchData();
});


function viewCluster(clusterNo) {
    removeAllLayers(map)

    if (appliedPolyLayer !== clusterNo)
        map.removeLayer(polygon[appliedPolyLayer])
    // polygon[clusterNo].addTo(map)
    appliedPolyLayer = clusterNo

    var indexBox = document.getElementsByClassName('indexBox')[0]
    if (clusterNo == 4)
        indexBox.style.color = "white"
    else 
        indexBox.style.color = "black"

    indexBox.style.backgroundColor = clusterColor[clusterNo]

    indexBox.innerHTML = ''; // Clear previous content

    for (var key in clusterCharacter[clusterNo][0]) {
        // console.log(key);
        var div = document.createElement('div');
        div.textContent = `${key} : ${clusterCharacter[clusterNo][0][key]}`;
        indexBox.appendChild(div);
        // console.log(indexBox)
    }

    addClusterMarkers(map, polyCoords[clusterNo], clusterNo)
}

function removeAllLayers(map) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker 
            // || layer instanceof L.TileLayer || layer instanceof L.LayerGroup
            ) {
            map.removeLayer(layer);
        }
    });
    try {
        map.removeLayer(heatMap)
    } catch (error) {
        
    }
}