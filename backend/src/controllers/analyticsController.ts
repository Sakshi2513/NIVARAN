import { Request, Response } from 'express'
import Complaint from '../models/Complaint'

export async function getOverview(_req: Request, res: Response) {
  const total = await Complaint.countDocuments()
  const pending = await Complaint.countDocuments({ status: { $in: ['Submitted', 'Under Review', 'Assigned', 'In Progress'] } })
  const resolved = await Complaint.countDocuments({ status: 'Resolved' })
  const escalated = await Complaint.countDocuments({ status: 'Escalated' })

  res.json({ total, pending, resolved, escalated })
}

export async function getLocationAnalytics(_req: Request, res: Response) {
  const byCity = await Complaint.aggregate([
    { $group: { _id: '$city', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ])

  const byCategory = await Complaint.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])

  res.json({ byCity, byCategory })
}

export async function getHighRiskZones(_req: Request, res: Response) {
  const zones = await Complaint.aggregate([
    {
      $group: {
        _id: { city: '$city', ward: '$ward' },
        count: { $sum: 1 },
        avgSeverity: { $avg: '$severityScore' },
        topCategory: { $first: '$category' }
      }
    },
    { $sort: { avgSeverity: -1, count: -1 } },
    { $limit: 5 }
  ])

  const formatted = zones.map((zone) => ({
    area: `${zone._id.city} - Ward ${zone._id.ward}`,
    complaintCount: zone.count,
    severity: Number(zone.avgSeverity.toFixed(1)),
    mostCommonCategory: zone.topCategory
  }))

  res.json(formatted)
}
