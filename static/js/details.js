function changeColor_Verify(onHover) {
    var submit_button = document.getElementById('submit_button');

    if (onHover) {
        submit_button.style.backgroundColor = '#DC052D'; /* Color to change to on hover */
    } else {
        submit_button.style.backgroundColor = 'black'; /* Initial color when not hovering */
    }
}

async function submitDetails() {
    var name = document.getElementsByClassName('name')[0].value
    var age = document.getElementsByClassName('age')[0].value
    var radioButtons = document.querySelectorAll('input[name="inlineRadioOptions"]');

    // Variable to store the selected value
    var gender;

    // Iterate through each radio button
    radioButtons.forEach(function (radioButton) {
        // Check if the radio button is checked
        if (radioButton.checked) {
            // Get the selected value
            gender = radioButton.value;
        }
    });
    var username = document.getElementsByClassName('username')[0].value
    var password = document.getElementsByClassName('password')[0].value
    var conf_password = document.getElementsByClassName('conf_password')[0].value

    if (password == conf_password) {
        const response = await fetch('/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: sessionStorage.getItem('email'),
                name,
                gender,
                username,
                password
            })
        })

        const resData = await response.json()

        if (resData.status) {
            alert(resData.message)
            window.location.assign('/')
        }
    } else {
        alert('Confirm password does not match the entered password')
    }
}