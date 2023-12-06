import express from "express";
import { createNewProductController, getAllProductController, getSingleProductController } from "../controllers/productController.js";
import { singlUpload } from "../middlewares/multer.js";
import { isAuthentic } from "../middlewares/authMiddleware.js";

const router = express.Router()

//Get All products
router.get('/get-all', getAllProductController)

//Get Single product
router.get('/:id', getSingleProductController)

//create New Product
router.post('/create', singlUpload, isAuthentic, createNewProductController)

export default router