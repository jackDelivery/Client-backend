const express = require("express");
const { CreateUser, login, VerifyOtp, allRegisterUser, ForgetPassword,ResetPassword } = require("../Controller/userController");
const router = express.Router();


// singup
router.route("/user/register").post(CreateUser);
router.route("/user/login").post(login);
router.route("/user/verify").post(VerifyOtp);
router.route("/user/updatedUser").post(allRegisterUser);
router.route("/user/forgetPassword").post(ForgetPassword);
router.route("/user/resetPassword").post(ResetPassword);


module.exports = router