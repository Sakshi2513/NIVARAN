import { Router } from 'express'
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  escalateComplaint
} from '../controllers/complaintController'
import { authorize, protect } from '../middleware/auth'

const router = Router()

router.use(protect)
router.post('/', authorize(['Citizen', 'Officer', 'DepartmentHead', 'SuperAdmin']), createComplaint)
router.get('/', authorize(['Citizen', 'Officer', 'DepartmentHead', 'SuperAdmin']), getComplaints)
router.get('/:id', authorize(['Citizen', 'Officer', 'DepartmentHead', 'SuperAdmin']), getComplaintById)
router.patch('/:id', authorize(['Officer', 'DepartmentHead', 'SuperAdmin']), updateComplaint)
router.post('/:id/escalate', authorize(['Officer', 'DepartmentHead', 'SuperAdmin']), escalateComplaint)

export default router
