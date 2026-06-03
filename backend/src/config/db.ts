import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nivaran'

export async function connectDatabase(): Promise<void> {
  try {
    console.log('Attempting to connect to MongoDB...')
    console.log(`Connection string: ${MONGODB_URI.replace(/:[^:]*@/, ':***@')}`)
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    })
    
    console.log('✅ Successfully connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    console.warn('⚠️  Database connection failed. Please check:')
    console.warn('   1. MongoDB is running (local: mongod command)')
    console.warn('   2. Connection string is correct in backend/.env')
    console.warn('   3. For MongoDB Atlas: Check IP whitelist (Security → Network Access)')
    console.warn('   4. See MONGODB_SETUP.md for quick setup guide')
    console.warn('\nContinuing startup without database connection.')
    console.warn('Registration and login will fail until MongoDB is available.\n')
  }
}
