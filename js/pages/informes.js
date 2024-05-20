document.addEventListener("DOMContentLoaded", () => {
    const key = "INFORMES";
    const registrosExistentes = existenRegistros(key);
    const secMessages = document.getElementById("sec-messages");

    if (registrosExistentes) {
        console.log("¡Hay registros en localStorage!");
        // Mostrar mensaje verde y ocultar los demás
        mostrarMensaje(secMessages, "green");
        
        // Obtener informes desde localStorage y procesarlos
        const informes = obtenerInformesDesdeLocalStorage(key);
        generarTablaInformes(informes);
    } else {
        console.log("No hay registros en localStorage.");
        // Mostrar mensaje amarillo y ocultar los demás
        mostrarMensaje(secMessages, "yellow");
    }
});

// Función para mostrar mensajes de diferentes tipos
function mostrarMensaje(secMessages, tipo) {
    // Ocultar todos los mensajes
    const messages = secMessages.querySelectorAll(".message");
    messages.forEach(message => {
        message.style.display = "none";
    });

    // Mostrar el mensaje del tipo especificado
    const mensajeMostrar = secMessages.querySelector(`.${tipo}.message`);
    if (mensajeMostrar) {
        mensajeMostrar.style.display = "block";
    }
}

// Función para verificar si existen registros en localStorage
const existenRegistros = (key) => {
    const storedData = localStorage.getItem(key);
    return storedData !== null && storedData !== "[]";
};

// Función para obtener los informes desde localStorage
function obtenerInformesDesdeLocalStorage(key) {
    const storedData = localStorage.getItem(key);
    if (!storedData) {
        console.error("No se encontraron datos en localStorage bajo la clave:", key);
        return [];
    }

    try {
        const informes = JSON.parse(storedData);
        if (!Array.isArray(informes)) {
            console.error("Los datos almacenados en localStorage no son un arreglo:", storedData);
            return [];
        }

        // Validar cada informe antes de devolverlos
        const informesValidos = informes.filter(informe => validarInforme(informe));
        return informesValidos;
    } catch (error) {
        console.error("Error al parsear los datos del localStorage:", error);
        return [];
    }
}

// Función para validar un informe
function validarInforme(informe) {
    // Validar que el informe tenga la estructura adecuada
    return Array.isArray(informe) && informe.length >= 13;
}

// Función para generar la tabla de informes
function generarTablaInformes(informes) {
    const provincias = {
        "1": "Buenos Aires",
        "2": "Córdoba",
        "3": "Santa Fe",
        // Agregar todas las provincias necesarias
    };

    const informesTableBody = document.querySelector("#informes-table tbody");
    informesTableBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

    informes.forEach(informe => {
        if (!validarInforme(informe)) return;

        const [anio, tipoRecuento, tipoEleccion, categoriaId, distritoId, seccionProvincialId, seccionId, mesasEscrutadas, participacion, cantidadElectores, nombreAgrupaciones, votosAgrupaciones, porcentajesAgrupaciones] = informe;

        const provincia = provincias[distritoId] || "Desconocida";
        const titulo = `Elecciones ${anio} | ${tipoEleccion}`;
        const subtitulo = `${anio} > ${tipoEleccion} > ${categoriaId} > ${provincia} > ${seccionId}`;
        const datosPorAgrupacion = nombreAgrupaciones.map((nombre, index) => {
            return `${nombre} ${porcentajesAgrupaciones[index]}% ${votosAgrupaciones[index]} Votos`;
        }).join("<br>");

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${titulo}</td>
            <td>${subtitulo}</td>
            <td>${mesasEscrutadas}</td>
            <td>${cantidadElectores}</td>
            <td>${participacion}</td>
            <td>${datosPorAgrupacion}</td>
        `;

        informesTableBody.appendChild(row);
    });
}

// Función para formar la URL a partir de los datos del informe
function formarURL(informe) {
    const [anio, tipoRecuento, tipoEleccion, categoriaId, distritoId, seccionProvincialId, seccionId] = informe;
    const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anio}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=&mesaId=`;
    return url;
}