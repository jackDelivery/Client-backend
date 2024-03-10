const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Ek regular expression to validate email addresses
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        unique: true, // Yeh to make sure ke email unique hai
        lowercase: true, // Yeh to make sure ke email case-insensitive hai
        validate: {
            validator: function (v) {
                return emailRegex.test(v); // Email address ko validate karne ke liye regular expression use kiya gaya hai
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        trim: true,
    },
    age: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },

    selectModeules: {
        type: String,
        trim: true,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false // Default value set kiya gaya hai false
    },
    // verificationToken: {
    //     type: String
    // }

    otpCreatedAt: { type: Date, default: Date.now },

    otp: String,

    resetToken: String,
    resetTokenExpiration: Date,

})


// Schema mein pre-save hook to generate a verification token

// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();

//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);

//         // Generate a verification token
//         const token = crypto.randomBytes(20).toString('hex');
//         this.verificationToken = token;
//     } catch (err) {
//         return next(err);
//     }
// });

// // match password
// UserSchema.methods.isPasswordmatch = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };


UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT, {
        expiresIn: "24h", // expires in 24 hours
    });
};


const userModel = mongoose.model("USER", UserSchema);

module.exports = { userModel }