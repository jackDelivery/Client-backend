const jwt = require("jsonwebtoken");
const { userModel } = require("../../model/userModel");
const { CycoModel } = require("../../model/userCycoModel");
const expressAsyncHandler = require("express-async-handler");



// patient middleware

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT);

        // find the user by id
        const user = await userModel.findById(decoded?._id);

        // attach the user to the request
        req.user = user;
        console.log(req.user);
        next();
      } else {
        res.status(404).send("There is no token attached to the header");
      }
    } catch (error) {
      res.status(401).send("No authorized token expired, login again");
    }
  } else {
    res.status(400).send("There is no token attached to the header");
  }
});



// cyco middleware
const CycoauthMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT);

        // find the user by id
        const user = await CycoModel.findById(decoded?._id);

        // attach the user to the request
        req.user = user;
        console.log(req.user);
        next();
      } else {
        res.status(404).send("There is no token attached to the header");
      }
    } catch (error) {
      res.status(401).send("No authorized token expired, login again");
    }
  } else {
    res.status(400).send("There is no token attached to the header");
  }
});




// Admin Handle Logic


const isAdmin = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await CycoModel.findOne({ email });

  if (adminUser.role !== "admin") {
    throw new Error("You are not admin!");
  } else {
    next();
  }
});


const isAdminApproved = async (req, res, next) => {
  const { email } = req.body; // Use req.user to get the logged-in user's email
  try {
    const adminUser = await CycoModel.findOne({ email });

    // if (!adminUser) {
    //   throw new Error("User not found");
    // }

    if (adminUser.isApproved !== true) {
      throw new Error("Admin not approved yet");
    }

    next(); // If everything is fine, proceed to the next middleware or route
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
``



module.exports = { authMiddleware, CycoauthMiddleware, isAdmin, isAdminApproved };