import jwt from 'jsonwebtoken'

export type Rol = 'abogado' | 'asistente'

export interface TokenPayload {
  userId: string
  rol: Rol
}

export function generarToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '8h' })
}

export function verificarToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
}