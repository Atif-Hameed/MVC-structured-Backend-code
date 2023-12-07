import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        require:[true, 'Category is require']
    }
}, {timestamps:true} )

export const categoryModel = mongoose.model("Category", categorySchema)
export default categoryModel