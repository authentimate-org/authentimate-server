import express from 'express'
const router = express.Router()
import { handleSelectPremadeTemplate, handleRemovePremadeTemplate } from '../../controllers/project.controller'
import { handleCreatePremadeTemplate, handleGetAllPremadeTemplates, handleGetPremadeTemplateById, handleDeletePremadeTemplateById } from '../../controllers/premadeTemplate.controller'



router
.route('/create')
.post(handleCreatePremadeTemplate);

router
.route('/read')
.get(handleGetAllPremadeTemplates)
.post(handleGetPremadeTemplateById);

// router
// .route('/delete')
// .delete(handleDeletePremadeTemplateById);

router
.route('/select')
.post(handleSelectPremadeTemplate);

router
.route('/remove')
.post(handleRemovePremadeTemplate);



export default router
