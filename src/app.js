import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import UserRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import orderRouter from "./routes/order.routes.js"

const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true              
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static("public"))

// User Route
app.use("/api/admin", UserRouter)

// Product Route 
app.use("/api/products", productRouter)

// Order Route 
app.use("/api/order", orderRouter)

export { app }