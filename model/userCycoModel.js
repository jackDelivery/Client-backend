
const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const fs = require("fs");


// Ek regular expression to validate email addresses
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



const CycoSchema = new Schema({
    email: {
        type: String,
        trim: true,
        // Yeh to make sure ke email unique hai
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
    role: {
        type: String,
        default: "user"
    },
    cnicNumber: {
        type: String,
        trim: true
    },
    Cnicurls: [],
    Pdfurl: {
        type: String,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false // Default value set kiya gaya hai false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    licenceNumber: {
        type: String,
        default: "",
        trim: true
    },
    licenceImage: {
        type: String,
        default: "",
    },
    otpCreatedAt: { type: Date, default: Date.now },

    otp: String,

    resetToken: String,
    resetTokenExpiration: Date,



})



CycoSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT, {
        expiresIn: "24h", // expires in 24 hours
    });
};



const CycoModel = mongoose.model("CYCOUSER", CycoSchema);

module.exports = { CycoModel }

