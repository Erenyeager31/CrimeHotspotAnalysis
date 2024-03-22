function changeColor_Verify(onHover) {
    var Verify_button = document.getElementById('Verify_button')

    if (onHover) {
        Verify_button.style.backgroundColor =
            '#DC052D' /* Color to change to on hover */
    } else {
        Verify_button.style.backgroundColor =
            'black' /* Initial color when not hovering */
    }
}

async function enter_details() {
    const otpInput = document.getElementById("regOTP")
    const otpEmail = document.getElementById("regEmail")
    // alert("hi")
    if (otpInput.disabled == true) {
        const response = await fetch("http://127.0.0.1:8000/verifyEmail", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: otpEmail.value
            })
        })

        const data = await response.json()
        if (data.status) {
            alert(data.message)
            otpInput.disabled = false
        } else {
            alert(data.message)
        }
    } else {
        const response = await fetch("http://127.0.0.1:8000/verifyEmail", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: otpEmail.value,
                otp: otpInput.value
            })
        })

        const data = await response.json()
        if (data.status) {
            alert(data.message)
            window.location.href('details.html')
        } else {
            alert(data.message)
        }

    }
    // var Verify_button = document.getElementById('Verify_button')
    // window.location.href = 'details.html'
}

