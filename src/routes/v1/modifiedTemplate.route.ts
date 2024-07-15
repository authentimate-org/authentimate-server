import express from 'express';
import multer from 'multer';
const router = express.Router();
import { handleSaveModifiedTemplate, handleGetAllModifiedTemplatesByIssuerId, handleGetModifiedTemplateByProjectId, handleDeleteModifiedTemplateById } from '../../controllers/modifiedTemplate.controller'; 


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
.route('/save')
.post(upload.none(), handleSaveModifiedTemplate);

router
.route('/all')
.get(handleGetAllModifiedTemplatesByIssuerId);

router
.route('/')
.post(handleGetModifiedTemplateByProjectId);

// router
// .route('/delete')
// .delete(handleDeleteModifiedTemplateById);



export default router;
