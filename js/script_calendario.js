const script_url = '';
let urlMs = '';
function setup() {
    getMs()

    setName()

    $(document).ready(function(e){
        calendar = new CalendarYvv("#calendar", moment().format("Y-M-D"), "Monday");
        calendar.funcPer = function(ev){
            // console.log(ev.currentSelected)
            const [anio, mes, dia] = ev.currentSelected.split('-')
            
            consultaDia(ev.currentSelected)
        };
        calendar.diasResal = [4,15,26]
       
        calendar.createCalendar();
    });
    // let aleatorio = Math.round(Math.random()*10);


    // if (aleatorio <= 0) {
    //     aleatorio = 1;
    // };
    // console.log(aleatorio)
    // $("#t_facturas_restantes").html("");
    // for (var i = 0; i < aleatorio; i++) {
    //     var tr = `<tr>
    //         <td>` + 'Concepto ' + parseFloat(i+1)  + `</td>
    //         <td>` + 'Monto '+ parseFloat(i+1) + `</td>
    //     </tr>`;
    //     $("#t_facturas_restantes").append(tr)
    // }
}

function consultaDia(dia) {
    console.log(dia);
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

function microservicios(e) {
    console.log(e);
    urlMs = e.result[1][2]
    checkRFC()
    consultaDias(e.result[3][2])
}

function consultaDias(url){
    var url = url + "?callback=microservicios&" +
        "&action=microservicios";
    
    var request = jQuery.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        dataType: "jsonp",
    });
}