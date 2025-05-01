// FECHA POR DEFECTO LA DE HOY
const hoy = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD
document.getElementById("fecha").value = hoy;
