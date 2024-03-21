// models/Music.js
const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    title: {
        type: String
    },
    image: {
        type: String,
        default: "https://e7.pngegg.com/pngimages/726/962/png-clipart-music-digital-audio-mp3-android-electronic-device-audio-equipment-thumbnail.png"
    },
    url: String // URL of the music file
});

const musicModel = mongoose.model('Music', musicSchema)

module.exports = { musicModel };
