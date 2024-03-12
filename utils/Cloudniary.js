require("dotenv").config({})
const cloudinary = require("cloudinary").v2;



cloudinary.config({
    cloud_name: process.env.CloudName,
    api_key: process.env.API_key,
    api_secret: process.env.API_secret,
})

const cloudinaryUploadImg = (fileToUpload) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileToUpload, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve({
                    url: result.secure_url, // Changed 'res' to 'result.secure_url'
                    asset_id: result.asset_id,
                    public_id: result.public_id,
                });
            }
        });
    });
};


module.exports = { cloudinaryUploadImg }