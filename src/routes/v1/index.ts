import express from 'express'
const router = express.Router()
import issuerRoutes from './issuer.route'
import projectRoutes from './project.route'
import premadeTemplateRoutes from "./premadeTemplate.route"
import modifiedTemplateRoutes from "./modifiedTemplate.route"
import certificationRoutes from "./certification.route"
<<<<<<< HEAD
import imageRoutes from "./imageRoutes.route"
=======

>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73


router.use('/issuer', issuerRoutes);

router.use('/project', projectRoutes);

router.use('/premadeTemplate', premadeTemplateRoutes);

router.use('/modifiedTemplate', modifiedTemplateRoutes);

router.use('/certification', certificationRoutes);


router.use('/premadeTemplate', authMiddleware, premadeTemplateRoutes);

router.use('/modifiedTemplate', authMiddleware, modifiedTemplateRoutes);

router.use('/certificate', authMiddleware, certificationRoutes);

router.use('/image', authMiddleware, imageRoutes);


export default router
