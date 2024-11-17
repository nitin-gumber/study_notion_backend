const express = require("express");
const router = express.Router();

// Import the required controllers and middlewares for the user routes
const {
    login,
    signUp,
    sendOTP,
    changePassword,
} = require("../controllers/Auth");

const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword");

const {auth} = require("../middlewares/auth");

// ********************************************************************************************************************
//                                   Authenications Routes
// ********************************************************************************************************************

// User routes for login, signup, sendotp, and changePassword
router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", sendOTP);
router.post("/changepassword", auth, changePassword);


// ********************************************************************************************************************
//                                   Reset Password Routes
// ********************************************************************************************************************
// Routes for generating a reset password token 
router.post("/reset-password-token", resetPasswordToken);
// Routes for resetting user's password after verifying the token
router.post("/reset-password", resetPassword);

// Export the router module for the user routes
module.exports = router;