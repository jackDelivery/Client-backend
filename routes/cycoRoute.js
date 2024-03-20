const express = require("express");
const router = express.Router();
const { register, VerifyOtp, createLicinece, createCinic, createPdf, ForgetPassword, ResetPassword, login, CreateAge, AdminApproved, users, adminApprovedGet, AdminDeleteUsers } = require("../Controller/cycoController");
const { ImgResize, imagePhotoUpload, nicImgResize, imagePhotoUpload1, upload } = require("../middleware/utils/UploadImages");
const { isAdminApproved, CycoauthMiddleware, isAdmin } = require("../middleware/Auth/authMiddleware")



router.route("/cyco/register").post(register);
router.route("/cyco/verify").post(VerifyOtp);
router.route("/cyco/forgetPassword").post(ForgetPassword);
router.route("/cyco/resetPassword").post(ResetPassword);
router.route("/cyco/login").post(isAdminApproved, login);
router.route("/cyco/login/approved").put(AdminApproved);
router.route("/cyco/age-gender").post(CreateAge);
router.route("/cyco/users").get(users);
router.route("/cyco/approveds").get(adminApprovedGet);
router.route("/cyco/user/:id").delete(AdminDeleteUsers);

router.route("/cyco/licience").post(imagePhotoUpload1.single("image"), ImgResize, createLicinece);
router.route("/cyco/cinic").post(imagePhotoUpload.array("images", 2), nicImgResize, createCinic);
router.route("/cyco/pdf").post(imagePhotoUpload1.single("image"), ImgResize, createPdf);


module.exports = router;