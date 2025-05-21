import { createClient } from '@libsql/client'
import { config } from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'

config()
process.loadEnvFile()
const url = process.env.TURSO_DB_URL
const authToken = process.env.TURSO_AUTH_TOKEN

export const dbClient = createClient({ url, authToken })

export async function getUserPassword (username) {
  const result = await dbClient.execute({
    sql: 'SELECT username, password FROM usuarios WHERE username = ?',
    args: [username]
  })
  return result.rows
}

export async function createToken (username) {
  const token = jsonwebtoken.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' })
  await dbClient.execute({
    sql: 'UPDATE usuarios SET token = ? WHERE username = ?',
    args: [token, username]
  })
  return {
    valid: true,
    token
  }
}

export async function checkToken (username, token) {
  const result = await dbClient.execute({
    sql: 'SELECT token FROM usuarios WHERE username = ? AND token = ?',
    args: [username, token]
  })
  if (result.rows.length > 0) {
    return {
      valid: true,
      token: result.rows[0].token
    }
  }
  return await createToken(username)
}

export async function deleteToken (token) {
  const result = await dbClient.execute({
    sql: 'UPDATE usuarios SET token = NULL WHERE token = ?',
    args: [token]
  })
  if (result.rows.length > 0) {
    return true
  } else {
    return false
  }
}

export async function testConnection () {
  try {
    await dbClient.execute({ sql: 'SELECT 1;' })
    console.log('¡Conexión a la base de datos Turso establecida exitosamente!')
  } catch (error) {
    console.error('Error al conectar con la base de datos Turso:', error)
  }
}
