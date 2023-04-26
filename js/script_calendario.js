const script_url = '';
let urlMs = '';
function setup() {
    getMs()
    setName()
    checkUser()
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

function consultaDia(dia) {
    
    let aleatorio = Math.round(Math.random()*10);
    if (aleatorio <= 0) {
        aleatorio = 1;
    };
    $("#t_facturas").html("");
    for (var i = 0; i < aleatorio; i++) {
        var tr = `<tr>
            <td>` + 'Concepto ' + parseFloat(i+1)  + `</td>
            <td>` + 'Monto '+ parseFloat(i+1) + `</td>
        </tr>`;
        $("#t_facturas").append(tr)
    }
}

function checkRFC() {
    const rfc = localStorage.getItem('rfc');
    let rfcInput = ''
    if (!rfc) {
        swal("POR FAVOR INTRODUCE RFC", {
            content: "input",
            closeOnClickOutside: false,
            closeOnEsc: false,
        })
        .then((value) => {  

            if (value=='') {
                checkRFC()
            }else{
                rfcInput = value;
                swal({
                    title:'¡Atención!',
                    text:`Tu RFC se establecerá como ${value}`,
                    icon: 'info',
                    closeOnClickOutside: false,
                }).then((value)=> {
                    var url = urlMs+ "?callback=rfcResponse&" +
                        "&rfc=" +  rfcInput +
                        "&id=" +  localStorage.getItem('id')+
                        "&action=ac_rfc";
                    
                    var request = jQuery.ajax({
                        crossDomain: true,
                        url: url,
                        method: "GET",
                        dataType: "jsonp",
                    });

                    localStorage.setItem('rfc',rfcInput)
                })
                
            }
        });
    }
}

function rfcResponse(e) {
    console.log(e);
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
let urlPreguntaDia = '';
function microservicios(e) {
    
    urlMs = e.result[1][2]
    urlPreguntaDia = e.result[6][2]
    
    checkRFC()

    consultaDias(e.result[3][2])
}

function consultaDias(urlAlgo){
    var url = urlAlgo + "?callback=responseDias&" +
        "&id=" + localStorage.getItem('id')+
        "&origen=N" +
        "&action=MS4";
    //"https://script.google.com/macros/s/AKfycbx8WOMCAm6gzOFGDqI5ktlPNp2U033vkEFk7bfH0FmWVwi1I3H75-m78d9yjQQTXum21Q/exec"
    
    console.log(url);
    var request = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "jsonp",
    });
}

function responseDias(e) {
    console.log(e);
    let diasResaltados = [];
    
    e.result.forEach(element => {
        diasResaltados.push(parseFloat(element))
    });
    $(document).ready(function(e){
        calendar = new CalendarYvv("#calendar", moment().format("Y-M-D"), "Monday");
        calendar.funcPer = function(ev){
            console.log('llega');
            const [anio, mes, dia] = ev.currentSelected.split('-')
            
            let foundFecha = diasResaltados.find(element => element==dia)

            if (foundFecha != undefined) {
                preguntaDia(`${dia}/${mes}/${anio}`)
            }else{
                console.log(foundFecha);
            }
        };
         calendar.diasResal = diasResaltados
       
        calendar.createCalendar();
    });
}

function preguntaDia(fecha) {
    var url = urlPreguntaDia + "?callback=responsePreguntaDia&" +
        "&id=" + localStorage.getItem('id')+
        "&fecha=" + fecha +
        "&origen=N" +
        "&action=MS7";

        console.log(url);
    //"https://script.google.com/macros/s/AKfycbx8WOMCAm6gzOFGDqI5ktlPNp2U033vkEFk7bfH0FmWVwi1I3H75-m78d9yjQQTXum21Q/exec"
    var request = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "jsonp",
    });
}

function responsePreguntaDia( e ) {
    console.log(e.result)
    $("#t_facturas").html("");
    for (var i = 0; i < e.result.length; i++) {
        var tr = `<tr>
            <td>` + e.result[i][30]  + `</td>
            <td>` + "$" +nfc(e.result[i][9]) + `</td>
        </tr>`;
        $("#t_facturas").append(tr)
    }
}