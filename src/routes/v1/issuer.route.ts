import express from "express"
const router = express.Router()
import authMiddleware from "../../middleware/auth.middleware"
import emailValidatorMiddleware from '../../middleware/emailValidator.middleware'
import { handleCreateIssuer, handleGetIssuerById, handleUpdateIssuerById, handleCkeckOnboardingStatus, handleDoOnboarding, handleDeleteIssuerById } from "../../controllers/issuer.controller"



router
.route('/create')
.post(emailValidatorMiddleware, handleCreateIssuer);

router
.route('/')
.get(handleGetIssuerById);

router
.route('/update')
.put(handleUpdateIssuerById);

router
.route('/onboarding')
.get(handleCkeckOnboardingStatus)
.put(handleDoOnboarding);

router
.route('/delete')
.delete(authMiddleware, handleDeleteIssuerById);



export default router;
