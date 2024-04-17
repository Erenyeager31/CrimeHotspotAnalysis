// const { cookie } = require("express/lib/response");

const host = "http://127.0.0.1:8000"

// $().toastmessage('showSuccessToast', "Hello there! Message is shown.");

console.log("Debug auto execution")

// var typed = new Typed(".auto-type", {
//     strings: ["Welcome to CrimeSpoter"],
//     typeSpeed: 100,
//     backSpeed: 100,
//     loop: true
// })

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