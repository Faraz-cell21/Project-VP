import { Cart } from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

const createOrder = asyncHandler(async (req, res) => {
    const { fullName, email, phoneNo, address, city, province, postalCode, paymentMethod = "cod", deliveryNotes, items } = req.body

    if(!fullName || !email || !phoneNo || !address?.street || !city || !province || !postalCode){
        throw new ApiError(400, "Please fill all required shipping information")
    }

    if(!items ||Array.isArray(items) || items.length == 0){
        throw new ApiError(400, "Cart cannot be empty")
    }

    let total = 0
    const validatedItems = []
    const productUpdates = []

    for(const item of items){
        if(!item.product || item.quantity){
            throw new ApiError(400, "Each item must have product ID and quantity")
        }

        const product = await Product.findById(item.product)
        if(!product){
            throw new ApiError(404, `Product ${item.product} not found`)
        }

        if(product.inStock !== "Available"){
            throw new ApiError(400, `${product.name} is currently out of stock`)
        }

        if(item.quantity <= 0){
            throw new ApiError(400, `Invalid quantity for ${product.name}`)
        }

        const itemTotal = product.price * item.quantity
        total += itemTotal

        validatedItems.push({
            product: product._id,
            name: product.name,
            quantity: item.quantity,
            price: product.price,
            image: product.image.url
        })

        productUpdates.push({
            updateOne: {
                filter: {
                    _id: product._id
                },
                update: {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            }
        })
    }

    const order = await Cart.create({
        fullName,
        email,
        phoneNo,
        address,
        city,
        province,
        postalCode,
        paymentMethod,
        deliveryNotes,
        items: validatedItems,
        sessionId: !req.user ? req.sessionID : undefined
    })

    if(productUpdates.length > 0){
        await Product.bulkWrite(productUpdates)
    }

    // Will add email and sms notification here

    return res.status(200).json(
        new ApiResponse(200, order, "Order retrieved successfully")
    )
})

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Cart.findById(req.params.orderId)
        .populate('items.product', 'name price image');

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const isOwner = (
        (req.user && order.userId?.equals(req.user._id)) || 
        (!req.user && order.sessionId === req.sessionID)
    );

    if (!isOwner && req.user?.role !== 'admin') {
        throw new ApiError(403, "Unauthorized to view this order");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order retrieved successfully")
    );
});

const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query

    const filter = {}
    if(status){
        filter.status = status
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: [
            { path: "items.product", select: "name price"}
        ]
    }

    const orders = await Cart.paginate(filter, options)

    return res.status(200).json(
        new ApiResponse(200, orders, "Orders retireved successfully")
    )
})

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const order = await Cart.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    );

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // TODO: Add status change notification here

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated successfully")
    );
});

export { 
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus
}