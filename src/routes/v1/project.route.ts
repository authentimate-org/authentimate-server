import express from "express"
const router = express.Router()
import modifiedTemplateRoutes from "./modifiedTemplate.route"
import certificationRoutes from "./certification.route"
import { handleCreateProject, handleGetAllProjectsByIssuerId, handleGetProjectById, handleUpdateProjectById, handleDeleteProjectById } from '../../controllers/project.controller'



router
.route('/create')
.post(handleCreateProject);

router
.route('/all')
.get(handleGetAllProjectsByIssuerId);

router
.route('/')
.post(handleGetProjectById);

router
.route("/update")
.put(handleUpdateProjectById);

// router
// .route("/delete")
// .delete(handleUpdateProjectById);



export default router;
