import { Document, model, Schema } from 'mongoose'

export interface IComplaint extends Document {
  complaintId: string
  title: string
  description: string
  category: string
  severityScore: number
  severityLevel: string
  keywords: string[]
  status: string
  city: string
  ward: string
  state: string
  latitude: number
  longitude: number
  citizenId: Schema.Types.ObjectId
  assignedOfficer?: Schema.Types.ObjectId
  department: string
  duplicateOf?: string
  autoEscalated: boolean
}

const ComplaintSchema = new Schema<IComplaint>({
  complaintId: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  severityScore: { type: Number, required: true, default: 0 },
  severityLevel: { type: String, required: true, default: 'Low' },
  keywords: { type: [String], default: [] },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Escalated', 'Resolved', 'Rejected'],
    default: 'Submitted'
  },
  city: { type: String, required: true },
  ward: { type: String, required: true },
  state: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  citizenId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedOfficer: { type: Schema.Types.ObjectId, ref: 'User' },
  department: { type: String, required: true },
  duplicateOf: { type: String },
  autoEscalated: { type: Boolean, default: false }
}, { timestamps: true })

const Complaint = model<IComplaint>('Complaint', ComplaintSchema)
export default Complaint
