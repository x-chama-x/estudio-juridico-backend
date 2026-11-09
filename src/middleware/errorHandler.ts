import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import logger from '../config/logger'

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, `No existe la ruta ${req.method} ${req.originalUrl}`))
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  logger.error(`Error inesperado en ${req.method} ${req.originalUrl}`, err)
  res.status(500).json({ error: 'Error interno del servidor' })
}