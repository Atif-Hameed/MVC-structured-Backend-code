import { productModel } from "../models/productModel.js"
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary"

//get all products
export const getAllProductController = async (req, resp) => {
    try {
        const products = await productModel.find({});
        resp.status(200).send({
            success: true,
            message: 'all products fetched successfuly',
            products
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: 'getAllProduct API Error',
            error
        })
    }
}


//get single product
export const getSingleProductController = async (req, resp) => {
    try {
        const product = await productModel.findById(req.params.id)
        //validation
        if (!product) {
            return resp.status(404).send({
                success: false,
                message: 'Product Not Found'
            })
        }
        resp.status(200).send({
            success: true,
            message: 'Product Fetched successfully',
            product
        })
    } catch (error) {
        //Cast error || object ID error
        if (error.name === 'CastError') {
            return resp.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        resp.status(500).send({
            success: false,
            message: 'getSingleProduct API Error',
            error
        })
    }
}


//create new product
export const createNewProductController = async (req, resp) => {
    try {
        const { name, description, price, stock, category } = req.body
        //validation
        // if (!name || !description || !price || !stock || !category) {
        //     return resp.status(500).send({
        //         success: false,
        //         message: 'please provide all the fields'
        //     })
        // }
        // image validation
        if(!req.file){
            return resp.status(500).send({
                success:false,
                message:'Please provide product image'
            })
        }
        //get image
        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        //save data
        await productModel.create({
            name,
            description, 
            price, 
            stock, 
            category, 
            images: [image]
        })
        resp.status(200).send({
            success:true,
            message:'Photo Uploaded Successfully'
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: 'createNewProduct API Error',
            error
        })
    }
}