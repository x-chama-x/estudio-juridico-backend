import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import logger from '../config/logger'
import { Error as MongooseError } from 'mongoose'

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, `No existe la ruta ${req.method} ${req.originalUrl}`))
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  if (err instanceof MongooseError.ValidationError) {
    const mensajes = Object.values(err.errors).map((e) => e.message)
    res.status(400).json({ error: mensajes.join('. ') })
    return
  }

  if (err.name === 'CastError') {
    res.status(400).json({ error: 'ID inválido' })
    return
  }

  if ((err as { code?: number }).code === 11000) {
    const campo = Object.keys((err as { keyValue?: object }).keyValue ?? {})[0]
    const nombres: Record<string, string> = {
      dni: 'DNI',
      cuit: 'CUIT',
      email: 'email',
      'datosJudiciales.jurisdiccion': 'número de expediente',
    }
    const nombre = nombres[campo] ?? 'dato'
    res.status(409).json({ error: `Ya existe un registro con ese ${nombre}` })
    return
  }

  logger.error(`Error inesperado en ${req.method} ${req.originalUrl}`, err)
  res.status(500).json({ error: 'Error interno del servidor' })
}