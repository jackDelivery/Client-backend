const { Schema, default: mongoose, Model } = require("mongoose");
const jwt = require("jsonwebtoken");
const fs = require("fs");


// Ek regular expression to validate email addresses
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



const CycoSchema = new Schema({
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
    role: {
        type: String,
        default: "user"
    },
    cnicNumber: {
        type: Number,
        unique: true,
        trim: true
    },
    Cnicurls: [String],
    Pdfurl: [{
        name: String,
        url: String,
    }],
    isVerified: {
        type: Boolean,
        default: false // Default value set kiya gaya hai false
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



},
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    }
)



CycoSchema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT, {
        expiresIn: "24h", // expires in 24 hours
    });
};



const CycoModel = mongoose.model("CYCOUSER", CycoSchema);

module.exports = { CycoModel }

