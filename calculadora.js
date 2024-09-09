// genero array de nombres de filamentos para utilizar en prompts
const filamentos = [
    {nombre: "PLA"},
    {nombre: "ABS"},
    {nombre: "PETG"},
    {nombre: "Flex"},
    {nombre: "Otro"},
]

//quiero que se valide que es lo que se carga en los campos
//siempre tienen que tener informacion, y en caso de los campos numericos que valide esto para no hacer los calculos mal despues
//consultar con profes si hay forma mas eficiente de validar
const validarImput = (mensaje, esNumerico = false) => {
    let input = " ";
    while (!input.trim()) {
        input = prompt(mensaje);
        if (!input.trim()) {
            alert("No válido, vuelva a intentar.");
        } else if (esNumerico && isNaN(input)) {
            alert("Por favor ingresa un número");
            return validarImput(mensaje, true);
        }
    }
    return input;
}

//en las siguientes funciones de calculo realizo las operaciones correspondientes a cada costo
//multiplico el peso de filamento usado por el precio de la bobina y lo divido por los gramos de filamento que trae la misma bobina
const calculoBase = (peso, bobinaPrecio, bobinaPeso)=>{
    let precioBase = (peso*bobinaPrecio)/bobinaPeso;
    return precioBase
}

//multiplico el consumo de Wh por el precio unitario del kWh y lo divido por 1000 (1000 kWh = W) y a todo eso lo multiplico por el tiempo que va a llevar la impresión
//estos valores van a ser opcionales para cargar
const calculoElectricidad = (tiempo, consumo, precioKW)=>{
    let precioExtraElec = ((consumo*precioKW)/1000)*tiempo;
    return precioExtraElec
}

//calculos de mano de obra por hora previos y posteriores a la impresion, tiempo empleado (pre y post) por coste por hora dividido 60 minutos que se suman
//estos valores van a ser opcionales para cargar
const calculoManoObra = (tiempoManoObra, costeManoObra, tiempoPost, costePost)=>{
    let precioExtraMano = ((tiempoManoObra*costeManoObra)/60)+((tiempoPost*costePost)/60);
    return precioExtraMano
}

//esta lista de trabajos va a almacenar cada trabajo que se agregue al precio final
const listaTrabajos = []

//agregar trabajos a la lista final
const agregarTrabajos = (precioBase, precioExtraElec, precioExtraMano)=>{
    const nuevoTrabajo = precioBase + precioExtraElec + precioExtraMano;
    listaTrabajos.push(nuevoTrabajo);
}

//repasa todos los elementos de la lista de trabajos y los suma en un total final
const totalCosto = ()=>{
    let precioTotal = 0;
    for(let i=0; i<listaTrabajos.length; i++){
        precioTotal += listaTrabajos[i];
    }
    return precioTotal
}

//la aplicacion va a pedir la carga de los valores. Hay datos que son opcionales
//dentro del while se carga el trabajo a la lista para permitir al usuario cargar otro trabajo. Si es asi, los valores de las variables se inicializan nuevamente al volver a ingregar al while.
//guarde los console.logs para guiarme mejor con los valores que iba cargando
//ver en el futuro posibilidad de cargar estos datos desde un formulario en el html para no usar tantos prompts
//Agregué texto a los logs para que se entienda cada valor
const aplicacion = ()=>{
    alert("Bienvenido a nuestra calculadora de costos de Impresiones 3D. \nA continuación se le pedirá información referida al proyecto a imprimir y el filamento a utilizar.");
    let loop = true;
    let precioExtraElec = 0;
    let precioExtraMano = 0;
    while(loop){
    let loopElectricidad = true;
    let loopManoObra = true;
    let tiempo = 0;
    let consumo = 0;
    let precioKW = 0;
    let tiempoManoObra = 0;
    let costeManoObra = 0;
    let tiempoPost = 0;
    let costePost = 0;
    let precioExtraElec = 0;
    let precioExtraMano = 0;
    let nombre = validarImput("Indique nombre del trabajo:");
    let filamento = validarImput("Seleccione el tipo de filamento a utilizar en " + nombre + ": \n 0-PLA \n 1-ABS \n 2-PETG \n 3-Flex \n 4-Otro", true);
    let peso = validarImput("Indique los gramos de filamento " + filamentos[filamento].nombre + " que se van a utilizar en " + nombre + ":", true);
    let bobinaPrecio = validarImput("¿Cuanto sale la bobina de filamento " + filamentos[filamento].nombre + "?", true);
    let bobinaPeso = validarImput("¿Cuantos gramos de filamento " + filamentos[filamento].nombre + " trae la bobina a usar?", true);
    console.log("Nombre del trabajo:", nombre, "; filamento:", filamentos[filamento].nombre, "; consume", peso, "gs; la bobina sale $", bobinaPrecio, "y trae", bobinaPeso, "gs." )
    loopElectricidad = confirm("¿Desea cargar datos de gasto eléctrico? (Consumo de energia en W/Precio de kWh)");
    loopManoObra = confirm("¿Desea cargar gastos de Mano de Obra? (Preparación de Impresión/Postprocesamiento)");
    if (loopElectricidad) {
        tiempo = validarImput("Indique en minutos el tiempo de impresión de " + nombre + ":", true);
        consumo = validarImput("Indique el consumo de energia por hora de la impresora en W", true);
        precioKW = validarImput("Indique el precio del kWh", true);
        console.log(nombre, "llevaria", tiempo, "minutos; la impresora consume", consumo, " W por hora; el precio del kwh es de $", precioKW)
    }
    if (loopManoObra) {
        tiempoManoObra = validarImput("Indique el tiempo en minutos que lleva la preparación de la impresión de" + nombre + ":", true);
        costeManoObra = validarImput("Indique el valor de su tiempo por hora", true);
        tiempoPost = validarImput("Indique el tiempo en minutos que lleva el postprocesamiento de la impresión de" + nombre + ":", true);
        costePost = validarImput("Indique el valor de su tiempo por hora", true);
        console.log(nombre, "lleva", tiempoManoObra, "minutos de preparación y este se cobra $", costeManoObra, " la hora; lleva ", tiempoPost, "minutos de postprocesamiento y este se cobra $", costePost, " por hora")
        }
    let precioBase = calculoBase(peso, bobinaPrecio, bobinaPeso);
    console.log("Precio base ", precioBase);
        if (loopElectricidad) {
            precioExtraElec = calculoElectricidad(tiempo, consumo, precioKW);
        }
        console.log("Precio Gastos Electricos ", precioExtraElec);
        if (loopManoObra) {
            precioExtraMano = calculoManoObra(tiempoManoObra, costeManoObra, tiempoPost, costePost);
        }
    console.log("Precio Gastos Mano de Obra ", precioExtraMano);
    agregarTrabajos(precioBase, precioExtraElec, precioExtraMano);
    loop = confirm("¿Desea agregar más trabajos?");
}
console.log("Precio Total:", totalCosto());
alert("El costo total es de $" + totalCosto());
}

aplicacion();