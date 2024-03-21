const asyncHandler = require('express-async-handler');
const { musicModel } = require('../model/musicModel');
const CloudUploadImage = require("../utils/Cloudniary");


const createMusic = asyncHandler(async (req, res) => {


    const localPath = `public/images/${req.file.filename}`;
    console.log(localPath)

    let imgUploaded = await CloudUploadImage.cloudinaryUploadImg(localPath);

    try {
        const { title } = req.body;
        const newMusic = new musicModel({
            title,
            artist,
            url: req.file.secure_url // Cloudinary URL
        });

        console.log("newMusic:", newMusic); // Add this line for debugging

        await newMusic.save();

        res.json({ message: 'Music uploaded successfully', music: newMusic.toJSON() }); // Convert newMusic to JSON
    } catch (error) {
        console.error("Error:", error); // Add this line for debugging
        res.status(500).json({ error: error.message }); // Send error message instead of full error object
    }
});



module.exports = { createMusic }