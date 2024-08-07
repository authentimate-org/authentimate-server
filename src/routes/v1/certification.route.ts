import express from 'express'
const router = express.Router()
<<<<<<< HEAD
import { handleCreateCertification, handleGetAllCertificationsByProjectId, handleGetCertificationById } from '../../controllers/certification.controller'
=======
import { handleCreateCertification, handleGetStatusOfAllCertificationsByProjectId, handleGetCertificationById, handleUpdateCertificationByCertificationId } from '../../controllers/certification.controller'
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73



router
.route('/create')
.post(handleCreateCertification);

router
<<<<<<< HEAD
.route('/all')
.post(handleGetAllCertificationsByProjectId);
=======
.route('/get-status')
.post(handleGetStatusOfAllCertificationsByProjectId);

router
.route('/update')
.put(handleUpdateCertificationByCertificationId);
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73

router
.route('/:certificationId')
.get(handleGetCertificationById);

<<<<<<< HEAD
// router
// .route('/')
// .post(handleGetCertificationById);

=======
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73


export default router;