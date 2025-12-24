import { apiResponse } from "../scr/utiles/apiRespose.js";
import {asyncHandler} from "../scr/utiles/asyncHandler.js";
import {User} from "../scr/models/user.model.js"
import { apiResponse } from "../scr/utiles/apiRespose.js";
import { cloudinaryFileUploader } from "../scr/utiles/cloudinary.js";

const registerUser = asyncHandler( async (req,res)=>{
    const {fullName,userName,password,email} =res.body;

    if([fullName,userName,password,email].some(( fields ) => fields.trim() === "" ) ){
        throw new apiResponse(400, "all fields are required.");
    }

    const existUser = findOne({
        $or:[{email,userName}]
    })
    
    if(existUser){
        throw new apiResponse(409,"user with email or userName is already exist.");
    }

    const avatarLocalPath =res.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    const avatar = await cloudinaryFileUploader(avatarLocalPath);
    const coverImage = await cloudinaryFileUploader(coverImageLocalPath);
    
    if(!avatar){
        throw new apiResponse(400,"avatar is required.")
    }
    
    const user = await {
        fullName,
        email,
        password,
        userName:userName.lowerCase(),
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
    }

    const createdUser = await findbyid(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiResponse(500," some thing went wrong while registering user.")
    }

    return res.status(201).json(
        new apiResponse(200,createdUser,"user registered successfuly.")
    )
})

export default registerUser;