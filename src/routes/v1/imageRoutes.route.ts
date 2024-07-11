import { addUserImage, getUserImage } from "../../controllers/image.controller";
import express from "express";
const router = express.Router();
router.route("/").get(getUserImage).post(addUserImage);

export default router;
