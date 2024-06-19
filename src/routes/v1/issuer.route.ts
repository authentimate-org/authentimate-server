import express from "express";
// import authMiddleware from "../../middleware/auth.middleware";
import {
    handleCreateIssuer,
    //   handleGetIssuerById,
    //   handleUpdateIssuerById,
    //   handleDeleteIssuerById,
} from "../../controllers/issuer.controller";



const router = express.Router();


router.route("/create").post(handleCreateIssuer);

// router.route("/:issuerId")
//   .get(authMiddleware, handleGetIssuerById)
//   .put(authMiddleware, handleUpdateIssuerById)

export default router;
