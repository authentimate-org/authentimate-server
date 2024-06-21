import express from "express"
const router = express.Router()
import premadeTemplateRoutes from "./premadeTemplate.route"
import modifiedTemplateRoutes from "./modifiedTemplate.route"
import certificationRoutes from "./certification.route"
import { handleCreateProject, handleGetAllProjectsByIssuerId, handleGetProjectById, handleUpdateProjectById, handleDeleteProjectById } from '../../controllers/project.controller'



router
.route("/create")
.post(handleCreateProject);

router
.route("/read")
.get(handleGetAllProjectsByIssuerId)
.post(handleGetProjectById);

router
.route("/update")
.put(handleUpdateProjectById);

// router
// .route("/delete")
// .delete(handleUpdateProjectById);

router.use('/premadeTemplate', premadeTemplateRoutes);

router.use('/modifiedTemplate', modifiedTemplateRoutes);

router.use('/certification', certificationRoutes);



export default router;
