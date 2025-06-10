import {Router} from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

const router = Router();

// User Routes but registration is not available for frontend
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser) 

export default router