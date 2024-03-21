const express = require("express");
const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory,
} = require("../Controller/articleCategoryController");
const router = express.Router();

router.post("/category", createCategory);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);
router.get("/category/:id", getCategory);
router.get("/category", getallCategory);

module.exports = router;