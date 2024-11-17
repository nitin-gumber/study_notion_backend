const User = require("../models/User.js");
const Profile = require("../models/Profile.js");
const Course = require("../models/Course.js");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration.js");
const CourseProgress = require("../models/CourseProgress.js");

// *************** Update Profile ***************
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      gender = "",
      contactNumber = "",
    } = req.body;

    // extract UserId from middleware
    const userId = req.user.id;

    //  find User and Profile Details
    const userDetails = await User.findById(userId);
    const profile = await Profile.findById(userDetails.additionalDetials);

    // check user is exist or not in DB
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user details in DB
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { firstName, lastName }
    );

    await user.save();

    // Update the profile details in DB
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    // save the profile
    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(userId)
      .populate("additionalDetials")
      .exec();

    // return response with updated user details
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: updatedUserDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error occur while updated the Profile",
      error: error.message,
    });
  }
};

// *************** delete Account***************
// Pending ==> Coming Soon!

// *************** Get All User Details ***************
exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId)
      .populate("additionalDetials")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User Details Fetched Successfully",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error occur while fetching the User Details",
      error: error.message,
    });
  }
};

// *************** get Enrolled Course ***************
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    userDetails = userDetails.toObject(); // Convert Mongoose document to plain JS object to modify it

    // Calculate the total duration of the course and progress percentage
    let SubsectionLength = 0;
    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }

    // Return response with enrolled courses
    return res.status(200).json({
      success: true,
      message: "Enrolled Courses Fetched Successfully",
      data: {
        enrolledCourses: userDetails,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error occur while fetching the Enrolled Courses",
      error: error.message,
    });
  }
};

// *************** Update Profile Image ***************
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayProfilePicture = req.files.displayPicture;
    const userId = req.user.id;

    // check if image is uploaded or not by user
    if (!displayProfilePicture) {
      return res.status(400).json({
        success: false,
        message: "Image field required",
      });
    }

    // find user details
    const userDetails = await User.findById(userId);

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // upload image to cloudinary
    const image = await uploadImageToCloudinary(
      displayProfilePicture,
      process.env.CLOUDINARY_FOLDER_NAME
    );

    // update the profile image
    const updatedProfileImage = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile Image Updated Successfully",
      data: updatedProfileImage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error occur while updated the Profile Image",
      error: error.message,
    });
  }
};

// *************** Instructure DashBoard ***************
exports.instructorDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const courseData = await Course.find({ instructor: userId });
    const courseDetails = courseData.map((course) => {
      totalStudents = course?.studentsEnrolled?.length;
      totalRevenue = course?.price * totalStudents;

      // return the course details with total students and total revenue
      const courseStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudents,
        totalRevenue,
      };
      return courseStats;
    });

    // return response with course details
    return res.status(200).json({
      success: true,
      message: "Instructor Dashboard Fetched Successfully",
      data: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error occur while fetching the Instructor Dashboard",
      error: error.message,
    });
  }
};
