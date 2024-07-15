import express from 'express'
const router = express.Router()
import { handleCreateCertification, handleGetAllCertificationsByProjectId, handleGetCertificationById, handleUpdateCertificationByCertificationId } from '../../controllers/certification.controller'



router
.route('/create')
.post(handleCreateCertification);

// router
// .route('/all')
// .get(handleGetAllCertificationsByProjectId);

router
.route('/update')
.put(handleUpdateCertificationByCertificationId);

router
.route('/:certificationId')
.get(handleGetCertificationById);



export default router;