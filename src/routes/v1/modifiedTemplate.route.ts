import express from 'express';
import multer from 'multer';
const router = express.Router();
<<<<<<< HEAD
import { handleSaveModifiedTemplate, handleGetAllModifiedTemplatesByIssuerId, handleGetModifiedTemplateByProjectId, handleDeleteModifiedTemplateById } from '../../controllers/modifiedTemplate.controller'; 
=======
import { handleSaveModifiedTemplate, handleFinaliseTemplate, handleGetAllModifiedTemplatesByIssuerId, handleGetModifiedTemplateByProjectId, handleDeleteModifiedTemplateById } from '../../controllers/modifiedTemplate.controller'; 
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
.route('/save')
<<<<<<< HEAD
.post(upload.none(), handleSaveModifiedTemplate);
=======
.put(upload.none(), handleSaveModifiedTemplate);

router
.route('/finalise')
.put(handleFinaliseTemplate);
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73

router
.route('/all')
.get(handleGetAllModifiedTemplatesByIssuerId);

router
.route('/')
.post(handleGetModifiedTemplateByProjectId);

<<<<<<< HEAD
// router
// .route('/delete')
// .delete(handleDeleteModifiedTemplateById);



=======

>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
export default router;
