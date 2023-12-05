import  express from "express";
import { fetchUserProfileController, logOutUserController, loginController, updateUserPasswordController, userController, userProfilePicUpdateController, userProfileUpdateController } from "../controllers/userController.js";
import {isAuthentic} from "../middlewares/authMiddleware.js";
import { singlUpload } from "../middlewares/multer.js";


const router = express.Router()

//Register Route
router.post('/register', userController)

//Login Route
router.post('/login', loginController)

//get User Profie
router.get('/profile', isAuthentic, fetchUserProfileController)

//logout
router.get('/logout', isAuthentic, logOutUserController)

//updateProfile
router.put('/profile-update', isAuthentic, userProfileUpdateController)

//update Password
router.put('/password-update', isAuthentic, updateUserPasswordController)

//update profile photo
router.put('/photo-update', isAuthentic, singlUpload, userProfilePicUpdateController)

export default router