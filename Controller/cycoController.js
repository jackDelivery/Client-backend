const { CycoModel } = require("../model/userCycoModel");
const { userModel } = require("../model/userModel");

const asyncHandler = require('express-async-handler')
const nodemailer = require("nodemailer");
const { sendToken } = require("../middleware/utils/SendToken");
const randomString = require("randomstring");
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const CloudUploadImage = require("../utils/Cloudniary");
const fs = require("fs");


const path = require("path")






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

    const otp = generateOTP();

    try {
        const { email, password } = req.body;

        if (!email && !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await CycoModel.findOne({ email });
        const existingUser2 = await userModel.findOne({ email });



        if (existingUser !== existingUser2) {
            throw new Error("user with this email already exit as patient or psychologist")
        }




        if (existingUser && existingUser.otp) {
            return res.status(200).send('OTP already sent recently. Please check your email.');
        }

        // Save user to database with OTP creation timestamp
        const newUser = new CycoModel({ email, password, otp, isVerified: false });
        console.log(newUser)
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


// create age gender

const CreateAge = asyncHandler(async (req, res) => {
    const { email, age, gender } = req.body;

    if (!email && !age && !gender) {
        return res.status(400).send("All Fields Required!")
    }

    try {
        const existingUser = await CycoModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        existingUser.age = age;
        existingUser.gender = gender;

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
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            res.status(400).json({ message: "All Fields are Required" });
            return;
        }

        const user = await CycoModel.findOne({ email });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Compare entered password with the password in the database
        if (password !== user.password) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }


        if (user.isVerified !== true) {
            setTimeout(async () => {
                await CycoModel.deleteMany({ email: user?.email });
            }, 60000); // 60000 milliseconds = 1 minute
        }

        if (user.isVerified !== true) {
            throw new Error("Your account is not verify please verify your account via otp")
        }


        const mailOptions = {
            from: process.env.user,
            to: user.email,
            subject: 'Welcome back ' + user?.email,
            text: `Congratulations`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                // Handle error
            } else {
                console.log('Email sent: ' + info.response);
                // Handle success
            }
        });

        sendToken(res, user, 200, "Login Successfully");

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error?.message });
    }
});



// Function to send email with OTP
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.user,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject('Failed to send OTP.');
            } else {
                console.log('Email sent: ' + info.response);
                resolve('OTP sent successfully.');
            }
        });
    });
};


// forget Password

const ForgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await CycoModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to user
    user.resetToken = otp;
    user.resetTokenExpiration = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    await user.save();

    // Send OTP via email
    try {
        await sendOTPEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully.', otp: otp });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
});




// reset Password

const ResetPassword = asyncHandler(async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find user in the database
        const user = await CycoModel.findOne({ email, resetToken: otp });

        if (!user) {
            return res.status(401).json({ message: 'Invalid OTP or OTP expired.' });
        }

        user.password = newPassword;
        user.resetToken = '';
        await user.save();
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        // Save updated user
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// admin approved

const AdminApproved = asyncHandler(async (req, res) => {

    const { isApproved, _id } = req.body;

    try {

        const approved = await CycoModel.findByIdAndUpdate(_id, {
            isApproved: isApproved
        }, { new: true })

        if (!approved) {
            throw new Error("User Not Found")
        }


        res.status(200).json({ message: "Admin Approved Your Account", approved: approved });



        const mailOptions = {
            from: process.env.user,
            to: approved?.email,
            subject: 'Admin Approved Your Account ' + approved?.email,
            text: `isApproved ${approved?.isApproved}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                // Handle error
            } else {
                console.log('Email sent: ' + info.response);
                // Handle success
            }
        });




    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


const adminApprovedGet = asyncHandler(async (req, res) => {
    try {

        let result = await CycoModel.find({});

        if (!result) {
            throw new Error("user not found!")
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


// delete activate users

const AdminDeleteUsers = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assuming id is passed as a parameter

    try {
        const deletedUser = await CycoModel.findByIdAndDelete(id); // Using id parameter to find and delete user

        if (!deletedUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // Send response if user is successfully deleted
        res.status(200).json({ message: "Admin has deleted the user account" });

        // If you want to send an email notification to the deleted user, you can uncomment the following code

        const mailOptions = {
            from: process.env.user,
            to: deletedUser.email,
            subject: 'Your Account has been Deleted',
            text: 'Your account has been deleted by the admin.'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                // Handle error
            } else {
                console.log('Email sent: ' + info.response);
                // Handle success
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = AdminDeleteUsers;





// users

const users = asyncHandler(async (req, res) => {
    try {

        const users = await CycoModel.find({});


        if (!users) {
            throw new Error("user not found");
        }

        res.status(200).send(users)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



// admin

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user with given email exists
    const findAdmin = await CycoModel.findOne({ email });

    // If no user found, or user is not admin, throw an error
    if (!findAdmin) {
        throw new Error("User not found");
    } else if (findAdmin.role !== "admin") {
        throw new Error("You are not Admin");
    }

    // If user is admin, compare passwords
    if (password === findAdmin.password) {
        // Passwords match, send token and success response
        sendToken(res, findAdmin, 200, "Login Successfully");
        res.status(200).send(findAdmin);
    } else {
        // Passwords don't match, throw an error
        throw new Error("Invalid Credentials");
    }
});



module.exports = { register, VerifyOtp, createLicinece, createCinic, createPdf, login, ForgetPassword, ResetPassword, CreateAge, AdminApproved, users, adminApprovedGet, AdminDeleteUsers, loginAdmin }