import express from 'express';
import cors from 'cors';

const app = express(); // instancia de la aplicación Express

app.use(cors())
app.use(express.json());

app.get('/api/salud', (_req, res) =>{
    res.json({status: 'ok'})
}) // ruta que verifica el estado del servidor

export default app // exporto la configuración del servidor