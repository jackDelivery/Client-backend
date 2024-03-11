const jwt = require("jsonwebtoken");
const { userModel } = require("../../model/userModel");
const { CycoModel } = require("../../model/userCycoModel");
const expressAsyncHandler = require("express-async-handler");

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


// Admin Handle Logic


const isAdmin = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await CycoModel.findOne({ email });

  if (adminUser.role !== "admin") {
    throw new Error("You are not admin ");
  } else {
    next();
  }
});


module.exports = { authMiddleware, isAdmin };