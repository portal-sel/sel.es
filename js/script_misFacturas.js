var script_url = 'https://script.google.com/macros/s/AKfycbz3OseL35TM0Qge_IDC2AuCF2e7tlxYb-DuhBqedpPGO73sukiHu95AGD9mid6Kc-gHCQ/exec'
const ids = [];
let urlMs, urlBusqueda, urlPostPDFXML;
let btnBuscar, btn_subir;

let idFacturaActualizar, txtNumOrden, btnActualizarOrden
let where =''
let uuidElegido = ''
let dataFinal = []
function setup() {
    // cargarInicio();
    getMs()
    btn_subir = select('#btnSubirComplemento');
    // btn_subir.attribute('disabled','')
    btn_subir.mouseClicked(validateFiles)

    var btn_descargar = select('#btnDescargar');
    btn_descargar.mouseClicked(generaCsv)
    // setName()
    // checkUser()
    try {
        // console.log('intenta');
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
    btnBuscar = select('#btnBuscar');

    idFacturaActualizar = select('#idFacturaAct')
    txtNumOrden = select('#numOrden')
    btnActualizarOrden = select('#btnActualizaOrden')
    btnActualizarOrden.mouseClicked(actualizaOrden)

    btnBuscar.mouseClicked(searchData)
    document.getElementById('divComplemento').style.display = 'none'
    document.getElementById('divOrden').style.display = 'none'
    const selectElement = document.getElementById('selectAction')
    selectElement.addEventListener('change', (event) => {

        opcion = selectElement.value

        switch (opcion) {
            case 'SUBIR COMPLEMENTO':
                document.getElementById('divComplemento').style.display = 'block'
                document.getElementById('divOrden').style.display = 'none'
                // document.getElementById('id_factura').innerHTML = 'ID DE FACTURA:'
                document.getElementById('idFacturaAct').value = ''
                where = 'subir'
                break;
            case 'ACTUALIZAR NÚMERO DE ORDEN':
                document.getElementById('divComplemento').style.display = 'none'
                document.getElementById('divOrden').style.display = 'block'
                // document.getElementById('id_factura').innerHTML = 'ID DE FACTURA: '
                document.getElementById('idFacturaAct').value = ''
                where = 'actualizar'
                break;
        
            default:
                document.getElementById('divComplemento').style.display = 'none'
                document.getElementById('divOrden').style.display = 'none'
                // document.getElementById('id_factura').innerHTML= 'ID DE FACTURA: '
                document.getElementById('idFacturaAct').value = ''
                where = ''
                break;
        }
    });


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function searchData() {
    
    const selectStatus = select('#selectStatus')
    const fechaI = select('#fechainicio')
    const fechaF = select('#fechafinal')
    console.log('llega');
    if (fechaI.value() && fechaF.value()) {
        btnBuscar.attribute('disabled', '')
            console.log('Consulta con status');
            var url = urlBusqueda + "?callback=processData&" +
            "&fechaInicio=" + fechaI.value() + 
            "&fechaFinal=" + fechaF.value() + 
            "&status=" + selectStatus.value() +
            "&id=" + localStorage.getItem('id')+
            "&origen=N" +
            "&action=MS9";
        
            var request = jQuery.ajax({
                crossDomain: true,
                url: url,
                method: "GET",
                dataType: "jsonp",
            });
        console.log(url);
    }else{
        btnBuscar.removeAttribute('disabled');
        swal('Campos faltantes','Por favor selecciona una fecha de inicio y de fin','error')
    }
}

function processData(e) {
    btnBuscar.removeAttribute('disabled');
    console.log(e);
    $("#t_facturas").html("");
    for (var i = 0; i < e.result.length; i++) {
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
        var tr = `<tr>
            <td>` + e.result[i][30] + `</td>
            <td>` + e.result[i][3] + `</td>
            <td>` + e.result[i][2] + `</td>
            <td>` + '$ '+nfc(e.result[i][16].toString(), 3) + `</td>
            <td>` + '$ '+nfc(e.result[i][14].toString(), 3) + `</td>
            <td>` + '$ '+nfc(e.result[i][15].toString(), 3) + `</td>
            <td>` + fecha + `</td>
            <td>` + `<a href="${enlace}">${texto}</a>`  + `</td>
            <td style="background-color: ${colorResal}">` + e.result[i][25] + `</td>
            <td>` + e.result[i][29] + `</td>
            <td style="display: none">` + e.result[i][28] + `</td>
        </tr>`;
        $("#t_facturas").append(tr)
    }

    let arrayTemp = []
    const encabezados = ['FOLIO', 'TIPO FACTURA', 'TOTAL FACTURA', 'SUBTOTAL', 'IVA', 'MÉTODO DE PAGO', 'FECHA DE CARGA', 'HORA', 'STATUS', 'NUMERO DE ORDEN']
    e.result.forEach(element => {
        arrayTemp.push([element[30], element[2], 
                        element[16], element[14], element[15],
                        element[19], element[17], element[20],
                        element[25], element[29]])
    })
    arrayTemp.unshift(encabezados)
    dataFinal = arrayTemp
    var table = document.getElementById("t_facturas");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        row = table.rows[i];
        row.onclick = function(){

            var cell_id = this.getElementsByTagName("td")[0];
            uuidElegido = this.getElementsByTagName("td")[8].innerHTML;
            console.log(cell_id.innerHTML);
            // var id_tabla = cell_id.innerHTML;
            // document.getElementById("id_factura").innerHTML = `ID DE FACTURA: ${ids}`;

            // let find = ids.indexOf(cell_id.innerHTML)
            // console.log(typeof find, find);
            // if (find == -1) {
            //     ids.push(cell_id.innerHTML)
            //     console.log(ids);
                
            // }
            if (where) {
                switch (where) {
                    case 'subir':
                        let find = ids.indexOf(cell_id.innerHTML)
                        console.log(typeof find, find);
                        if (find == -1) {
                            ids.push(cell_id.innerHTML)
                            console.log(ids);
                        }
                    break;
                    case 'actualizar':
                        ids[0] = cell_id.innerHTML;
                    break;
                
                    default:

                        break;
                }
            }else{
                console.log('viene vacia');
            }
            // document.getElementById("id_factura").innerHTML = `ID DE FACTURA: ${ids}`;
            document.getElementById("idFacturaAct").value = ids;
            // document.getElementById("busqueda").value = id_tabla
        };
    }
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

function generaCsv(){
    let csv = new p5.Table();
    csv = data
    save(csv, 'example.csv', true)
}

function ctrlq(e){

    console.log(e)
    let arrayTemp = []
    const encabezados = ['FOLIO', 'TIPO FACTURA', 'TOTAL FACTURA', 'SUBTOTAL', 'IVA', 'MÉTODO DE PAGO', 'FECHA DE CARGA', 'HORA', 'STATUS', 'NUMERO DE ORDEN']
    e.result.forEach(element => {
        arrayTemp.push([element[30],  element[2], 
                        element[16], element[14], element[15],
                        element[19], element[17], element[20],
                        element[25], element[29]])
    })
    arrayTemp.unshift(encabezados)
    data = arrayTemp;
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
            <td>` + e.result[i][30] + `</td>
            <td>` + e.result[i][3] + `</td>
            <td>` + e.result[i][2] + `</td>
            <td>` + '$ '+nfc(e.result[i][16].toString(), 3) + `</td>
            <td>` + '$ '+nfc(e.result[i][14].toString(), 3) + `</td>
            <td>` + '$ '+nfc(e.result[i][15].toString(), 3) + `</td>
            <td>` + fecha + `</td>
            <td>` + `<a href="${enlace}">${texto}</a>`  + `</td>
            <td style="background-color: ${colorResal}">` + e.result[i][25] + `</td>
            <td>` + e.result[i][29] + `</td>
            <td style="display: none">` + e.result[i][28] + `</td>
        </tr>`;
        $("#t_facturas").append(tr)
    }
    dataFinal = arrayTemp
    var table = document.getElementById("t_facturas");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        row = table.rows[i];
        row.onclick = function(){

            var cell_id = this.getElementsByTagName("td")[0];
            uuidElegido= this.getElementsByTagName("td")[8].innerHTML;

            console.log(uuidElegido);
            console.log(cell_id.innerHTML);
            // // var id_tabla = cell_id.innerHTML;
            
            if (where) {
                switch (where) {
                    case 'subir':
                        let find = ids.indexOf(cell_id.innerHTML)
                        console.log(typeof find, find);
                        if (find == -1) {
                            ids.push(cell_id.innerHTML)
                            console.log(ids);
                            fillTable(ids)
                        }
                    break;
                    case 'actualizar':
                        ids[0] = cell_id.innerHTML;
                    break;
                
                    default:

                        break;
                }
            }else{
                console.log('viene vacia');
            }

            // document.getElementById("id_factura").innerHTML = `ID DE FACTURA: ${ids}`;
            document.getElementById("idFacturaAct").value = ids;
            // document.getElementById("busqueda").value = id_tabla
        };
    }
}

function validateFiles() {
    if (ids.length >0) {
        try {
            btn_subir.attribute('disabled','')
            var readerPDF = new FileReader();
            var filePDF = document.getElementById('uploadPDF').files[0];
            
            readerPDF.onload = function() {
                let base64PDF = readerPDF.result
                
                document.getElementById('fileContentPDF').value = base64PDF.substring(28, base64PDF.length);
                // document.getElementById('postPDF').action = '';
                // document.getElementById('postPDF').submit();
                
            }
            readerPDF.readAsDataURL(filePDF);
            var readerXML = new FileReader();
            var fileXML = document.getElementById('uploadXML').files[0];
            console.log(readerXML)
            document.getElementById('fileXMLName').value = fileXML.name
    
            const [nombrePDF] = filePDF.name.split('.')
            const [nombreXML] = fileXML.name.split('.')
            
    
            readerXML.readAsDataURL(fileXML);
            readerXML.onload = function(e) {
                let base64XML = readerXML.result
                document.getElementById('fileContentXML').value = base64XML.substring(21, base64XML.length)
                
                var rawLog = readerXML.result;
                xml =loadXML(rawLog)
                console.log(xml);
                sleep(1500).then(() => {
                    let children = xml.getChildren('cfdi:Emisor')
                    let parent = children[0].getParent();
                    let childEmisor = xml.getChild('cfdi:Emisor')
                    let childConceptos = xml.getChild('cfdi:Conceptos')
                    let childConcepto = childConceptos.getChild('cfdi:Concepto')
                    let impuestos = childConcepto.getChild('cfdi:Impuestos');
        
                    let rfcEmisor       = childEmisor.DOM.attributes.Rfc
                    let selloFiscal     = parent.DOM.attributes.Sello
                    let totalFactura    = parent.DOM.attributes.Total
                    let subTotalFactura = parent.DOM.attributes.SubTotal
                    let fechaFactura    = parent.DOM.attributes.Fecha
                    let moneda          = parent.DOM.attributes.Moneda
                    let tipoCambio      = '';
                    let ivaPorcentaje   = ''; 
                    let valorIvaPorcentaje = '';

                    if (moneda.value == 'MXN') {
                        tipoCambio = ''
                        ivaPorcentaje       = impuestos.getChild('cfdi:Traslados').getChild('cfdi:Traslado').DOM.attributes.TasaOCuota
                        valorIvaPorcentaje  = impuestos.getChild('cfdi:Traslados').getChild('cfdi:Traslado').DOM.attributes.Importe
                    }
                    if (moneda.value == 'USD') {
                        tipoCambio          = parent.DOM.attributes.TipoCambio.value
                        ivaPorcentaje       = impuestos.getChild('cfdi:Traslados').getChild('cfdi:Traslado').DOM.attributes.TasaOCuota
                        valorIvaPorcentaje  = impuestos.getChild('cfdi:Traslados').getChild('cfdi:Traslado').DOM.attributes.Importe
                    }
                    if (moneda.value == 'XXX') {
                        try {
                            tipoCambio          = xml.getChild('cfdi:Complemento').getChild('pago10:Pagos').getChild('pago10:Pago').DOM.attributes.TipoCambioP.value
                        } catch (error) {
                            tipoCambio          = xml.getChild('cfdi:Complemento').getChild('pago20:Pagos').getChild('pago20:Pago').DOM.attributes.MonedaP.value
                        }
                        
                    }
                    console.log(tipoCambio);
                    let uuidXML = ''
                    try {
                        uuidXML = xml.getChild('cfdi:Complemento').DOM.children[0].attributes.UUID.value;
                    } catch (error) {
                        uuidXML = xml.getChild('cfdi:Complemento').DOM.children[1].attributes.UUID.value;
                    }

                    console.log(uuidXML, uuidElegido);
                    document.getElementById('rfcEmisor').value = rfcEmisor.value
                    document.getElementById('selloFiscal').value = selloFiscal.value 
                    document.getElementById('totalFactura').value = totalFactura.value 
                    document.getElementById('subTotalFactura').value = subTotalFactura.value 
                    document.getElementById('fechaCaptura').value = fechaFactura.value
                    document.getElementById('moneda').value = moneda.value
                    document.getElementById('ivaPorcentaje').value = ivaPorcentaje.value
                    document.getElementById('valorIvaPorcentaje').value = parseFloat(valorIvaPorcentaje.value).toFixed(2)
                    // document.getElementById('tipo').value = invoiceSelector.value()
                    // document.getElementById('idUsuario').value = localStorage.getItem('idUser') 
                    document.getElementById('id').value = localStorage.getItem('id')
                    document.getElementById('tipoCambio').value = tipoCambio
                    document.getElementById('ids_facturas').value = ids
    
                    if (rfcEmisor && selloFiscal && totalFactura && subTotalFactura && fechaFactura && moneda
                        && document.getElementById('fileContentPDF').value!='' && document.getElementById('fileContentXML').value !='' ) {
                            
                            
                            if (nombrePDF === nombreXML) {
                                sleep(3000).then(() => {
                                    document.getElementById('postXML').action = urlPostPDFXML;
                                    document.getElementById('postXML').submit();
                                    btn_subir.removeAttribute('disabled');
                                    swal('Se abrirá una pestaña en el navegador, por favor no la cierres hasta que el sistema te indique','','success')
                                    .then((value) => {
                                        location.reload()
                                    });
                                });
                            }else{
                                swal('Los nombres de archivos no coinciden','','error')
                                btn_subir.removeAttribute('disabled');
                            }
                            
                            
                    }
                });
            };
        } catch (error) {
            swal('Campos faltantes','Verifica que cargaste correctamente los archivos','error')
            btn_subir.removeAttribute('disabled');
        }
    }else{
        swal('Campos faltantes','','error')
    }
}

function getMs() {
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

function actualizaOrden() {
    
    if (idFacturaActualizar.value() && txtNumOrden.value()) {

        btnActualizarOrden.attribute('disabled', '')
        
        var url = urlActualizarOrden + "?callback=responseActualizarOrden&"+
            "&id_factura="+ idFacturaActualizar.value() +
            "&numero_orden="+ txtNumOrden.value() +
            "&action=MS12";
            console.log(url);
            var request = jQuery.ajax({
                crossDomain: true,
                url: url,
                method: "GET",
                dataType: "jsonp",
            });

            
    }else{
        swal('Por favor verifica que seleccionaste un id y número de orden','','error')

    }
}

function responseActualizarOrden(e) {
    console.log(e);
    btnActualizarOrden.removeAttribute('disabled')
    if (e.result == 'ok') {
        swal('¡Éxito!','Número de orden cambiado satisfactoriamente','success').then(()=>{location.reload()})
    }else{
        swal('Error','Algo salió mal','error')

    }
}

function generaCsv(){
    //Num Vendor*Factura	PO	SubTotal	IVA	Flete	Retencion	Total Factura	Forma de Pago	Fecha Factura	Num Recibo	Num Proyecto
    const encabezado = [['ID de factura','RFC',	'TIPO DE FACTURA','MONTO','FECHA','COMPLEMENTO','STATUS','NUMERO DE ORDEN']]
    // dataFinal = encabezado.concat(dataFinal)
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: `Reporte de facturas pendientes ${year()}-${month()}-${day()}`,
        Subject: "Test",
        Author: "SEL PORTAL DE FACTURAS",
        CreatedDate: new Date(year(),month(),day())
    };
    wb.SheetNames.push("Hoja 1");

    var ws_data = dataFinal;
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Hoja 1"] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `Reporte de facturas ${year()}-${month()}-${day()}.xlsx`);
    // showAlertAfterDelay()
}

function showAlertAfterDelay() {
    setTimeout(function() {
        swal('¡Descargado con éxito!','','success').then(()=>location.reload());
    }, 5000); // espera 5 segundos (5000 milisegundos)
}
function s2ab(s) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}

function fillTable(data ) {
    $("#t_seleccion").html("")
    data.forEach(element => {
        var tr = `<tr>
                <td>` + element + `</td>
                <td><button type="button" class="btn btn-secondary" style="height: 35px; width: 150px; padding: 0px; border-radius: 10px;" onclick="eliminarProducto('${element}')"><i class="fa fa-fw fa-window-close"></i>QUITAR</button></td>
            </tr>`;
        $("#t_seleccion").append(tr)
    });
}

function eliminarProducto(nombre) {

    const encontrado = ids.indexOf(nombre)

    if (encontrado > -1) {
        ids.splice(encontrado, 1)
        fillTable(ids)
    }

}