import express from 'express'
const router = express.Router()
import authMiddleware from '../../middleware/auth.middleware'
import issuerRoutes from './issuer.route'
import projectRoutes from './project.route'
import premadeTemplateRoutes from "./premadeTemplate.route"
import modifiedTemplateRoutes from "./modifiedTemplate.route"
import certificationRoutes from "./certification.route"



router.use('/issuer', issuerRoutes);

router.use('/project', projectRoutes);

router.use('/premadeTemplate', premadeTemplateRoutes);

router.use('/modifiedTemplate', modifiedTemplateRoutes);

router.use('/certificate', certificationRoutes);



export default router
