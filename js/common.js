const tipoRecuento = 1;
var tipoEleccion = 0;
url = window.location.href;

if(url.substring(url.lastIndexOf("/") + 1) == "paso.html"){
    tipoEleccion = 1;
}else if(url.substring(url.lastIndexOf("/") + 1) == "generales.html"){
    tipoEleccion = 2;
}


const añoSelect = document.getElementById("añoSelect");



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


const agregarOpcionesAñoSelect = async () => {
    const periodos = await buscarPeriodos();
    console.log(periodos);
    periodos.sort();
    periodos.forEach((periodo) => {
        const option = document.createElement("option");
        option.value = periodo;
        option.text = periodo;
        añoSelect.add(option);
    });
};

agregarOpcionesAñoSelect();

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

const filtrarCargos = async (datos) => {
    datos.filter((eleccion) => {
        if(eleccion.IdEleccion == tipoEleccion){
            console.log(eleccion)
            cargosFiltrados= eleccion.Cargos.forEach((cargo) => {
                console.log(cargo)
                return {
                    IdCargo: cargo.IdCargo,
                    Cargo: cargo.Cargo
                };
            })
        }
    });
    return cargosFiltrados;
}


const obtenerCargos = async () => {
    const datos = await buscarDatos(añoSelect.value);
    
    // Guardar los datos en una variable
    cargosFiltrados = await filtrarCargos(datos);
    console.log(cargosFiltrados);
    };
    
añoSelect.addEventListener("change", () => {
    obtenerCargos();
    }
)