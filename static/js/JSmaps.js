// const host = "http://127.0.0.1:8000"

var polyCoords = {
    '0':[],
    '1':[],
    '2':[],
    '3':[],
    '4':[],
}

var map
var osm
var polygon = {
    '0':"",
    '1':"",
    '2':"",
    '3':"",
    '4':"",
}

var appliedPolyLayer = 0
// var polygon1
// var polygon2
// var polygon3
// var polygon4
function initMap(jsonData,jsonData2) {
    map = L.map('map').setView([19.2307, 72.8567], 13)

    osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    osm.addTo(map)

    polygon['0'] = L.polygon(polyCoords['0'],{fillColor:'red',color:'00000000'})
    polygon['1'] = L.polygon(polyCoords['1'],{fillColor:'blue',color:'00000000'})
    polygon['2'] = L.polygon(polyCoords['2'],{fillColor:'yellow',color:'00000000'})
    polygon['3'] = L.polygon(polyCoords['3'],{fillColor:'green',color:'00000000'})
    polygon['4'] = L.polygon(polyCoords['4'],{fillColor:'black',color:'00000000'})

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
    // console.log(heatmapData)
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
            // console.log(`Line ${index + 1}:`, jsonData); // Start indexing from 1
        } catch (error) {
            console.error(`Error parsing line ${index + 1}: ${line}`, error);
        }
    });
    console.log(jsonData2)
    
    for(var resData in jsonData2){
        // console.log(jsonData2[resData]['lat'])
        var lat = jsonData2[resData]['lat']
        var long = jsonData2[resData]['long']
        // console.log(resData,jsonData2[resData]['Cluster'])
        polyCoords[jsonData2[resData]['Cluster']].push([lat,long])
    }
    console.log(polyCoords)
    
    initMap(jsonData,jsonData2);
}


document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});


function viewCluster(clusterNo){
    if( appliedPolyLayer !== clusterNo)
    map.removeLayer(polygon[appliedPolyLayer])
    polygon[clusterNo].addTo(map)
    appliedPolyLayer = clusterNo
}