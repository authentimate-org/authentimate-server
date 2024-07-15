import express from 'express';
import multer from 'multer';
const router = express.Router();
import { handleSaveModifiedTemplate, handleFinaliseTemplate, handleGetAllModifiedTemplatesByIssuerId, handleGetModifiedTemplateByProjectId, handleDeleteModifiedTemplateById } from '../../controllers/modifiedTemplate.controller'; 


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
.route('/save')
.put(upload.none(), handleSaveModifiedTemplate);

router
.route('/finalise')
.put(handleFinaliseTemplate);

router
.route('/all')
.get(handleGetAllModifiedTemplatesByIssuerId);

router
.route('/')
.post(handleGetModifiedTemplateByProjectId);


export default router;
