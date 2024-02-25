const host = "http://127.0.0.1:8000"

var typed = new Typed(".auto-type", {
    strings: ["Welcome to CrimeSpoter"],
    typeSpeed: 100,
    backSpeed: 100,
    loop: true
})


//nav bar hamburger
function menuOnClick() {
    document.getElementById("menu-bar").classList.toggle("change");
    document.getElementById("nav").classList.toggle("change");
    document.getElementById("menu-bg").classList.toggle("change-bg");
}

function changeColorCA(onHover) {
    var CAbutton = document.getElementById('CAbutton');

    if (onHover) {
        CAbutton.style.backgroundColor = '#DC052D'; /* Color to change to on hover */
    } else {
        CAbutton.style.backgroundColor = 'black'; /* Initial color when not hovering */
    }
}

function changeColorSI(onHover) {
    var SIbutton = document.getElementById('SIbutton');

    if (onHover) {
        SIbutton.style.backgroundColor = '#DC052D'; /* Color to change to on hover */
    } else {
        SIbutton.style.backgroundColor = 'black'; /* Initial color when not hovering */
    }
}

function changeColorLI(onHover) {
    var SIbutton = document.getElementById('SIbutton');

    if (onHover) {
        LIbutton.style.backgroundColor = '#DC052D'; /* Color to change to on hover */
    } else {
        LIbutton.style.backgroundColor = 'black'; /* Initial color when not hovering */
    }
}

// login button 

function handleLogin() {
    var password = document.getElementById('inputPassword4').value
    var username = document.getElementById('uname').value

    fetch(`${host}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
    })
        .then((res) => {
            return res.json()
        })
        .then((jsonData)=>{
            if(jsonData.status){
                alert(jsonData.message)
            }
        })
}