import { Router } from 'express'
import { getOverview, getLocationAnalytics, getHighRiskZones } from '../controllers/analyticsController'
import { authorize, protect } from '../middleware/auth'

const router = Router()

router.use(protect)
router.get('/overview', authorize(['Officer', 'DepartmentHead', 'SuperAdmin']), getOverview)
router.get('/location', authorize(['Officer', 'DepartmentHead', 'SuperAdmin']), getLocationAnalytics)
router.get('/high-risk-zones', authorize(['Officer', 'DepartmentHead', 'SuperAdmin']), getHighRiskZones)

export default router
