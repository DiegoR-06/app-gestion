import { compare } from 'bcrypt'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  checkToken,
  createToken,
  deleteToken,
  getUserPassword,
  testConnection
} from './db.mjs'

dotenv.config()
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

testConnection()

app.get('/', async (req, res) => {
  const token = req.signedCookies.cookieWithToken
  const username = req.signedCookies.username

  if (token && username) {
    const validToken = await checkToken(username, token)
    if (validToken.valid) {
      return res.sendFile(path.join(dirname, '../frontend/index.html'))
    }
  }
  return res.redirect('/login')
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(dirname, '../frontend/login.html'))
})

app.get('/styles/:file', (req, res) => {
  res.sendFile(path.join(dirname, '../frontend/styles', req.params.file))
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const result = await getUserPassword(username)

  const resultsMatch = await compare(password, result[0].password)
  if (!resultsMatch) {
    return res.status(401).send('Credenciales Inválidas')
  }

  const { token } = await createToken(username)
  res.cookie('cookieWithToken', token, {
    signed: true,
    httpOnly: true,
    expires: new Date(Date.now() + 360000)
  })
  res.cookie('username', username, {
    signed: true,
    httpOnly: true,
    expires: new Date(Date.now() + 360000)
  })

  return res.redirect('/')
})

app.post('/logout', (req, res) => {
  res.clearCookie('cookieWithToken')
  res.clearCookie('username')

  const wasDeleted = deleteToken(req.signedCookies.cookieWithToken)
  if (wasDeleted) {
    res.redirect('/login')
  } else {
    res.status(500).send('Error al eliminar el token')
  }
})

app.use(express.static(path.join(dirname, '../frontend')))

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}/login`)
})
