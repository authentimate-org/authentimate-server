import express from 'express'
const router = express.Router()
import { handleCreateCertification, handleGetCertificationById } from '../../controllers/certification.controller'



router
.route('/create')
.post(handleCreateCertification);

router
.route('/read')
.post(handleGetCertificationById);



export default router;