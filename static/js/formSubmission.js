var coords = []

async function submitForm(e) {
    // e.preventDefault()
    alert("Predicting the Possibility for the type of crime...")

    var name = document.getElementsByClassName('name')[0].value
    var age = document.getElementsByClassName('age')[0].value
    var gender_ = document.getElementsByClassName('gender_')[0].value
    var Tday = document.getElementsByClassName('Tday')[0].value
    var Ltype = document.getElementsByClassName('Ltype')[0].value
    var Wcond = document.getElementsByClassName('Wcond')[0].value

    const date = new Date()
    const month = date.getMonth()
    const day = date.getDay()

    const response = await fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            age,
            gender_,
            Tday,
            Ltype,
            Wcond,
            month,
            day,
            lat: coords[0],
            long: coords[1],
        })
    })

    const data = await response.json()
    console.log(data)

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    coords.push(latitude)
    coords.push(longitude)
    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);
    submitForm()
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}