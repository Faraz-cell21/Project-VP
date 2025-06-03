import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createOrder, getOrderById, getAllOrders, updateOrderStatus } from "../controllers/cart.controller.js"

const router = express.Router()

// Public Routes
router.route("/").post(createOrder)

// Protected Routes
router.route("/:orderId/").post(verifyJWT, getOrderById)

export default router