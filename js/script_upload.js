const arrayInvoice = ['MATERIALES'];
let invoiceSelector, numOrden, folio;
let btn_subir, btn_subir_xml, btnAyuda;
let xml;
let urlMs = ''
let selectInvoice 
function preload(){
    // xml =loadXML('../Factura.xml')
    // console.log(xml)
}


function validarCeros(cadena) {
    const cerosConsecutivos = /^0{1,9}$/

    if (cadena.length > 0 && cadena.length < 11){
        if (cerosConsecutivos.test(cadena)) {
          // La cadena ya tiene entre 1 y 9 ceros consecutivos
          return cadena
        } else {
          // La cadena no tiene ceros consecutivos
          const cerosFaltantes = '0'.repeat(10 - cadena.length)
          return cerosFaltantes + cadena
        }
    }else{
        return 'no'
    }

}

function setup() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    getMs()
    // setName()
    // checkUser()
    getPendientes()

    console.log(validarCeros('31530807031234'))
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
    selectInvoice = select('#selectInvoice1')
    selectInvoice.changed(searchReceipt)

    btn_subir = select('#btnSubirPDF')
    btn_subir.mouseClicked(validateFiles)
    // btn_subir.attribute('disabled','')
    
    btnAyuda = select('#btnAyuda');
    btnAyuda.mouseClicked(mensajeAlerta);

    invoiceSelector = select('#selectInvoice');
    arrayInvoice.forEach(element => {
        invoiceSelector.option(element)
    });

    numOrden = select('#numOrden')
    folio = select('#folio')
}

