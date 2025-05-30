import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts } from "../controllers/product.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

// Public routes
router.route("/").get(getAllProducts)
router.route("/:productId").get(getProductById)

// Protected routes
router.route("/create").post(verifyJWT, upload.single("image"), createProduct)
router.route("/:productId/update").patch(verifyJWT, upload.single("image"), updateProduct)
router.route("/:productId/delete").delete(verifyJWT, deleteProduct)

export default router