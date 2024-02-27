function changeColor_Verify(onHover) {
    var submit_button = document.getElementById('submit_button');

    if (onHover) {
        submit_button.style.backgroundColor = '#DC052D'; /* Color to change to on hover */
    } else {
        submit_button.style.backgroundColor = 'black'; /* Initial color when not hovering */
    }
}