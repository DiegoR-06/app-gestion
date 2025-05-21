import {
  testConnection,
  getUserPassword,
  checkToken,
  createToken,
  deleteToken
} from './db.mjs'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { compare } from 'bcrypt'
import cookieParser from 'cookie-parser'

dotenv.config()
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

testConnection()

app.use(express.static(path.join(dirname, '../frontend')))

app.get('/login', (req, res) => {
  res.sendFile(path.join(dirname, '../frontend/login.html'))
})
app.get('/styles/:file', (req, res) => {
  res.sendFile(path.join(dirname, '../frontend/styles', req.params.file))
})
app.get('/', (req, res) => {
  if (req.signedCookies.cookieWithToken) {
    const validToken = checkToken(
      req.signedCookies.username,
      req.signedCookies.cookieWithToken
    )
    if (validToken.valid) {
      res.sendFile(path.join(dirname, '../frontend/index.html'))
    }
  } else {
    res.sendFile(path.join(dirname, '../frontend/login.html'))
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const result = await getUserPassword(username)
  const resultsMatch = await compare(password, result[0].password)
  if (!resultsMatch) {
    res.status(401).send('Credenciales Inválidas')
  }
  if (resultsMatch) {
    if (req.signedCookies.cookieWithToken) {
      const validToken = await checkToken(
        username,
        req.signedCookies.cookieWithToken
      )
      if (validToken.valid) {
        return res.redirect('/')
      }
      res.redirect('/')
    } else {
      const { token } = await createToken(username)
      res.cookie('cookieWithToken', token, {
        signed: true,
        httpOnly: true,
        expires: new Date(Date.now() + 360000)
      })
      res.redirect('/')
    }
  }
})
app.post('/logout', (req, res) => {
  res.clearCookie('cookieWithToken')
  const wasDeleted = deleteToken(req.signedCookies.cookieWithToken)
  if (wasDeleted) {
    res.redirect('/login')
  } else {
    res.status(500).send('Error al eliminar el token')
  }
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}/login`)
})
