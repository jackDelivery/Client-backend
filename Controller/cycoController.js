const { CycoModel } = require("../model/userCycoModel");
const asyncHandler = require('express-async-handler')
const nodemailer = require("nodemailer");
const { sendToken } = require("../middleware/utils/SendToken");
const randomString = require("randomstring");
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const CloudUploadImage = require("../utils/Cloudniary");
const fs = require("fs");
const serviceAccount = require('../firebaseAdminSdk.json');
const firebase = require('firebase-admin');
const path = require("path")



firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: 'gs://clientbackend-b2661.appspot.com'
});

const bucket = firebase.storage().bucket();



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
        const newUser = new CycoModel({ email, password, otp, isVerified: false });

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


// verify otp

const VerifyOtp = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;

        const existingOTP = await CycoModel.findOne({ email, otp });

        if (!existingOTP) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        // Delete only the OTP entry
        await CycoModel.updateOne(
            { email },
            { $set: { isVerified: true }, $unset: { otp: 1 } }
        );

        const mailOptions = {
            from: process.env.user,
            to: email,
            subject: 'Verified',
            text: `Otp Verification Completed`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to send verification email.' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'OTP verified successfully.' });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error verifying OTP.' });
    }
});

const createLicinece = asyncHandler(async (req, res) => {
    const { licenceNumber, email } = req.body;

    if (!email && !licenceNumber) {
        return res.status(400).send("All Fields Required!")
    }

    const localPath = `public/images/${req.file.filename}`;
    console.log(localPath)

    let imgUploaded = await CloudUploadImage.cloudinaryUploadImg(localPath);
    try {

        const existingUser = await CycoModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        existingUser.licenceNumber = licenceNumber;
        existingUser.licenceImage = imgUploaded?.url

        await existingUser.save();

        res.status(200).json({ message: "User updated successfully!" });

    } catch (error) {
        res.status(500).json({ message: 'Error updating user.' });

    }
})


// create nic here
const createCinic = asyncHandler(async (req, res) => {
    const { email, cnicNumber } = req.body;

    if (!email && !cnicNumber) {
        return res.status(400).send("All Fields Required!")
    }

    try {
        const uploader = (path) => CloudUploadImage.cloudinaryUploadImg(path, 'images');
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        }

        console.log("urls", urls)
        const existingUser = await CycoModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        existingUser.cnicNumber = cnicNumber;
        existingUser.Cnicurls = urls

        await existingUser.save();

        res.status(200).json({ message: "User updated successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });

    }
})


// create pdf 
const createPdf = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body
        const localPath = `public/images/${req.file.filename}`;
        console.log(localPath)

        let imgUploaded = await CloudUploadImage.cloudinaryUploadImg(localPath);

        const existingUser = await CycoModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found!" });
        }


        existingUser.Pdfurl = imgUploaded?.url;

        await existingUser.save();

        res.status(200).send("User Updated")


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


// login



module.exports = { register, VerifyOtp, createLicinece, createCinic, createPdf }