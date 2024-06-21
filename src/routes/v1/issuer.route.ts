import express from "express"
const router = express.Router()
import authMiddleware from "../../middleware/auth.middleware"
import emailValidatorMiddleware from '../../middleware/emailValidator.middleware'
import { handleCreateIssuer, handleGetIssuerById, handleUpdateIssuerById, handleDeleteIssuerById } from "../../controllers/issuer.controller"



router
.route('/create')
.post(emailValidatorMiddleware, handleCreateIssuer);

router
.route('/read')
.get(authMiddleware, handleGetIssuerById);

router
.route('/update')
.put(authMiddleware, handleUpdateIssuerById);

// router
// .route('/delete')
// .delete(authMiddleware, handleDeleteIssuerById);



export default router;
