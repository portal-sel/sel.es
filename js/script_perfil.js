function setup() {
    
    setName()

    docSelector = select('#selectDoc')

    for (let index = 1; index < 10; index++) {
        docSelector.option(`Documento ${index}`)
        
    }
    btn_subir = select('#btnSubir')
    btn_subir.attribute('disabled','')
    checkUser()
}
