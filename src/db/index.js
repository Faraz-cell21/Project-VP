import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`DB connected at ${db.connection.host}`)
    } catch (error) {
        console.log("Connection Failed due to ", error)
        process.exit(1)
    }
}

export default connectDB