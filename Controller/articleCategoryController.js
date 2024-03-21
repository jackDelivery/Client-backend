const asyncHandler = require("express-async-handler");
const { articleCategoryModel } = require("../model/categoryModel");


// create category

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await articleCategoryModel.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

// update category

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCategory = await articleCategoryModel.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
});


// delete category

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCategory = await articleCategoryModel.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
});


// get category id

const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getaCategory = await articleCategoryModel.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
});



// get all category

const getallCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await articleCategoryModel.find();
        res.json(getallCategory);
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory,
};