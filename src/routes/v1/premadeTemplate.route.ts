import express from 'express'
import multer from 'multer';
const router = express.Router()
import { handleCreatePremadeTemplate, handleGetAllPremadeTemplates, handleGetPremadeTemplateById, handleDeletePremadeTemplateById } from '../../controllers/premadeTemplate.controller'
import { handleSelectPremadeTemplate } from '../../controllers/project.controller'


const storage = multer.memoryStorage();
const upload = multer({ storage });


router
.route('/create')
.post(upload.single('image'), handleCreatePremadeTemplate);

router
.route('/all')
.get(handleGetAllPremadeTemplates);

router
.route('/')
.post(handleGetPremadeTemplateById);

router
.route('/add-to-project')
.put(handleSelectPremadeTemplate);


export default router
