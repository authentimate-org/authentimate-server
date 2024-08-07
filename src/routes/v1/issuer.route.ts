import express from "express"
const router = express.Router()
<<<<<<< HEAD
import authMiddleware from "../../middleware/auth.middleware"
import emailValidatorMiddleware from '../../middleware/emailValidator.middleware'
=======
import emailValidatorMiddleware from '../../middlewares/emailValidator.middleware'
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73
import { handleSignUp, handleSignIn, handleGetIssuerById, handleUpdateIssuerById, handleCheckOnboardingStatus, handleDoOnboarding, handleDeleteIssuerById } from "../../controllers/issuer.controller"



router
.route('/signUp')
<<<<<<< HEAD
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
=======
.post(emailValidatorMiddleware, handleSignUp);

router
.route('/signIn')
.post(emailValidatorMiddleware, handleSignIn);

router
.route('/getUser')
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
>>>>>>> ca951bc7e4f94ba080876c9da1d6c790a8817e73



export default router;
