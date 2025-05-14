// FECHA POR DEFECTO LA DE HOY
const hoy = new Date().toISOString().split("T")[0];
document.getElementById("fecha").value = hoy;

// REFERENCIAS
let fecha = document.getElementById("fecha-h3");
let fechaCalendario = document.getElementById("fecha");
const btnAtrasar = document.getElementById("btn-atrasar");
const btnAdelantar = document.getElementById("btn-adelantar");

// FUNCIÓN PARA ACTUALIZAR EL H3 CON FORMATO DD-MM-YYYY
function actualizarFechaH3(fechaValor) {
    const partes = fechaValor.split("-");
    const fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`;
    fecha.innerHTML = fechaFormateada;
}

// EVENTO CAMBIO EN EL CALENDARIO
fechaCalendario.addEventListener("change", function () {
    actualizarFechaH3(fechaCalendario.value);
});

// FUNCIONES PARA ADELANTAR / ATRASAR UN DÍA
function cambiarDia(dias) {
    let fechaActual = new Date(fechaCalendario.value);
    fechaActual.setDate(fechaActual.getDate() + dias);

    const nuevaFecha = fechaActual.toISOString().split("T")[0];
    fechaCalendario.value = nuevaFecha;
    actualizarFechaH3(nuevaFecha);
}

btnAtrasar.addEventListener("click", function () {
    cambiarDia(-1);
});

btnAdelantar.addEventListener("click", function () {
    cambiarDia(1);
});
