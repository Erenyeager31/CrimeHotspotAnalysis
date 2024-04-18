function logout(){
    sessionStorage.clear()
    window.location.reload()

    const response = fetch(`${host}/logout`)
}