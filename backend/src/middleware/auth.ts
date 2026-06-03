import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

interface JwtPayload {
  userId: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt'

export async function protect(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.user = decoded
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized user' })
    }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}
