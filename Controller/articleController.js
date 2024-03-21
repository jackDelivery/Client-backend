const asyncHandler = require('express-async-handler')
const { articleModel } = require("../model/articleModel")
const CloudUploadImage = require("../utils/Cloudniary");
const slugify = require("slugify");




const createArticle = asyncHandler(async (req, res) => {
    const { title, category, message } = req.body;

    const localPath = `public/images/${req.file.filename}`;
    console.log(localPath)

    let imgUploaded = await CloudUploadImage.cloudinaryUploadImg(localPath);
    try {

        const existingUser = await articleModel.create({
            title: title,
            message: message,
            category: category,
            image: imgUploaded?.url
        });

        if (!existingUser) {
            return res.status(404).json({ message: "Article not found!" });
        }

        await existingUser.save();

        res.status(200).json({ message: "Article added successfully!" });

    } catch (error) {
        res.status(500).json({ message: 'Error updating user.' });

    }
})





module.exports = { createArticle }