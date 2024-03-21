const express = require("express");
const router = express();
// const { createMusic } = require("../Controller/musicController");
const cloudinaryUploader = require("../utils/CloudinaryMusicUpload");
const upload = require("../middleware/utils/uploadMp3");
const { musicModel } = require("../model/musicModel");
const CloudUploadImage = require("../utils/Cloudniary");
const { ImgResize, imagePhotoUpload1 } = require("../middleware/utils/UploadImages");


router.post("/uploadAudio", upload, async (req, res) => {
    try {
        const { title } = req.body
        // check for any file validation errors from multer
        if (req.fileValidationError) {
            return res
                .status(400)
                .json({ message: `File validation error: ${req.fileValidationError}` });
        }

        //   invoke the uplader function to handle the upload to cloudinary

        //   we are passing the req, and res to cloudinaryUploader function
        const audioResponse = await cloudinaryUploader(req, res);

        const saveData = musicModel({
            title: title,
            url: audioResponse?.secure_url
        })


        await saveData.save();

        return res.status(200).json({ result: saveData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get("/audios", async (req, res) => {
    try {
        let result = await musicModel.find({});

        if (!result) {
            throw new Error("Audios not found")
        }

        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



// router.route("/createmusic").post(createMusic);





module.exports = router;