const express = require("express");
const router = express.Router();
const { register } = require("../Controller/cycoController");



router.route("cyco/register").post(register);





module.exports = router;