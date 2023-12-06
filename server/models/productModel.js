import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require : [true, "Product Name is require"]
    },
    description:{
        type:String,
        require:[true, "Product description is require"]
    },
    price:{
        type:Number,
        require:[true, 'Product price is require']
    },
    stock:{
        type:Number,
        require:[true, 'product stock require']
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    images:[
        {
            public_id:String,
            url:String
        }
    ]
}, {timestamps:true} )

export const productModel = mongoose.model("products", productSchema)