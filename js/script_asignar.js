let btnSubir
let id_final = ''

function setup() {
    getMs()
    setName()
    checkUser()
    btnSubir = select('#btnSubirPDF')
    btnSubir.mouseClicked(setOP)
    console.log('Setup');
    try {
        console.log('intenta');
        if(localStorage.getItem('servicios') == 'false'){
            console.log('entra');
            document.getElementById('sM').style.display = 'block'
            document.getElementById('sS').style.display = 'none'
        }else if(localStorage.getItem('servicios') == 'true'){
            document.getElementById('sS').style.display = 'block'
            document.getElementById('sM').style.display = 'none'
        }else{
            location.href = '../index.html'
        }
        
    } catch (error) {
        location.href = '../index.html'
    }
}

function getMs() {
    console.log('llega');
    const script_url = 'https://script.google.com/macros/s/AKfycbwDHDAH-KVxv8arz0Eb9nWCHdu4vLiRAALmPycVXW37qqbO3lHhdtqRuYZBJ9b_nboH/exec'
    var url = script_url + "?callback=microservicios&" +
        "&action=microservicios";
                    
    var request = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "jsonp",
    });
}

function microservicios(e) {
    console.log(e);
    urlMs = e.result[7][2]
    urlBusqueda = e.result[8][2]
    urlPostPDFXML = e.result[9][2]
    urlActualizarOrden = e.result[11][2]
    cargarInicio(urlMs)

}

function cargarInicio( consulta ){
    var url = consulta + "?callback=ctrlq&" +
        "&id=" + localStorage.getItem('id')+
        "&origen=N"+
        "&action=MS8";

        var request = jQuery.ajax({
            crossDomain: true,
            url: url,
            method: "GET",
            dataType: "jsonp",
        });
}

function ctrlq(e){

    console.log(e)
    data = e.result;
    var num_t = e.result.length;
    
    $("#t_facturas").html("");
    for (var i = 0; i < num_t; i++) {
        let [ fecha,  ] = e.result[i][17].split('T');
        let texto = 'Si';
        let enlace = ''
        let colorResal = ''
        switch (e.result[i][25]) {
            case 'PENDIENTE':
                colorResal = '#F9940C'
                break;
            case 'EN REVISION':
                colorResal = '#F2F90C'
            
                break;
            case 'PAGADA':
                colorResal = '#0CF94B'
                break;
            case 'RECHAZADA':
                colorResal = '#F90C0C'
                break;
            default:
                break;
        }

        if (!e.result[i][21]) {
            texto = 'No'
            enlace = '#'
        }else{
            enlace = e.result[i][21]
        }
        console.log(fecha);
        var tr = `<tr>
            <td>` + e.result[i][0] + `</td>
            <td>` + e.result[i][3] + `</td>
            <td>` + e.result[i][2] + `</td>
            <td>` + '$ '+nfc(e.result[i][5].toString(), 3) + `</td>
            <td>` + fecha + `</td>
            <td>` + `<a href="${enlace}">${texto}</a>`  + `</td>
            <td style="background-color: ${colorResal}">` + e.result[i][25] + `</td>
           
            <td style="display: none">` + e.result[i][28] + `</td>
        </tr>`;
        $("#t_facturas").append(tr)
    }

    var table = document.getElementById("t_facturas");
    var rows = table.getElementsByTagName("tr");
    var id_enviar = '';
    for (i = 0; i < rows.length; i++) {
        row = table.rows[i];
        row.onclick = function(){
            var cell_id = this.getElementsByTagName("td")[0];
            id_enviar = cell_id.innerHTML;
            console.log(id_enviar)
            id_final = id_enviar
            // let txt_id = select('#idFactura')
            // txt_id.setValue( id_enviar)
            document.getElementById("idFactura11").value = id_enviar
        };
    }

}

function setOP() {
    let txt_op = select('#numOrden')
    let script = 'https://script.google.com/macros/s/AKfycbx6TF4wMe15_NcwWvNtp2i5owXgHt_rwJiNvww-Xm4UZ8X8oz0XHVppCyGemjn_aIQjnQ/exec'
    if(id_final && txt_op.value() != '' ){
        var url = script + "?callback=setOP12&" +
        "&id=" + id_final +
        "&po=" + txt_op +
        "&action=establece_op";

        var request = jQuery.ajax({
            crossDomain: true,
            url: url,
            method: "GET",
            dataType: "jsonp",
        });
    }else{
        swal('Error','Por favor, selecciona un elemento de la tabla o escribe un número de OP','error')
        .then((value) => {
            location.reload()
        });
    }
}

function setOP12(e) {
    swal('CAMBIADO CON EXITO','','success')
        .then((value) => {
            location.reload()
        });
}