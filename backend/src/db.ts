import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://mongo:27017/nivaran'

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}
