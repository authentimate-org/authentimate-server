import express from 'express';
import multer from 'multer';
const router = express.Router();
import { handleCreateModifiedTemplate, handleSaveModifiedTemplate, handleGetAllModifiedTemplatesByIssuerId, handleGetModifiedTemplateByProjectId, handleUpdateModifiedTemplateById, handleDeleteModifiedTemplateById } from '../../controllers/modifiedTemplate.controller'; 


// const storage = multer.memoryStorage();
// const upload = multer({ storage });


// router
// .route('/create')
// .post(handleCreateModifiedTemplate);

router
.route('/save')
.post(handleSaveModifiedTemplate);

router
.route('/all')
.get(handleGetAllModifiedTemplatesByIssuerId);

router
.route('/')
.post(handleGetModifiedTemplateByProjectId);

// router
// .route('/update')
// .put(handleUpdateModifiedTemplateById);

// router
// .route('/delete')
// .delete(handleDeleteModifiedTemplateById);



export default router;
