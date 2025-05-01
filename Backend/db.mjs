import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.TURSO_DB_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const dbClient = createClient({
  url: url,
  authToken: authToken,
});

export async function testConnection() {
	try {
	  await dbClient.execute({ sql: 'SELECT 1;' });
	  console.log('¡Conexión a la base de datos Turso establecida exitosamente!');
	} catch (error) {
	  console.error('Error al conectar con la base de datos Turso:', error);
	} finally {
	  await dbClient.close();
	}
 }
 