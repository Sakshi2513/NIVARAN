import bcrypt from 'bcryptjs'
import { Document, model, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'Citizen' | 'Officer' | 'DepartmentHead' | 'SuperAdmin'
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Citizen', 'Officer', 'DepartmentHead', 'SuperAdmin'],
    default: 'Citizen'
  }
}, { timestamps: true })

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User: Model<IUser> = model<IUser>('User', UserSchema)
export default User
