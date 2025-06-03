import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const cartSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        maxLength: [100, "Name must not excees 100 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNo: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true
    },
    address: {
        street: {
            type: String,
            required: [true, "Street address is required"],
            trim: true
        },
        apartment: {
            type: String,
            trim: true
        }
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true
    },
    province: {
        type: String,
        required: [true, "Province is required"],
        trim: true
    },
    postalCode: {
        type: Number,
        required: [true, "Postal code is required"]
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'bank_transfer'],
        required: true
    },
    deliveryNotes: {
        type: String,
        trim: true,
        maxLength: [500, "Notes must not exceed 500 characters"]
    },
    items: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true 
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }, 
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    sessionId: {
        type: String
    },
},
{
    timestamps: true
}
)

cartSchema.plugin(mongoosePaginate);

export const Cart = mongoose.model("Cart", cartSchema)