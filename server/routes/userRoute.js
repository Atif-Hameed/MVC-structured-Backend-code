import  express from "express";
import { loginController, userController } from "../controllers/userController.js";


const router = express.Router()

//Register Route
router.post('/register', userController)

//Login Route
router.post('/login', loginController)

export default router