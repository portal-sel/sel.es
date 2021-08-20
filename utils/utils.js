function setName() {
    document.getElementById('titleName').innerHTML = localStorage.getItem('nombre') + '&nbsp;&nbsp;<img src="../images/usuario.png" alt="" class="user-avatar-md rounded-circle">'
}

function checkUser() {
    
    const name = localStorage.getItem('nombre')

    if (name == undefined ) {
        location.href = '../index.html'
    }else if (name == '') {
        location.href = '../index.html'
    }
}
