import { Document, model, Schema } from 'mongoose'

export interface INotification extends Document {
  userId: Schema.Types.ObjectId
  message: string
  read: boolean
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true })

const Notification = model<INotification>('Notification', NotificationSchema)
export default Notification
