// const host = "http://127.0.0.1:8000"

const locations = [
    { lat: 40.7128, lng: -74.0059 },  // New York City
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 36.1167, lng: -115.1734 }, // Las Vegas
];

const fetchData = async () =>{
    await fetch(`${host}/fetchData`,{
        method:'GET',
        headers:{
            'Content-Type':'appplication/json'
        }
    })
        .then((res)=>{
            const jsonData = res.json()
            return jsonData
        })
        .then((jsonData)=>{
            console.log(jsonData)
        })
}

function initMap() {
    const mapOptions = {
        zoom: 12, // Adjust the zoom level if needed
        center: { lat: 19.0760, lng: 72.8777 }, // Coordinates for Mumbai
        mapTypeId: 'roadmap'
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    for (const location of locations) {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name // Add property 'name' to each location object
        });
    }
}

document.addEventListener('DOMContentLoaded',function () {
    fetchData();
    initMap();
});
