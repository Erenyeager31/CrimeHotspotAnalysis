const host = "http://127.0.0.1:8000"

// login button 

function handleLogin() {
    console.log("Inside")
    // e.preventDefault()
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
            console.log(res)
            return res.json()
        })
        .then((jsonData) => {
            if (jsonData.status) {
                alert(jsonData.message)
                // alert("hi")
                // console.log("Login")
                sessionStorage.setItem('auth', true)
                sessionStorage.setItem('unaem', username)
                var SI = document.getElementById('SIbutton')
                var CA = document.getElementById('CAbutton')
                // console.log(SI, CA)
                SI.style.display = 'none'
                CA.style.display = 'none'

                // Get a reference to the button element
                var closeButton = document.querySelector('.btn-close');
                console.log(closeButton)
                // Check if the button element exists
                if (closeButton) {
                    // Simulate a click event on the button
                    closeButton.click();
                }

            } else {
                console.log(jsonData)
                alert(jsonData.message)
            }
        })
}

window.onload = function () {
    console.log('debug');
    if (sessionStorage && sessionStorage.getItem('auth')) {
        var SI = document.getElementById('SIbutton');
        var CA = document.getElementById('CAbutton');
        // console.log(SI, CA);
        SI.style.display = 'none';
        CA.style.display = 'none';
    }
};

// Function to get a specific cookie by name
// function getCookie(cookieName) {
//     console.log('hi')
//     const cookies = document.cookie.split(';');
//     for (let cookie of cookies) {
//         cookie = cookie.trim();

//         if (cookie.startsWith(cookieName + '=')) {
//             return cookie.substring(cookieName.length + 1);
//         }
//     }
//     return null;
// }

// // Example: Retrieve a cookie named 'auth'
// const authCookieValue = getCookie(`${sessionStorage.getItem('uname')}_auth`);

// if (authCookieValue) {
//     console.log("cookies debug")
//     var SI = document.getElementById('SIbutton');
//     var CA = document.getElementById('CAbutton');
//     console.log(SI, CA);
//     SI.style.display = 'none';
//     CA.style.display = 'none';
// }