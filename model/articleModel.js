// models/Music.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: "https://contenthub-static.grammarly.com/blog/wp-content/uploads/2022/08/BMD-3398.png"
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
