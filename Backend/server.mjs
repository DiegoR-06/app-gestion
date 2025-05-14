import { testConnection, getUserPassword } from './db.mjs'
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

/**
 * Esto sirve los archivos de la carpeta frontend para que sean accesibles (public) por lo que
 * hay que tener cuidado con que se mete en esa carpeta ya que lo vuelve accesible. Revisar al acabar
 * el proyecto
*/
app.use(express.static(path.join(dirname, '../frontend')))

app.get('/login', (req, res) => {
  res.sendFile(path.join(dirname, '../frontend/login.html'))
})
app.get('/', (req, res) => {
  res.sendFile(path.join(dirname, '../frontend/login.html'))
})
/*
 * Hay que comprobar primero si el usuario tiene un token activo, si lo tiene que salte el formulario,
 * si no lo tiene, comprobar si las credenciales existen en la base de datos, si existen crear un token
 * y guardarlo en base de datos
 * Para esto hay que crear los tokens con JWT y mandarlo al cliente cuando inicie sesion y guardarlo
 * tambien en la base de datos, despues ya simplemente comprobar
 */

app.post('/login', async (req, res) => {
  // Aquí comprobaríamos primero si hay un token, si lo hay redirigimos al login
  const { username, password } = req.body
  const result = await getUserPassword(username, password)
  console.log(result)
  if (result.length > 0) {
    res.redirect('/')
  } else {
    res.status(401).send('Credenciales Inválidas')
  }
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
