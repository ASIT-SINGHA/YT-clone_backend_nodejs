import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config(
    { 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET

})

const cloudinaryFileUploader = async (localFilePath)=>{
    try{
        if(!localFilePath) return null;
        const response = cloudinary.uploader.upload(localFilePath,{resource_type:auto })
        console.log(`file is successfully uploaded on cloudinary. ${response}`);
        return response;
    }catch(error){
        fs.unlinkSynk(localFilePath)
    }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage, })