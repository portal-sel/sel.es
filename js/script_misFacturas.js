var script_url = 'https://script.google.com/macros/s/AKfycbz3OseL35TM0Qge_IDC2AuCF2e7tlxYb-DuhBqedpPGO73sukiHu95AGD9mid6Kc-gHCQ/exec'


function setup() {
    // cargarInicio();
    setName()
}

function cargarInicio(){
    var url = script_url + "?callback=ctrlq&" +
            "&action=facturas_nacional";

        var request = jQuery.ajax({
            crossDomain: true,
            url: url,
            method: "GET",
            dataType: "jsonp",
        });
}

function generaCsv(){
    let csv = new p5.Table();
    csv = data
    save(csv, 'example.csv', true)
}

function ctrlq(e){

    console.log(e)
    data = e.result;
    var num_t = e.result.length;

    $("#t_facturas").html("");
    for (var i = 1; i < num_t; i++) {
        let [ fecha,  ] = e.result[i][17].split('T');
        console.log(fecha);
        var tr = `<tr>
            <td>` + e.result[i][0] + `</td>
            <td>` + e.result[i][3] + `</td>
            <td>` + e.result[i][2] + `</td>
            <td>` + '$ '+nfc(e.result[i][5].toString(), 3) + `</td>
            <td>` + fecha + `</td>
            <td>` + e.result[i][20] + `</td>
            <td>` + '' + `</td>
            <td>` + '' + `</td>
        </tr>`;
        $("#t_facturas").append(tr)
    }

    var table = document.getElementById("t_facturas");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        row = table.rows[i];
        row.onclick = function(){

            var cell_id = this.getElementsByTagName("td")[0];
            console.log(cell_id.innerHTML);
            // var id_tabla = cell_id.innerHTML;
            document.getElementById("id_factura").innerHTML = `ID DE FACTURA: ${cell_id.innerHTML}`;
            // document.getElementById("busqueda").value = id_tabla
        };
    }
}