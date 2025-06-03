import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createOrder, getOrderById, getAllOrders, updateOrderStatus } from "../controllers/cart.controller.js"
import { get } from "mongoose"

const router = express.Router()

// Public Routes
router.route("/").post(createOrder)

// Protected Routes
router.route("/:orderId/").post(verifyJWT, get)

export default router