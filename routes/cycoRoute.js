const express = require("express");
const router = express.Router();
const { register, VerifyOtp, createLicinece, createCinic, createPdf } = require("../Controller/cycoController");
const { ImgResize, imagePhotoUpload, nicImgResize, imagePhotoUpload1, upload } = require("../middleware/utils/UploadImages");


router.route("/cyco/register").post(register);
router.route("/cyco/verify").post(VerifyOtp);
router.route("/cyco/licience").post(imagePhotoUpload1.single("image"), ImgResize, createLicinece);
router.route("/cyco/cinic").post(imagePhotoUpload.array("images", 2), nicImgResize, createCinic);
router.route("/cyco/pdf").post(imagePhotoUpload1.single("image"), ImgResize, createPdf);


module.exports = router;