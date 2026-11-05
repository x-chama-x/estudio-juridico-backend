import express from 'express';
import cors from 'cors';
import { notFound,errorHandler } from './middleware/errorHandler';

const app = express(); // instancia de la aplicación Express

app.use(cors())
app.use(express.json());

app.get('/api/salud', (_req, res) =>{
    res.json({status: 'ok'})
}) // ruta que verifica el estado del servidor

// Ruta temporal para probar el manejo de errores
app.get('/api/prueba-error', () => {
  throw new Error('Error de prueba')
})

app.use(notFound)
app.use(errorHandler)

export default app // exporto la configuración del servidor