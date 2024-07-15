import express from "express"
const router = express.Router()
import emailValidatorMiddleware from '../../middleware/emailValidator.middleware'
import { handleSignUp, handleSignIn, handleGetIssuerById, handleUpdateIssuerById, handleCheckOnboardingStatus, handleDoOnboarding, handleDeleteIssuerById } from "../../controllers/issuer.controller"



router
.route('/signUp')
.post(emailValidatorMiddleware, handleSignUp);

router
.route('/signIn')
.post(emailValidatorMiddleware, handleSignIn);

router
.route('/')
.get(handleGetIssuerById);

router
.route('/update')
.put(handleUpdateIssuerById);

router
.route('/onboarding')
.get(handleCheckOnboardingStatus)
.put(handleDoOnboarding);

router
.route('/delete')
.delete(handleDeleteIssuerById);



export default router;
