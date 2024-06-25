import express from 'express'
const router = express.Router()
import { handleCreateCertification, handleGetAllCertificationsByProjectId, handleGetCertificationById } from '../../controllers/certification.controller'



router
.route('/create')
.post(handleCreateCertification);

router
.route('/all')
.post(handleGetAllCertificationsByProjectId);

router
.route('/')
.post(handleGetCertificationById);



export default router;