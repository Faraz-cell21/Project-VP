import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/Product.model.js"
import { cloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { upload } from "../middlewares/multer.middleware.js"

const createProduct = asyncHandler(async (req, res) => {
    const { name, productType, price, flavorDetail, inStock} = req.body

    if(!(name && productType && price && flavorDetail && inStock)){
        throw new ApiError(400, "All fields are required")
    }

    if(!req.file?.path){
        throw new ApiError(400, "Product image is required")
    }

    if(!req.user){
        throw new ApiError(401, "Unauthorized - User not logged in")
    }

    const image = await uploadOnCloudinary(req.file.path)
    if(!image){
        throw new ApiError(500, "Failed to upload product image")
    }

    const product = await Product.create({
        name,
        productType,
        price,
        flavorDetail,
        inStock,
        image: {
            public_id: image.public_id,
            url: image.url
        }
    })

    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    )
})

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params
    const { name, productType, price, flavorDetail, inStock } = req.body

    if(!(name && productType && price && flavorDetail && inStock)){
        throw new ApiError(400, "All fields are required")
    }

    if(!req.user){
        throw new ApiError(401, "Unauthorized - User not logged in")
    }

    const product = await Product.findById(productId)
    if(!product){
        throw new ApiError(400, "Product not found")
    }

    let updateData = { name, productType, price, flavorDetail, inStock }

    if(req.file?.path){
        await cloudinary.uploader.destroy(product.image.public_id)
        const image = await uploadOnCloudinary(req.file.path)
        if(!image){
            throw new ApiError(500, "Failed to upload new product image")
        }
        updateData.image = {
            public_id: image.public_id,
            url: image.url
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: updateData },
        { new: true }
    ).select("-__v")

    return res.status(200).json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
    )


})

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params

    if(!req.user){
        throw new ApiError(401, "Unauthorized - User not logged in")
    }

    const product = await Product.findById(productId)
    if(!product){
        throw new ApiError(404, "Product not found")
    }

    await cloudinary.uploader.destroy(product.image.public_id)
    
    await Product.findByIdAndDelete(productId)

    res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully")
    )
})

const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params

    const product = await Product.findById(productId).select("-__v")

    if(!product){
        throw new ApiError(404, "Product not found")
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product retrieved successfully")
    )
})

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().select("-__v").sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(200, products, "All products retrieved successfully")
    )
})

export { 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductById, 
    getAllProducts 
}