import express from 'express'
const router = express.Router()
import { handleCreateCertification, handleGetStatusOfAllCertificationsByProjectId, handleGetCertificationById, handleUpdateCertificationByCertificationId } from '../../controllers/certification.controller'



router
.route('/create')
.post(handleCreateCertification);

router
.route('/get-status')
.post(handleGetStatusOfAllCertificationsByProjectId);

router
.route('/update')
.put(handleUpdateCertificationByCertificationId);

router
.route('/:certificationId')
.get(handleGetCertificationById);



export default router;