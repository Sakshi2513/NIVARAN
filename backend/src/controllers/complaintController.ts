import { Request, Response } from 'express'
import Complaint from '../models/Complaint'
import User from '../models/User'
import { emitToRole, emitToUser } from '../socket'

const CATEGORY_DEPARTMENT_MAP: Record<string, string> = {
  Roads: 'Public Works',
  Water: 'Water Management',
  Electricity: 'Power Department',
  Garbage: 'Sanitation',
  Drainage: 'Public Works',
  Corruption: 'Anti Corruption',
  'Street Lights': 'Public Works',
  'Women Safety': 'Public Safety',
  Pollution: 'Environment',
  Transport: 'Transport',
  Health: 'Health',
  Education: 'Education',
  Other: 'General Services'
}

const ANALYSIS_ENDPOINT = process.env.NLP_SERVICE_URL || 'http://localhost:8000'

function buildComplaintId() {
  return `CPT-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

export async function createComplaint(req: Request, res: Response) {
  const {
    title,
    description,
    location // This comes from frontend { lat, lng, address }
  } = req.body

  // Extract from location or provide fallbacks if missing (for tests)
  const latitude = location?.lat || req.body.latitude || 28.6139;
  const longitude = location?.lng || req.body.longitude || 77.2090;
  const city = location?.address?.split(',')[0] || req.body.city || 'New Delhi';
  const state = location?.address?.split(',')[1]?.trim() || req.body.state || 'Delhi';
  const ward = req.body.ward || 'Central';

  const userId = req.user?.userId
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const analysisResponse = await fetch(`${ANALYSIS_ENDPOINT}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
  })

  const analysis = await analysisResponse.json()
  const department = analysis.department || CATEGORY_DEPARTMENT_MAP[analysis.category] || 'General Services'
  const status = analysis.severityScore > 80 ? 'Escalated' : 'Submitted'
  const autoEscalated = analysis.severityScore > 80

  const complaint = await Complaint.create({
    complaintId: buildComplaintId(),
    title,
    description,
    category: analysis.category,
    severityScore: analysis.severityScore,
    severityLevel: analysis.severityLevel,
    keywords: analysis.keywords,
    status,
    city,
    ward,
    state,
    latitude,
    longitude,
    citizenId: userId,
    department,
    autoEscalated,
    duplicateOf: analysis.duplicate ? analysis.duplicateId : undefined
  })

  // Real-time Event Emissions
  emitToRole('officer_room', 'NEW_COMPLAINT', complaint)
  emitToRole('superadmin_room', 'NEW_COMPLAINT', complaint)

  if (autoEscalated) {
    emitToRole('officer_room', 'EMERGENCY_ALERT', { message: 'Critical severity complaint received', complaint })
    emitToRole('superadmin_room', 'EMERGENCY_ALERT', { message: 'Critical severity complaint received', complaint })
  }

  res.status(201).json(complaint)
}

export async function getComplaints(req: Request, res: Response) {
  const { role, userId } = req.user || {}
  const query: Record<string, unknown> = {}

  if (role === 'Citizen') {
    query.citizenId = userId
  }

  if (req.query.status) {
    query.status = req.query.status
  }

  if (req.query.category) {
    query.category = req.query.category
  }

  const complaints = await Complaint.find(query)
    .populate('citizenId', 'name email')
    .populate('assignedOfficer', 'name email')
    .sort({ createdAt: -1 })

  res.json(complaints)
}

export async function getComplaintById(req: Request, res: Response) {
  const { id } = req.params
  const complaint = await Complaint.findOne({ complaintId: id })
    .populate('citizenId', 'name email')
    .populate('assignedOfficer', 'name email')

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' })
  }

  res.json(complaint)
}

export async function updateComplaint(req: Request, res: Response) {
  const { id } = req.params
  const updates = req.body

  const complaint = await Complaint.findOneAndUpdate({ complaintId: id }, updates, {
    new: true,
    runValidators: true
  })

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' })
  }

  // Real-time Event Emissions
  emitToUser(complaint.citizenId.toString(), 'STATUS_UPDATED', complaint)
  emitToRole('superadmin_room', 'COMPLAINT_UPDATED', complaint)

  res.json(complaint)
}

export async function escalateComplaint(req: Request, res: Response) {
  const { id } = req.params
  const complaint = await Complaint.findOneAndUpdate(
    { complaintId: id },
    { status: 'Escalated', autoEscalated: true },
    { new: true }
  )

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' })
  }

  res.json(complaint)
}
