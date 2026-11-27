import authRoutes from './routes/authRoutes'
import clientesRoutes from './routes/clientesRoutes'
import express from 'express';
import cors from 'cors';
import { notFound,errorHandler } from './middleware/errorHandler';
import expedienteRoutes from './routes/expedientesRoutes';
import usuariosRoutes from './routes/usuariosRoutes'

const app = express(); // instancia de la aplicación Express

app.use(cors())
app.use(express.json());

app.get('/api/salud', (_req, res) =>{
    res.json({status: 'ok'})
}) // ruta que verifica el estado del servidor


// Registro las rutas de autenticación
app.use('/api/auth', authRoutes) 

// Registro las rutas de clientes
app.use('/api/clientes', clientesRoutes)

// Registro las rutas de expedientes
app.use('/api/expedientes', expedienteRoutes)

// Registro las rutas de usuarios
app.use('/api/usuarios', usuariosRoutes)


//  registrar el manejo de errores de la app de express

app.use(notFound)
app.use(errorHandler)

export default app // exporto la configuración del servidor