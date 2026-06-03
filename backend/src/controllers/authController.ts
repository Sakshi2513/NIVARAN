import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt'
const JWT_EXPIRES_IN = '7d'

function signToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const user = await User.create({ name, email, password, role: role || 'Citizen' })
    const token = signToken(user.id, user.role)

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Check if it's a database connection error
    if (error.name === 'MongooseError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json({ 
        message: 'Database connection failed. Please try again later.',
        details: 'MongoDB is not available. See MONGODB_SETUP.md for setup instructions.'
      })
    }
    
    res.status(500).json({ message: 'Registration failed' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user.id, user.role)
    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    })
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.name === 'MongooseError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json({ 
        message: 'Database connection failed. Please try again later.',
        details: 'MongoDB is not available. See MONGODB_SETUP.md for setup instructions.'
      })
    }
    
    res.status(500).json({ message: 'Login failed' })
  }
}
