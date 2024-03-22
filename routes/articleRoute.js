const express = require("express");
const router = express.Router();
const { createArticle, getArticle, deleteArticle, getPerArticle } = require("../Controller/articleController");
const { ImgResize, imagePhotoUpload1 } = require("../middleware/utils/UploadImages");




router.route("/article").post(imagePhotoUpload1.single("image"), ImgResize, createArticle);

router.route("/articles").get(getArticle);

router.delete("/article/:id", deleteArticle);
router.get("/article/:id", getPerArticle);








module.exports = router;