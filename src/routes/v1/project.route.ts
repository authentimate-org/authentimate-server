import express from "express"
const router = express.Router()
<<<<<<< HEAD
import modifiedTemplateRoutes from "./modifiedTemplate.route"
import certificationRoutes from "./certification.route"
import { handleCreateProject, handleGetAllProjectsByIssuerId, handleGetProjectById, handleUpdateProjectById, handleDeleteProjectById } from '../../controllers/project.controller'
=======
import { handleCreateProject, handleGetAllProjectsByIssuerId, handleGetProjectById, handleGetTemplateByProjectId, handleUpdateProjectById, handleDeleteProjectById } from '../../controllers/project.controller'
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73



router
.route('/create')
.post(handleCreateProject);

router
.route('/all')
.get(handleGetAllProjectsByIssuerId);

router
<<<<<<< HEAD
.route('/')
.post(handleGetProjectById);

router
=======
.route('/get-project')
.post(handleGetProjectById);

router
.route('/get-template')
.post(handleGetTemplateByProjectId);

router
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
.route("/update")
.put(handleUpdateProjectById);

// router
// .route("/delete")
// .delete(handleUpdateProjectById);



export default router;
