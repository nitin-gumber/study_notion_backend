const express = require("express");
const router = express.Router();

// Import the required controllers and middlewares for the user routes
const {
  updateProfile,
  getAllUserDetails,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

const { auth, isInstructor } = require("../middlewares/auth");

// **************************************************************************************
//                            Profile Routes
// **************************************************************************************

// Delete user Account
// Coming Soon!

// Update user Profile
router.put("/updateProfile", auth, updateProfile);

// Get all user details
router.get("/getUserDetails", auth, getAllUserDetails);

// Get all user details with enrolled courses details
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

// Get all instructor courses details
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

// Export the router module for the user routes
module.exports = router;
