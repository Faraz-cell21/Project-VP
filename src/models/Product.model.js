import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    productType: {
        type: String,
        enum: ['Freebase', 'NicSalt'],
        required: [true, 'Product type is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price cannot be negative or zero']
    },
    flavorDetail: {
        type: String,
        required: [true, 'Flavor detail is required'],
        trim: true
    },
    inStock: {
        type: String,
        enum: ['Available', 'Not Available']
    },
    stock: {
        type: Number,
        required: true,
        default: 10,
        min: 0
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
})

export const Product = mongoose.model("Product", productSchema)