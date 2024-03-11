require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors")
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");


// routes import here
const User = require("./routes/userRoute");
const Cyco = require("./routes/cycoRoute");

// middleware calling here
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use("*", cors());




// calling routes here
app.use(User)
app.use(Cyco)


app.get("/", (req, res) => {
  res.status(200).send("Backend Working")
})

// server start here

app.use("*", (req, res, next) => {
  res.status(400).send("Page Not Found!");
  next()
})


// database connect

const mongoURI = process.env.MONGODB;

mongoose.connect(mongoURI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch(error => {
    console.error("Error connecting to the database:", error.message);
  });

// server running

app.listen(process.env.PORT, () => {
  console.log(`Your Server is Running on this! ${PORT}`);
});
