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

function enter_details() {
    var Verify_button = document.getElementById('Verify_button')
    window.location.href = 'details.html'
}