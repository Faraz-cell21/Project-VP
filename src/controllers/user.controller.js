import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"


const registerUser = asyncHandler(async (req, res) => {
    const {fullname, email, password, role} = req.body
    console.log("E-mail: ", email)

    if(!(fullname && email && password && role))
    {
        throw new ApiError(402, "All fields must be filled")
    }  

    const registered_user = await User.findOne({email})
    if(!registered_user)
    {
        const newUser = await User.create({
            fullname,
            email,
            password,
            role
        })
        const user = await User.findById(newUser._id).select("-password")
        return res.status(200).json(
            new ApiResponse(200, user, "User Created Successfully")
        )

    } else {
        res.status(400).json({
            message: "User Already Exists, Try with different email"
        })
    }
        
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email && !password){
        throw new ApiError(400, "Email and password both required")
    }

    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Password is not valid")
    }

    const accessToken = user.generateAccessToken()

    const loggedInUser = await User.findById(user._id).select("-password")
    console.log(loggedInUser)

    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200).cookie("accessToken", accessToken, options).json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    const options= {
        httpOnly: true,
        secure: true
    }
    res.status(200).clearCookie("accessToken", "", options).json(new ApiResponse(200, {}, "User Logged out successfully"))
})

export {registerUser, loginUser, logoutUser}