const express = require("express");
const router = express.Router();

// Import the required controllers and middlewares for the user routes

const { auth, isInstructor, isStudent } = require("../middlewares/auth");

const { contactUsController } = require("../controllers/ContactUs");

// **************************************************************************************
//                            Contact Us Routes
// **************************************************************************************

router.post("/contact", auth, isStudent, isInstructor, contactUsController);

module.exports = router;
