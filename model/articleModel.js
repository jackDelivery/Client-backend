// models/Music.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    image: {
        type: String
    },
    message: {
        type: String,
        trim: true
    },
    category: {
        type: String
    }
});

const articleModel = mongoose.model('ARTICLE', articleSchema)

module.exports = { articleModel };
