import express from "express";
import { createNewProductController, deleteProductController, deleteProductIamgeController, getAllProductController, getSingleProductController, updateProductController, updateProductImageController } from "../controllers/productController.js";
import { singlUpload } from "../middlewares/multer.js";
import { isAuthentic } from "../middlewares/authMiddleware.js";

const router = express.Router()

//Get All products
router.get('/get-all', getAllProductController)

//Get Single product
router.get('/:id', getSingleProductController)

//create New Product
router.post('/create', singlUpload, isAuthentic, createNewProductController)

//update product
router.put('/:id', isAuthentic, updateProductController)

//update product image
router.put('/image/:id', isAuthentic, singlUpload, updateProductImageController)

//delete product image
router.delete('/delete-image/:id', isAuthentic, deleteProductIamgeController)

//delete product
router.delete('/delete/:id', isAuthentic, deleteProductController)

export default router