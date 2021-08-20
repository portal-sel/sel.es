
const arrayInvoice = ['SERVICIOS', 'MATERIALES'];
let invoiceSelector;
let btn_subir, btn_subir_xml, btnAyuda;
let xml;
let urlMs = ''
function preload(){
    // xml =loadXML('../Factura.xml')
    // console.log(xml)
}

function setup() {
    getMs()
    setName()
    btn_subir = select('#btnSubirPDF')
    btn_subir.mouseClicked(validateFiles)

    btnAyuda = select('#btnAyuda');
    btnAyuda.mouseClicked(mensajeAlerta);

    invoiceSelector = select('#selectInvoice');
    arrayInvoice.forEach(element => {
        invoiceSelector.option(element)
    });
    btn_subir.attribute('disabled','')
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

function uploadXML() {

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
            console.log(rfcEmisor, moneda, selloFiscal, totalFactura, subTotalFactura, fechaFactura)
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
    
                    if (rfcEmisor && selloFiscal && totalFactura && subTotalFactura && fechaFactura && moneda
                        && document.getElementById('fileContentPDF').value!='' && document.getElementById('fileContentXML').value !='' ) {
    
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
                                swal('Los nombres de archivos no coinciden','','error')
                            }
                    }
                });
            };
        } catch (error) {
            swal('Campos faltantes','Verifica que cargaste correctamente los archivos','error')
            
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

