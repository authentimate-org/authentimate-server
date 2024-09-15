import express from 'express'
const router = express.Router()
import issuerRoutes from './issuer.route'
import projectRoutes from './project.route'
import issuerImageRoutes from './issuerImage.route'
import premadeTemplateRoutes from "./premadeTemplate.route"
import modifiedTemplateRoutes from "./modifiedTemplate.route"
import certificationRoutes from "./certification.route"



router.use('/issuer', issuerRoutes);

router.use('/project', projectRoutes);

router.use('/image', issuerImageRoutes);

router.use('/premadeTemplate', premadeTemplateRoutes);

router.use('/modifiedTemplate', modifiedTemplateRoutes);

router.use('/certification', certificationRoutes);



export default router
