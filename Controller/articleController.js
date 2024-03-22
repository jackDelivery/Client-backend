const asyncHandler = require('express-async-handler')
const { articleModel } = require("../model/articleModel")
const CloudUploadImage = require("../utils/Cloudniary");
const slugify = require("slugify");




const createArticle = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    const localPath = `public/images/${req.file.filename}`;
    console.log(localPath)

    let imgUploaded = await CloudUploadImage.cloudinaryUploadImg(localPath);

    console.log(imgUploaded)

    try {

        const existingUser = await articleModel.create({
            ...req.body,
            image: imgUploaded?.url
        });

        if (!existingUser) {
            return res.status(404).json({ message: "Article not found!" });
        }

        await existingUser.save();

        res.status(200).json({ message: "Article added successfully!", existingUser });

    } catch (error) {
        res.status(500).json({ message: 'Error updating user.' });

    }
});


// get article

const getArticle = asyncHandler(async (req, res) => {
    try {
        // Get the category parameter from the request query
        const { category } = req.query;

        // Define a filter object to pass to the find method
        const filter = {};

        // If category is provided, add it to the filter
        if (category) {
            filter.category = category;
        }

        // Find articles based on the filter or fetch all articles if no filter is provided
        const data = await (category ? articleModel.find(filter) : articleModel.find({}));

        // Check if data is empty
        if (data.length === 0) {
            throw new Error("No articles found for the specified category");
        }

        res.status(200).send(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



const deleteArticle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await articleModel.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});


// get category id

const getPerArticle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getaCategory = await articleModel.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
});





module.exports = { createArticle, getArticle, deleteArticle, getPerArticle }