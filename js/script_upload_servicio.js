const arrayInvoice = ['SERVICIOS'];
let invoiceSelector, numOrden, folio;
let btn_subir, btn_subir_xml, btnAyuda;
let xml;
let urlMs = ''
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
    getMs()
    setName()
    checkUser()
    try {
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
                    
                    
                    if (validarCeros(folio.value())!= 'no') {
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