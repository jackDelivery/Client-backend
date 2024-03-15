const express = require("express");
const router = express.Router();
const { register, VerifyOtp, createLicinece, createCinic, createPdf, ForgetPassword, ResetPassword, login, CreateAge } = require("../Controller/cycoController");
const { ImgResize, imagePhotoUpload, nicImgResize, imagePhotoUpload1, upload } = require("../middleware/utils/UploadImages");
const { isAdminApproved } = require("../middleware/Auth/authMiddleware")



router.route("/cyco/register").post(register);
router.route("/cyco/verify").post(VerifyOtp);
router.route("/cyco/forgetPassword").post(ForgetPassword);
router.route("/cyco/resetPassword").post(ResetPassword);
router.route("/cyco/login").post( login);
router.route("/cyco/age-gender").post(CreateAge);

router.route("/cyco/licience").post(imagePhotoUpload1.single("image"), ImgResize, createLicinece);
router.route("/cyco/cinic").post(imagePhotoUpload.array("images", 2), nicImgResize, createCinic);
router.route("/cyco/pdf").post(imagePhotoUpload1.single("image"), ImgResize, createPdf);


module.exports = router;