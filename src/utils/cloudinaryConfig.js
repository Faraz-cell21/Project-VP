import { cloudinary } from './cloudinary.js';
import dotenv from 'dotenv';

dotenv.config();

const configureCloudinary = () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
        throw new Error("Cloudinary environment variables not configured!");
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

};

export default configureCloudinary;