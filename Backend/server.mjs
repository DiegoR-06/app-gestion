import { testConnection } from './db.mjs'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

testConnection()

// Ruta de login (sin aplicar checkAuth)
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(dirname, '../frontend/login.html'))
})

app.use(express.static(path.join(dirname, '../frontend')))

// Ruta principal (sin restricción)
app.get('/', (req, res) => {
  res.sendFile(path.join(dirname, '../frontend/index.html'))
})

// Ruta para manejar el login
app.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username === 'diego' && password === '1234') {
    return res.json({ message: 'Login exitoso' })
  } else {
    return res.status(401).json({ message: 'Credenciales incorrectas' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
