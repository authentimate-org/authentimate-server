import express from 'express';
const router = express.Router();
import { handleCreateModifiedTemplate, handleGetModifiedTemplateById, handleUpdateModifiedTemplateById, handleDeleteModifiedTemplateById } from '../../controllers/modifiedTemplate.controller'; 


router
.route('/')
.post(handleCreateModifiedTemplate);

router
.route('/:modifiedTemplateId')
.get(handleGetModifiedTemplateById)
.put(handleUpdateModifiedTemplateById)
.delete(handleDeleteModifiedTemplateById);

export default router
