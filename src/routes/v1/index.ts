import express from 'express'
const router = express.Router()
import authMiddleware from '../../middleware/auth.middleware'
import issuerRoutes from './issuer.route'
import projectRoutes from './project.route'



router.use('/issuer', issuerRoutes);
// router.use('/project', projectRoutes);

router.use('/project', authMiddleware, projectRoutes);


export default router
