import express from 'express'
const router = express.Router()
import authMiddleware from '../../middleware/auth.middleware'
import issuerRoutes from './issuer.route'
import projectRoutes from './project.route'
import premadeTemplateRoutes from "./premadeTemplate.route"
import modifiedTemplateRoutes from "./modifiedTemplate.route"
import certificationRoutes from "./certification.route"
import imageRoutes from "./imageRoutes.route"


router.use('/issuer', issuerRoutes);

router.use('/project', authMiddleware, projectRoutes);

router.use('/premadeTemplate', authMiddleware, premadeTemplateRoutes);

router.use('/modifiedTemplate', authMiddleware, modifiedTemplateRoutes);

router.use('/certificate', authMiddleware, certificationRoutes);

router.use('/image', authMiddleware, imageRoutes);


export default router
