const express = require("express");
const router = express.Router();

// Import the required controllers and middlewares for the user routes

const { auth } = require("../middlewares/auth");

const { contactUsController } = require("../controllers/ContactUs");

// **************************************************************************************
//                            Contact Us Routes
// **************************************************************************************

router.post("/contact", auth, contactUsController);

module.exports = router;
