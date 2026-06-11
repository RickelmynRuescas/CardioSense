import { Request, Response, NextFunction } from 'express'
import { auth } from '../config/firebase'

export interface AuthRequest extends Request {
  userId?: string
}

export async function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' })
    return
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decoded = await auth.verifyIdToken(token)
    req.userId = decoded.uid
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}
