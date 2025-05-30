import { v2 as cloudinary } from "cloudinary"
import fs from 'fs'

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath)
            return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        })
        fs.unlinkSync(localFilePath);
        return {
            url: response.secure_url,
            public_id: response.public_id
        };
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary upload error:", error);
        return null;
    }
}

export { cloudinary, uploadOnCloudinary }