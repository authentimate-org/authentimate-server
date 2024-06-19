import express from "express";
const router = express.Router();
import premadeTemplateRoutes from "./premadeTemplate.route";
import modifiedTemplateRoutes from "./modifiedTemplate.route";
import certificationRoutes from "./certification.route";
// import { handleCreateProject, handleGetAllProjectsByIssuerId, handleGetProjectById, handleUpdateProjectById, handleDeleteProjectById } from '../../controllers/project.controller'
import { handleCreateProject } from "../../controllers/project.controller";


router.route("/create").post(handleCreateProject);

// router.use('/premadeTemplate', premadeTemplateRoutes);

// router.use('/modifiedTemplate', modifiedTemplateRoutes);

// router.use('/certification', certificationRoutes);

// router
// .route('/all/:issuerId')
// .get(handleGetAllProjectsByIssuerId);

// router
// .route('/:projectId')
// .get(handleGetProjectById)
// .put(handleUpdateProjectById)
// .delete(handleDeleteProjectById);

export default router;
