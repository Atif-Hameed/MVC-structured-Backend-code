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
            totalProducts : products.length,
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
        //         message: 'please provide all the fields'         //Cooment are apply due to form validation in postman and will remove when integrate to client side
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
            message:'Product Created Successfully'
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: 'createNewProduct API Error',
            error
        })
    }
}


//Update Product
export const updateProductController = async(req, resp) => {
    try {
        const product = await productModel.findById(req.params.id)
        const {name, description, price, stock, category} = req.body
        if(!product){
            return resp.status(404).send({
                success:false,
                message:'Product Not Found'
            })
        }
        //validation and update
        if(name) product.name = name
        if(description) product.description = description
        if(price) product.price = price
        if(stock) product.stock = stock
        if(category) product.category = category

        await product.save()
        resp.status(200).send({
            success:true,
            message:'Product updated successfully'
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
            success:false,
            message:'updateProduct API Error'
        })
    }
}


//Update Product Image
export const updateProductImageController = async (req, resp) => {
    try {
        const product = await productModel.findById(req.params.id)
        if(!product){
            return resp.status(404).send({
                success:false,
                message:'Product Not Found'
            })
        }
        if(!req.file){
            return resp.status(404).send({
                success:false,
                message:'Product Image not found'
            })
        }
        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id : cdb.public_id,
            url : cdb.secure_url
        }

        //update image
        product.images.push(image)
        await product.save()
        resp.status(200).send({
            success:true,
            message:'Product Image updated successfully'
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
            success:false,
            message:'updateProductImage API Error'
        })
    }
}


//Delete Product Image
export const deleteProductIamgeController = async(req, resp)=>{
    try {
        //find product
        const product = await productModel.findById(req.params.id)
        //validate product
        if(!product){
            return resp.status(404).send({
                success:false,
                message:'Product Not found'
            })
        }
        //image id find
        const id = req.query.id
        if(!id){
            return resp.status(404).send({
                success:false,
                message:'Product Image Not found'
            })
        }

        let isExist = -1
        if(product.images.forEach((item, index)=>{
            if(item._id.toString() === id.toString()) isExist = index
        }))
        if(isExist < 0){
            return resp.status(404).send({
                success:false,
                message:'Image Not found'
            })
        }
        //delete image
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)
        product.images.splice(isExist, 1)
        await product.save()
        return resp.status(200).send({
            success:true,
            message:'Product Image Deleted Successfully'
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
            success:false,
            message:'deleteProductImage API Error',
            error
        })
    }
}


//delete product
export const deleteProductController = async(req, resp) => {
    try {
        const product = await productModel.findById(req.params.id)
        //validation
        if(!product){
            return resp.status(404).send({
                success : false,
                message : 'Product Not Found'
            })
        }
        //find and delete images from cloudinary
        for(let index=0; index<product.images.length; index++){
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }
        //delete other product things
        await product.deleteOne();
        resp.status(200).send({
            success : true,
            message : 'Product deleted successfully'
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
            success:false,
            message:'deleteProduct API Error',
            error
        })
    }
}