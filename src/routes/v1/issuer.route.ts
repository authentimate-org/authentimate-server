import express from "express"
const router = express.Router()
import authMiddleware from "../../middleware/auth.middleware"
import emailValidatorMiddleware from '../../middleware/emailValidator.middleware'
import { handleSignUp, handleSignIn, handleGetIssuerById, handleUpdateIssuerById, handleCheckOnboardingStatus, handleDoOnboarding, handleDeleteIssuerById } from "../../controllers/issuer.controller"



router
.route('/signUp')
.post( handleSignUp);

router
.route('/signIn')
.post( handleSignIn);

router
.route('/getUser')
.get(authMiddleware, handleGetIssuerById);

router
.route('/update')
.put(authMiddleware, handleUpdateIssuerById);

router
.route('/onboarding')
.get(authMiddleware, handleCheckOnboardingStatus)
.put(authMiddleware, handleDoOnboarding);

router
.route('/delete')
.delete(authMiddleware, handleDeleteIssuerById);



export default router;
