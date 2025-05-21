// Importar dependencias
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors()) // Habilita CORS para todas las rutas
app.use(express.json()) // Parsear JSON

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando con CORS 🚀')
})

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
