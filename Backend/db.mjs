import { createClient } from '@libsql/client'
import { config } from 'dotenv'

config()
process.loadEnvFile()
const url = process.env.TURSO_DB_URL
const authToken = process.env.TURSO_AUTH_TOKEN

export const dbClient = createClient({ url, authToken })

export async function getUserPassword (username, password) {
  const result = await dbClient.execute({
    sql: 'SELECT username, password FROM usuarios WHERE username = ? AND password = ?',
    args: [username, password]
  })
  return result.rows
}

export async function testConnection () {
  try {
    await dbClient.execute({ sql: 'SELECT 1;' })
    console.log('¡Conexión a la base de datos Turso establecida exitosamente!')
  } catch (error) {
    console.error('Error al conectar con la base de datos Turso:', error)
  }
}
