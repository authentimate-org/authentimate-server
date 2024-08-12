import express from "express"
const router = express.Router()
import { handleAddIssuerImage, handleGetIssuerImage } from '../../controllers/issuerImage.controller'


router
.route('/')
.get(handleGetIssuerImage)
.post(handleAddIssuerImage);

export default router;
