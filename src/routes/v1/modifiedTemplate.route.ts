import express from 'express';
const router = express.Router();
import { handleCreateModifiedTemplate, handleGetAllModifiedTemplatesByIssuerId, handleGetModifiedTemplateById, handleUpdateModifiedTemplateById, handleDeleteModifiedTemplateById } from '../../controllers/modifiedTemplate.controller'; 



router
.route('/create')
.post(handleCreateModifiedTemplate);

router
.route('/all')
.get(handleGetAllModifiedTemplatesByIssuerId);

router
.route('/')
.post(handleGetModifiedTemplateById);

router
.route('/update')
.put(handleUpdateModifiedTemplateById);

// router
// .route('/delete')
// .delete(handleDeleteModifiedTemplateById);



export default router;
