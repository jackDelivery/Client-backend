const express = require("express");
const router = express.Router();
const { createArticle, getArticle } = require("../Controller/articleController");
const { ImgResize, imagePhotoUpload1 } = require("../middleware/utils/UploadImages");




router.route("/article").post(imagePhotoUpload1.single("image"), ImgResize, createArticle);

router.route("/articles").get(getArticle);








module.exports = router;