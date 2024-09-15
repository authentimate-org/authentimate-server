import express from "express"
const router = express.Router()
import { handleCreateProject, handleGetAllProjectsByIssuerId, handleGetProjectById, handleGetTemplateByProjectId, handleUpdateProjectById, handleDeleteProjectById } from '../../controllers/project.controller'



router
.route('/create')
.post(handleCreateProject);

router
.route('/all')
.get(handleGetAllProjectsByIssuerId);

router
.route('/get-project')
.post(handleGetProjectById);

router
.route('/get-template')
.post(handleGetTemplateByProjectId);

router
.route("/update")
.put(handleUpdateProjectById);

// router
// .route("/delete")
// .delete(handleUpdateProjectById);



export default router;