function uploadPDF() {
    
    if (invoiceSelector.value() != '0'){ 
        
        var reader = new FileReader();
        var file = document.getElementById('uploadPDF').files[0];
        reader.onload = function() {
            document.getElementById('fileContentPDF').value = reader.result;
            document.getElementById('postPDF').action = '';
            document.getElementById('postPDF').submit();
            
        }
        reader.readAsDataURL(file);
        
    }else{
        swal('Campos faltantes','','error')
    }
    
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ejemplo() {
    console.log('llegaxml');
    var reader = new FileReader();
    var file = document.getElementById('uploadXML').files[0];

    document.getElementById('fileContentXML').value = file.name
    
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        var rawLog = reader.result;

        console.log(rawLog);
        xml =loadXML(rawLog)
        sleep(1500).then(() => {
            let children = xml.getChildren('cfdi:Emisor')
            console.log(children)
            let parent = children[0].getParent();
            let childEmisor = xml.getChild('cfdi:Emisor')
            let childConceptos = xml.getChild('cfdi:Conceptos')
            let childConcepto = childConceptos.getChild('cfdi:Concepto')
            let impuestos = childConcepto.getChild('cfdi:Impuestos');

            let rfcEmisor = childEmisor.DOM.attributes.Rfc
            let selloFiscal = parent.DOM.attributes.Sello
            let totalFactura = parent.DOM.attributes.Total
            let subTotalFactura = parent.DOM.attributes.SubTotal
            let fechaFactura = parent.DOM.attributes.Fecha
            let moneda = parent.DOM.attributes.Moneda
            
            //let ivaPorcentaje = impuestos.getChild('cfdi:Traslados').getChild('cfdi:Traslado').DOM.attributes.TasaOCuota
            //let valorIvaPorcentaje = impuestos.getChild('cfdi:Traslados').getChild('cfdi:Traslado').DOM.attributes.Importe
            console.log(xml.getChild('cfdi:Complemento').DOM.children[0].attributes.UUID.value)
            // document.getElementById('postXML').action = 'https://script.google.com/macros/s/AKfycbxmkukq18MsJB4dMtLW0pnroKNttwPNW_O7UfN6Cl5k9JOJ6Io/exec';
            // document.getElementById('postXML').submit();
        });
    };
}
let idEnviar = ''
function validateFiles() {
    if (invoiceSelector.value() != '0') {
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
                console.log(rawLog);
                xml =loadXML(rawLog)
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
                    let metodoPago      = parent.DOM.attributes.MetodoPago
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
                        tipoCambio          = xml.getChild('cfdi:Complemento').getChild('pago10:Pagos').getChild('pago10:Pago').DOM.attributes.TipoCambioP.value
                        
                    }

                    //por si no encuentra el campo de importe en cfdi:traslado

                    if (valorIvaPorcentaje == '0.00' || valorIvaPorcentaje == '0' || valorIvaPorcentaje == '') {
                        valorIvaPorcentaje = xml.getChild('cfdi:Impuestos').DOM.attributes.TotalImpuestosTrasladados.value
                    }

                    document.getElementById('rfcEmisor').value = rfcEmisor.value
                    document.getElementById('selloFiscal').value = selloFiscal.value 
                    document.getElementById('totalFactura').value = totalFactura.value 
                    document.getElementById('subTotalFactura').value = subTotalFactura.value 
                    document.getElementById('fechaCaptura').value = fechaFactura.value
                    document.getElementById('moneda').value = moneda.value
                    document.getElementById('ivaPorcentaje').value = ivaPorcentaje.value
                    document.getElementById('valorIvaPorcentaje').value = parseFloat(valorIvaPorcentaje.value).toFixed(2)
                    document.getElementById('tipo').value = invoiceSelector.value()
                    // document.getElementById('idUsuario').value = localStorage.getItem('idUser') 
                    document.getElementById('id').value = localStorage.getItem('id')
                    document.getElementById('tipoCambio').value = tipoCambio
                    document.getElementById('numero_orden').value = numOrden.value()
                    // document.getElementById('numero_folio').value = folio.value()
                    document.getElementById('uuid').value = xml.getChild('cfdi:Complemento').DOM.children[0].attributes.UUID.value
                    document.getElementById('metodo_pago').value = metodoPago.value
                    idEnviar = xml.getChild('cfdi:Complemento').DOM.children[0].attributes.UUID.value
                    console.log(metodoPago)
                    if (validarCeros(folio.value()) != 'no') {
                        document.getElementById('numero_folio').value = validarCeros(folio.value())
                        if (rfcEmisor.value.toUpperCase() == localStorage.getItem('rfc').toUpperCase()) {
                            console.log('llega')
                            if (rfcEmisor && selloFiscal && totalFactura && subTotalFactura && fechaFactura && moneda
                                && document.getElementById('fileContentPDF').value!='' && document.getElementById('fileContentXML').value !='' && numOrden.value() != '' && folio.value() != '') {
                                    if (nombrePDF === nombreXML) {
                                        sleep(3000).then(() => {
                                            document.getElementById('postXML').action = urlMs;
                                            document.getElementById('postXML').submit();
                                            btn_subir.removeAttribute('disabled');
                                            sendArray()
                                            swal('Se abrirá una pestaña en el navegador, por favor no la cierres hasta que el sistema te indique','','success')
                                            .then((value) => {
                                                location.reload()
                                            });
                                        });
                                    }else{
                                        btn_subir.removeAttribute('disabled');
                                        swal('Los nombres de archivos no coinciden','','error')
                                    }
                            }else{
                                swal('Error','Verifica los campos','error')
                            }
                        }else{
                            btn_subir.removeAttribute('disabled');
                            swal('Error','LOS RFC no coinciden','error')
                        }
                    }else{
                        swal('Error','El folio excede los 10 caracteres','error')
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

function mensajeAlerta(params) {
    swal('AYUDA','Para cualquier duda o aclaracion puedes contactar al siguiente correo: soporte@sel.com','info')
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
    urlMs = e.result[2][2]
    
}

function getPendientes() {
    // console.log(localStorage.getItem('nombre'));
    console.log(localStorage.getItem('idSEL'));
    var settings = {
        "url":  'https://script.google.com/macros/s/AKfycbz0_g0iajCvO6n-6fuLjbcrYZNEhlX9b-nQRHQ1Pcf-3lB78QDuffarpAIZ1HEGvyEHWA/exec',
        "type": "POST",
        "data":JSON.stringify({
            "id_usuario": localStorage.getItem('idSEL')
        }),
        success: function(){
            // alert( "Gracias" );
        },
        error: function() {
        
            swal('Error de conexión','','info')
        }
    };
    $.ajax(settings).done(function (response) {
        const data = JSON.parse(response)
        console.log(data);
        // $('#tabla_pendientes').DataTable({
        //     data: data.arr
        // });
        // swal('Subido con éxito','','success').then(()=> location.reload())
        $("#t_pendientes").html("");

        data.arr.forEach(element => {
            var tr = `<tr>
                <td>` + element[5] + `</td>
                <td>` + element[6] + `</td>
                <td>` + element[8] + `</td>
                <td>` + element[0]+ `</td>
                <td>` + element[1]+ `</td>
                <td>` + element[2]+ `</td>
                <td>` + element[3] + `</td>
                <td>` + element[4] + `</td>
            </tr>`;
        $("#t_pendientes").append(tr)
        })
        // var table = document.getElementById("t_pendientes");
        
        // // Obtener todas las filas de la tabla
        // var rows = table.getElementsByTagName("tr");
        
        // // Agregar un evento 'click' a cada fila
        // for (var i = 0; i < rows.length; i++) {
        //     rows[i].addEventListener("click", function() {
        //         // Obtener el índice de la fila que ha sido clickeada
        //         var index = this.rowIndex;
        //         // Acciones a realizar cuando se hace clic en la fila
        //         console.log("Fila clickeada: " + index);
        //         if (index!=0) {index = index -1}
        //         llenarDerecha(index, data.arr)
        //     });
        // }
        const invoicesList = data.arr.map((r)=>{ return r[8]; });
        const uniqInvoices = [... new Set(invoicesList)]
        
        const ordenados = uniqInvoices.sort()
        // document.getElementById("selectInvoice").innerHTML = "";
        // selectInvoice.option('-');
        ordenados.forEach(element => {
            selectInvoice.option(element)
        })
        console.log(uniqInvoices);
    });

    // const data = [
    //     ['1001',	'SCHWEITZER ENG.LAB.INC.',	'624-0019',	    '106B901D FISD',	        '1/2/2023',	'403815',   '209469'],
    //     ['1001',	'SCHWEITZER ENG.LAB.INC.',	'645-0008',	    '240-1801',	                '1/2/2023',	'403847',	'208637'],
    //     ['1001',	'SCHWEITZER ENG.LAB.INC.',	'645-0108-SS',	'0411L1X4X5C7DDXH5C474XX',  '1/2/2023',	'403838',   '206980']
    // ]

    

}

let arraySeleccionados  = []

function llenarDerecha(indice, data) {
    
    var encontrado = arraySeleccionados.some(function(arr2) {
        return JSON.stringify(data[indice]) === JSON.stringify(arr2);
    });

    if (encontrado == false) {
        arraySeleccionados.push(data[indice])
    }else{
        console.log('Ese ya estaba pa');
    }

    $("#t_pendientes_seleccionados").html("");
    //<td><input type="text" class="form-control" id="txt${element[2]}" placeholder="Ingresa tu numero de proyecto"></td>
    arraySeleccionados.forEach(element => {
        var tr = `<tr>
            <td>` + element[5]+ `</td>
            <td>` + element[2]+ `</td>
            <td>` + element[3] + `</td>
            <td>` + element[4] + `</td>
            
            <td><button type="button" class="btn btn-secondary" id="${element[2]}" style="height: 35px;  padding: 0px; border-radius: 10px;" onclick="eliminarProducto(${element[2]})"><i class="fa fa-fw fa-window-close"></i></button></td>
        </tr>`;
        $("#t_pendientes_seleccionados").append(tr)
    })
}

function eliminarProducto(index) {
    // console.log(index);
    const lista_nombres = arraySeleccionados.map((r)=>{ return r[2]; });
    const encontrado = lista_nombres.indexOf(index)
    
    arraySeleccionados.splice(encontrado, 1)
    $("#t_pendientes_seleccionados").html("");
    console.log(arraySeleccionados);
    arraySeleccionados.forEach(element => {
        var tr = `<tr>
            <td>` + element[2]+ `</td>
            <td>` + element[3] + `</td>
            <td>` + element[4] + `</td>
            
            <td><button type="button" class="btn btn-secondary" id="${element[2]}" style="height: 35px;  padding: 0px; border-radius: 10px;" onclick="eliminarProducto(${element[2]})"><i class="fa fa-fw fa-window-close"></i></button></td>
        </tr>`;
    $("#t_pendientes_seleccionados").append(tr)
    })
}

function sendArray() {
    // console.log(arraySeleccionados);
    // console.log(idEnviar);
    var settings = {
        "url":  'https://script.google.com/macros/s/AKfycbyV86iX2TJogyQzuRlrG0rIncoj9xuhSyKVq1Rf8ujXbGudetzCCDlSsE2V11W_uWtm/exec',
        "type": "POST",
        "data":JSON.stringify({
            "id_factura": idEnviar,
            "recibos": arraySeleccionados 
        }),
        success: function(){
            // alert( "Gracias" );
        },
        error: function() {
        
            swal('Error de conexión','','info')
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        const data = JSON.parse(response)

        // swal('Subido con éxito','','success').then(()=> location.reload())
    })
}

function searchReceipt() {
    console.log(selectInvoice.value() );
    document.getElementById('buscando').style.display = 'block'
    selectInvoice.attribute('disabled', '')
    var settings = {
        "url":  'https://script.google.com/macros/s/AKfycbzWfLW-SYM69-wVhbcxCubnBQwSUvSYgvNLU6gauvaNfmJL1hf-hSwrgZ5a4ABF1IKR/exec',
        "type": "POST",
        "data":JSON.stringify({
            "id_usuario": localStorage.getItem('nombre'),
            "invoice": selectInvoice.value() 
        }),
        success: function(){
            // alert( "Gracias" );
        },
        error: function() {
            selectInvoice.removeAttribute('disabled')
            swal('Error de conexión','','info')
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        const data = JSON.parse(response)
        $("#t_pendientes_seleccionados").html("");
        arraySeleccionados = data.arr
        console.log(arraySeleccionados);
        //<td><input type="text" class="form-control" id="txt${element[2]}" placeholder="Ingresa tu numero de proyecto"></td>
        data.arr.forEach(element => {
            var tr = `<tr>
                <td>` + element[5]+ `</td>
                <td>` + element[2] + `</td>
                <td>` + element[3] + `</td>
                <td>` + element[4] + `</td>
            </tr>`;
            $("#t_pendientes_seleccionados").append(tr)
        })
        document.getElementById('buscando').style.display = 'none'
        selectInvoice.removeAttribute('disabled')
        // swal('Subido con éxito','','success').then(()=> location.reload())
    })
}
