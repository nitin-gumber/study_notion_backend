// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required middlewares
const {
  auth,
  isAdmin,
  isStudent,
  isInstructor,
} = require("../middlewares/auth");

// Import Category Controller
const {
  createCategory,
  showAllCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Import Courses Controller
const {
  createCourse,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");

// Import Section Controller
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Import Subsection Controller
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection");

// Rate Course Controller
const {
  createRatingAndReview,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");
// Import Course Progress Controller
const { updateCourseProgress } = require("../controllers/CourseProgress");

// **************************************************************************************
//                            Category Routes
// **************************************************************************************
// Category can only be created by Admin
router.post("/createCategory", auth, isAdmin, createCategory);
// Get All Category can be accessed by Admin, Instructor and Student
router.get("/showAllCategory", showAllCategory);
// Get Category Page Details can be accessed by Admin, Instructor and Student
router.post("/getCategoryPageDetails", categoryPageDetails);

// **************************************************************************************
//                            Course Routes
// **************************************************************************************
// Course can only be created by Instructor
router.post("/createCourse", auth, isInstructor, createCourse);
// Edit Course can only be edited by Instructor
router.post("/editCourse", auth, isInstructor, editCourse);
// Delete Course can only be deleted by Instructor
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);
// Get Course Details can only be accessed by Instructor and Student
router.post("/getCourseDetails", getCourseDetails);
// Get Full Course Details can only be accessed by Instructor and Student
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails);

// **************************************************************************************
//                            Section Routes
// **************************************************************************************
// Add Section to Course can only be created by Instructor
router.post("/addSection", auth, isInstructor, createSection);
// Update Section can only be updated by Instructor
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete Section can only be deleted by Instructor
router.post("/deleteSection", auth, isInstructor, deleteSection);

// **************************************************************************************
//                            Subsection Routes
// **************************************************************************************
// Add Subsection to Section can only be created by Instructor
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Update Subsection can only be updated by Instructor
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Subsection can only be deleted by Instructor
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// **************************************************************************************
//                            Rating and Review Routes
// **************************************************************************************
// Add Rating and Review can only be accessed by Instructor and Student
router.post("/createRating", auth, isStudent, createRatingAndReview);
// Get Average Rating can only be accessed by Instructor and Student
router.get("/getAverageRating", getAverageRating);
// Get All Rating can only be accessed by Instructor and Student
router.get("/getReviews", getAllRating);

// **************************************************************************************
//                            Course Progress Routes
// **************************************************************************************
// Update Course Progress can only be accessed by Instructor and Student
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// **************************************************************************************
//                            Instructor Routes
// **************************************************************************************
// Get Instructor Courses can only be accessed by Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

// Export the router module for the Category routes
module.exports = router;
