function setup() {
    
    setName()

    docSelector = select('#selectDoc')
    document.getElementById('txt_name').innerHTML = `NOMBRE DE PROVEEDOR: ${localStorage.getItem('nombre')}`
    document.getElementById('txt_rfc').innerHTML = `RFC DE PROVEEDOR: ${localStorage.getItem('rfc')}`

    for (let index = 1; index < 10; index++) {
        docSelector.option(`Documento ${index}`)
        
    }
    btn_subir = select('#btnSubir')
    btn_subir.attribute('disabled','')
    checkUser()
}
