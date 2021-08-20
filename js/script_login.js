
var user, pw;
var script_url = 'https://script.google.com/macros/s/AKfycbzdJeBnX_MD0hvV5RayV5BxDteP3a2XRg6b1WeVsBlnneMe86bzmd5bdPylwSKApaW7/exec'
var btn_login;


function setup() {
    user    = select('#user')
    pw      = select('#pw')
    btn_login = select('#ingresar');
    btn_login.mouseClicked(login)

}

function login() {
    
    if (user.value() && pw.value()) {
        btn_login.attribute('disabled','')
        var url = script_url + "?callback=loginResponse&" +
            "&user=" + user.value() +
            "&pass=" +  pw.value()+
            "&origen=" + 'N' +
            "&action=login";
        
        var request = jQuery.ajax({
            crossDomain: true,
            url: url,
            method: "GET",
            dataType: "jsonp",
        });

    }else{
        swal('There are empty fields','','error');
    }

}

function loginResponse(e) {
    console.log(e)
    if (e.result == 1) {
        localStorage.setItem('id', e.id);
        localStorage.setItem('rfc', e.rfc);
        localStorage.setItem('nombre', e.nombre);
        location.href="pages/calendario.html";
    }else{
        btn_login.removeAttribute('disabled');
        swal('Incorrect username or password','','error')
    }
}
