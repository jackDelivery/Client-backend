const { CycoModel } = require("../model/userCycoModel");
const asyncHandler = require('express-async-handler')
const nodemailer = require("nodemailer");
const { sendToken } = require("../middleware/utils/SendToken");
const randomString = require("randomstring");
const bcrypt = require("bcrypt")
const crypto = require("crypto")


// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
});



// Generate OTP function
function generateOTP() {
    return randomString.generate({
        length: 6,
        charset: 'numeric'
    });
}


// register
const register = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email && !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await CycoModel.findOne({ email, isVerified: false });


        if (existingUser && existingUser.otp) {
            res.status(200).send('OTP already sent recently. Please check your email.');
            return;
        }

        const otp = generateOTP();

        // Save user to database with OTP creation timestamp
        const newUser = new userModel({ email, password, otp, isVerified: false });

        await newUser.save();


        // Generate verification email
        const mailOptions = {
            from: process.env.user,
            to: newUser.email,
            subject: 'Verification OTP',
            text: `Your OTP is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Failed to send OTP.');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'OTP sent successfully.' });
            }
        });

        res.status(201).json({ message: 'User created successfully. Please check your email for Otp Verification.' });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


// verify

// login



module.exports = { register }