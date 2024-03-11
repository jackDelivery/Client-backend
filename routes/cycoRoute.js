const express = require("express");
const router = express.Router();
const { register, VerifyOtp } = require("../Controller/cycoController");



router.route("/cyco/register").post(register);
router.route("/cyco/verify").post(VerifyOtp);




module.exports = router;