import express from 'express'
const router = express.Router()
import { handleSelectPremadeTemplate } from '../../controllers/project.controller'
import { handleCreatePremadeTemplate, handleGetAllPremadeTemplates, handleGetPremadeTemplateById, handleDeletePremadeTemplateById } from '../../controllers/premadeTemplate.controller'



router
.route('/create')
.post(handleCreatePremadeTemplate);

router
.route('/all')
.get(handleGetAllPremadeTemplates);

router
.route('/')
.post(handleGetPremadeTemplateById);

// router
// .route('/delete')
// .delete(handleDeletePremadeTemplateById);

router
.route('/add-to-project')
.post(handleSelectPremadeTemplate);

// router
// .route('/remove')
// .post(handleRemovePremadeTemplate);



export default router
