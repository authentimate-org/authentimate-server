import express from 'express'
import multer from 'multer';
const router = express.Router()
<<<<<<< HEAD
import { handleSelectPremadeTemplate } from '../../controllers/project.controller'
import { handleCreatePremadeTemplate, handleGetAllPremadeTemplates, handleGetPremadeTemplateById, handleDeletePremadeTemplateById } from '../../controllers/premadeTemplate.controller'


// const storage = multer.memoryStorage();
// const upload = multer({ storage });
=======
import { handleCreatePremadeTemplate, handleGetAllPremadeTemplates, handleGetPremadeTemplateById, handleDeletePremadeTemplateById } from '../../controllers/premadeTemplate.controller'
import { handleSelectPremadeTemplate } from '../../controllers/project.controller'


const storage = multer.memoryStorage();
const upload = multer({ storage });
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73


router
.route('/create')
<<<<<<< HEAD
.post(handleCreatePremadeTemplate);
=======
.post(upload.single('image'), handleCreatePremadeTemplate);
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73

router
.route('/all')
.get(handleGetAllPremadeTemplates);

router
.route('/')
.post(handleGetPremadeTemplateById);
<<<<<<< HEAD

// router
// .route('/delete')
// .delete(handleDeletePremadeTemplateById);

router
.route('/add-to-project')
.post(handleSelectPremadeTemplate);

// router
// .route('/remove')
// .post(handleRemovePremadeTemplate);

=======

router
.route('/add-to-project')
.put(handleSelectPremadeTemplate);
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73


export default router
