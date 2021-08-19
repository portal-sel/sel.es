function setName() {
    document.getElementById('titleName').innerHTML = localStorage.getItem('nombre') + '&nbsp;&nbsp;<img src="../images/usuario.png" alt="" class="user-avatar-md rounded-circle">'
}