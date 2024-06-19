import express from 'express';
const router = express.Router();
import { handleCreateCertification, handleGetCertificationById, handleDeleteCertificationById } from '../../controllers/certification.controller'; 


router
.route('/')
.post(handleCreateCertification);

router
.route('/:certificationId')
.get(handleGetCertificationById)
// .put(handleUpdateCertificationById)
.delete(handleDeleteCertificationById)

export default router;