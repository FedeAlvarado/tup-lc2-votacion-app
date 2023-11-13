const tipoRecuento = 1;
var tipoEleccion = 0;
url = window.location.href;

//Identificamos si es una eleccion de tipo PASO o Generales
if(url.substring(url.lastIndexOf("/") + 1) == "paso.html"){
    tipoEleccion = 1;
}else if(url.substring(url.lastIndexOf("/") + 1) == "generales.html"){
    tipoEleccion = 2;
}

//Seleccionamos los elementos del DOM
const añoSelect = document.getElementById("añoSelect");
const cargoSelect = document.getElementById("cargoSelect");
const distritoSelect = document.getElementById("distritoSelect");
const hdSeccionProvincial = document.getElementById("hdSeccionProvincial");

//Funciones

const agregarOpciones =async (elemento, func) =>{
    const datos = await func;
    console.log(datos);
    datos.sort()
    datos.forEach((dato) => {
        const option = document.createElement("option");
        option.value = dato;
        option.text = dato;
        elemento.add(option);
    });

}

//Funcion para buscar los periodos
const buscarPeriodos = async () => {
    try {
        const res = await fetch(
            `https://resultados.mininterior.gob.ar/api/menu/periodos`
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Error al buscar los periodos");
        console.log(error);
    }
    
    }

//CARGAMOS LOS AÑOS AUTOMATICAMENTE    
agregarOpciones(añoSelect, buscarPeriodos())


const buscarDatos = async (periodoSelect) =>{
    if(periodoSelect && periodoSelect != "Año"){
        try {
            const res = await fetch(
                `https://resultados.mininterior.gob.ar/api/menu?año=${periodoSelect}`
            );
            const data = await res.json();
            return data;
        } catch (error) {
            console.log("Error al buscar los cargos");
            console.log(error);
        }
    }
}

//FUNCION QUE SE EJECUTA CUANDO SE CAMBIA EL AÑO

añoSelect.addEventListener("change",async () => {
    const datos = await buscarDatos(añoSelect.value);
    
    // Guardar los datos filtrados en una variable
    cargos = await filtrarCargos(datos);
    if(cargos)
        cambiarCargos(cargos);
    }    
)

//COMBO CARGOS ---------------------------------------------
var dataCargos
const filtrarCargos = async (datos) => {
    cargosFiltrados = []
    if(datos){
        datos.forEach((eleccion) => {
            if(eleccion.IdEleccion == tipoEleccion){
                eleccion.Cargos.forEach((cargo) => {
                    cargosFiltrados.push(cargo)
                })
            }
        });
        dataCargos = cargosFiltrados.sort()
        return dataCargos;
    }
}

const cambiarCargos = async (cargos) => {
    cargos.forEach((cargo) => {
        const option = document.createElement("option");
        option.value = cargo.IdCargo;
        option.text = cargo.Cargo;
        cargoSelect.add(option);
    });
}

//FUNCION QUE SE EJECUTA CUANDO SE CAMBIA EL CARGO
var cargoSeleccionado

cargoSelect.addEventListener("change", async () => {
    const cargoId = cargoSelect.value;
    console.log(dataCargos)
    
    cargoSeleccionado = dataCargos.find((cargo) => {
        if(cargo.IdCargo == cargoId){
            return cargo
        }
    })
    console.log(cargoSeleccionado)
    cambiarDistritos(cargoSeleccionado.Distritos)
    
})


// COMBO DISTRITO --------------------------------------------


const cambiarDistritos = async (distritos) => {
    distritoSelect.innerHTML = "Seleccione un distrito"; // Eliminamos todos los option anteriores
    distritos.forEach((distrito) => {
        const option = document.createElement("option");
        option.value = distrito.IdDistrito;
        option.text = distrito.Distrito;
        distritoSelect.add(option);
    });
}

//FUNCION QUE SE EJECUTA CUANDO SE CAMBIA EL DISTRITO
var distritoSeleccionado

distritoSelect.addEventListener("change", async () => {
    const distritoId = distritoSelect.value;
    seccionSelect.innerHTML = "";
    buscarSecciones();
    distritoSeleccionado = cargoSeleccionado.Distritos.find((distrito) => {
        if(distrito.IdDistrito == distritoId){
            return distrito
        }
    })
    
    console.log(distritoSeleccionado)
    
})


// COMBO SECCION --------------------------------------------


const buscarSecciones = async () => {
    seccionSelect.innerHTML = "";
    const cargo = dataCargos.find((c) => {
        if(c.IdCargo == cargoSelect.value){
            return c
        }
    })
    const distrito = cargo.Distritos.find((d) => {
        if(d.IdDistrito == distritoSelect.value){
            return d
        }
    })
    distrito.SeccionesProvinciales.forEach((seccion) => {
        hdSeccionProvincial.value = seccion.IDSeccionProvincial;
        seccion.Secciones.forEach((seccion) => {
            const option = document.createElement("option");
            option.value = seccion.IdSeccion;
            option.text = seccion.Seccion;
            seccionSelect.add(option);
        });
    });

    
}
// ...

