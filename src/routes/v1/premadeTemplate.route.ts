import express from 'express';
const router = express.Router();
import { handleCreateProject, handleGetAllProjectsByIssuerId, handleGetProjectById, handleUpdateProjectById, handleSelectPremadeTemplate, handleRemovePremadeTemplate, handleDeleteProjectById } from '../../controllers/project.controller'; 
import { handleCreatePremadeTemplate, handleGetAllPremadeTemplates, handleGetPremadeTemplateById, handleDeletePremadeTemplateById } from '../../controllers/premadeTemplate.controller'; 


router
.route('/')
.get(handleGetAllPremadeTemplates)
.post(handleCreatePremadeTemplate);

// router
// .route('/:id')
// .get(handleGetPremadeTemplateById)
// .delete(handleDeletePremadeTemplateById);

router
.route('/:projectId/:premadeTemplateId')
.get(handleSelectPremadeTemplate)
.post(handleRemovePremadeTemplate);

export default router
