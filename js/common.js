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

const defaultOption = document.createElement("option");
    defaultOption.value = false;
    defaultOption.text = "Seleccione un cargo";

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

añoSelect.addEventListener("click",async () => {
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
    cargoSelect.innerHTML = ""; // Eliminamos todos los option anteriores
    
    cargoSelect.add(defaultOption);
    cargos.forEach((cargo) => {
        const option = document.createElement("option");
        option.value = cargo.IdCargo;
        option.text = cargo.Cargo;
        cargoSelect.add(option);
    });
}

//FUNCION QUE SE EJECUTA CUANDO SE CAMBIA EL CARGO
var cargoSeleccionado

cargoSelect.addEventListener("click", async () => {
    const cargoId = cargoSelect.value;
    console.log(cargoId)
    if(cargoSelect.value >= 0){
        cargoSeleccionado = dataCargos.find((cargo) => {
            if(cargo.IdCargo == cargoId){
                return cargo
            }
        })
        console.log(cargoSeleccionado)
        
        cambiarDistritos(cargoSeleccionado.Distritos)
    }else{
        cambiarDistritos(false)
    }
})



// COMBO DISTRITO --------------------------------------------


const cambiarDistritos = async (distritos) => {
    distritoSelect.innerHTML = "Seleccione un distrito"; // Eliminamos todos los option anteriores
    if(distritos){
        distritos.forEach((distrito) => {
            const option = document.createElement("option");
            option.value = distrito.IdDistrito;
            option.text = distrito.Distrito;
            distritoSelect.add(option);
        });
    }else{
        distritoSelect.add(defaultOption); // Agregamos el option por defecto
    }
    
}

//FUNCION QUE SE EJECUTA CUANDO SE CAMBIA EL DISTRITO
var distritoSeleccionado

distritoSelect.addEventListener("click", async () => {
    const distritoId = distritoSelect.value;
    seccionSelect.innerHTML = "Seleccione una sección";
    if(distritoId >= 0){
        distritoSeleccionado = cargoSeleccionado.Distritos.find((distrito) => {
            if(distrito.IdDistrito == distritoId){
                return distrito
            }
        })
    }
    buscarSecciones();
    
    
    console.log(distritoSeleccionado)
    
})


// COMBO SECCION --------------------------------------------


const buscarSecciones = async () => {
    seccionSelect.innerHTML = "Seleccione una sección";
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
    if(distrito && cargo){
        if(distrito.SeccionesProvinciales[0].Secciones[0].IdSeccion !== null){
            distrito.SeccionesProvinciales.forEach((seccion) => {
                hdSeccionProvincial.value = seccion.IDSeccionProvincial;
                seccion.Secciones.forEach((seccion) => {
                    const option = document.createElement("option");
                    option.value = seccion.IdSeccion;
                    option.text = seccion.Seccion;
                    seccionSelect.add(option);
                });
            });
        }else{
            console.log("HOLA")
            seccionSelect.add(defaultOption);
        }
    }
}
// ...


// VALIDATION FUNCTION
const validateFields = () => {
    let isValid = true;
    const fields = [
        { element: añoSelect, name: "Año" },
        { element: cargoSelect, name: "Cargo" },
        { element: distritoSelect, name: "Distrito" },
        { element: seccionSelect, name: "Sección" },
    ];

    fields.forEach((field) => {
        if (!field.element.value || field.element.value === "Seleccione un distrito" || field.element.value === "Seleccione una sección" || field.element.value === "Seleccione un cargo" || field.element.value === "Año") {
            isValid = false;
            field.element.style.borderColor = "yellow";
            const message = document.createElement("p");
            message.style.color = "yellow";
            message.textContent = `Por favor seleccione un ${field.name}`;
            field.element.parentNode.insertBefore(message, field.element.nextSibling);
        } else {
            field.element.style.borderColor = "";
            const message = field.element.nextSibling;
            if (message) {
                message.remove();
            }
        }
    });

    return isValid;
};

// FILTER FUNCTION
const filtrar = async () => {
    try {
        if (!validateFields()) {
            return;
        }
        console.log(cargoSelect.value)
        const anioEleccion = añoSelect.value;
        const categoriaId = cargoSelect.value;
        const distritoId = distritoSelect.value;
        const seccionProvincialId = hdSeccionProvincial.value;
        const seccionId = seccionSelect.value;
        const circuitoId = "";
        const mesaId = "";

        const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        // process data...
    } catch (error) {
        console.error(error);
    }
};

// ...
