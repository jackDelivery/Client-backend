const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const multerStorage = multer.memoryStorage();

const storagePdf = multer.memoryStorage();
const upload = multer({ storage: storagePdf });






const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/images"));
    },
    filename: function (req, file, cb) {
        const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
    },
});

// file type checking

const multerFilter = (req, file, cb) => {
    //check file type
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        //rejected files
        cb(
            {
                message: "Unsupported file format",
            },
            false
        );
    }
};



const imagePhotoUpload = multer({
    storage: storage,
    fileFilter: multerFilter,
    limits: { fileSize: 10000000 }, // 10 MB
});

const imagePhotoUpload1 = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000 },
});


console.log(imagePhotoUpload1)


//   Image Resizing

const ImgResize = async (req, res, next) => {
    // check if there is no file
    if (!req.file) return next();

    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

    await sharp(req.file.buffer)
        .resize(250, 250)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(path.join(`public/images/${req.file.filename}`));

    next();
};


// nic image function

// require("../../public/images/nic")
const nicImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/nic/${file.filename}`);
            // fs.unlinkSync(`public/images/products/${file.filename}`);
        })
    );
    next();
};





module.exports = { ImgResize, nicImgResize, imagePhotoUpload, imagePhotoUpload1, upload };