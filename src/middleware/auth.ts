import { Request, Response, NextFunction } from 'express'
import { verificarToken, Rol, TokenPayload } from '../services/authService'
import { AppError } from '../utils/AppError'

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    throw new AppError(401, 'No autorizado')
  }

  try {
    req.user = verificarToken(token)
  } catch {
    throw new AppError(401, 'Token inválido o vencido')
  }

  next()
}

export function requireRol(...roles: Rol[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      throw new AppError(403, 'No tenés permiso para esta acción')
    }
    next()
  }
}