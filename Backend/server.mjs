import { dbClient, testConnection} from './db.mjs'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());              // Habilita CORS para todas las rutas
app.use(express.json());      // Parsear JSON

// Rutas
testConnection();

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

