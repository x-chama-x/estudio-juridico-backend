import express from 'express';
import cors from 'cors';
import { notFound,errorHandler } from './middleware/errorHandler';

const app = express(); // instancia de la aplicación Express

app.use(cors())
app.use(express.json());

app.get('/api/salud', (_req, res) =>{
    res.json({status: 'ok'})
}) // ruta que verifica el estado del servidor

//  registrar el manejo de errores de la app de express

app.use(notFound)
app.use(errorHandler)

export default app // exporto la configuración del servidor