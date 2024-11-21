const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");
const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { deleteAssetsFromCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");

// ************************* create Course *************************
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the details of the course from the request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    // Get the thumbnail image from the request
    const thumbnail = req.files.thumbnailImage;

    // Parse the tag and instructions from the request body to JSON
    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }

    // Check if the user is an instructor or not
    const instructorDetails = await User.findOne({
      _id: userId,
      accountType: "Instructor", // Ensure only Instructors are allowed
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      });
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }

    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.CLOUDINARY_FOLDER_NAME
    );

    // Create the new course in the database with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    });

    // Add the new course to the Instructor's courses array
    await User.findByIdAndUpdate(
      instructorDetails._id,
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // Add the new course to the Category's course array
    await Category.findByIdAndUpdate(
      categoryDetails._id,

      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// ************************* edit Course *************************
// Function to edit a course
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // First of all if the course thumanail is updated then delete the previous thumbnail
    if (req.files) {
      if (req.files.thumbnailImage) {
        // Delete the thumbnail image from Cloudinary extract the publicId from the URL
        const publicId = course.thumbnail.split("/").pop().split(".")[0];
        await deleteAssetsFromCloudinary(
          publicId,
          process.env.CLOUDINARY_FOLDER_NAME,
          "image"
        );
      }
    }

    // Upload the new thumbnail image to Cloudinary and update the course thumbnail
    if (req.files) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.CLOUDINARY_FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    // Save the updated course to the database
    await course.save();

    // Return the updated course details
    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetials",
        },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ************************* get All Courses *************************
exports.getAllCourses = async (req, res) => {
  try {
    // Find all courses in the database and populate the instructor field
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReview: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor:")
      .exec();

    // Return response if courses are not available
    return res.status(200).json({
      success: true,
      message: "All Courses return Successfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal error while get all courses",
      error: error.message,
    });
  }
};

// ************************* get Course Details *************************
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course details from the database and populate the instructor field and course content
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetials",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // Total duration of the course in seconds and convert it to duration format
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    // Return the course details and total duration
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ************************* get Instructor Course *************************
exports.getInstructorCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all courses of the specific instructor
    const instructorCourses = await Course.find({ instructor: userId })
      .sort({ createdAt: -1 }) // sort the courses in descending order of creation date
      .exec();

    // return response if courses are not available
    if (!instructorCourses) {
      return res.status(404).json({
        success: false,
        message: "Courses not found",
      });
    }

    // return response if courses are available
    return res.status(200).json({
      success: true,
      message: "Instructor Courses return Successfully",
      data: instructorCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal error while get instructor courses",
      error: error.message,
    });
  }
};

// ************************* get full Course Details *************************
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Find the course details from the database and populate the instructor field and course content
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Find the course progress of the user in the course
    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    // Return response if course details are not available
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // Total duration of the course in seconds and convert it to duration format and get the completed videos
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    // Convert the total duration to duration format and return the course details and total duration
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ************************* Delete Course *************************
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course from the database
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    await Promise.all(
      studentsEnrolled.map((studentId) =>
        User.findByIdAndUpdate(studentId, { $pull: { courses: courseId } })
      )
    );

    // Delete the course thumbnail
    if (course.thumbnail) {
      try {
        const publicId = course.thumbnail.split("/").pop().split(".")[0];
        await deleteAssetsFromCloudinary(
          publicId,
          process.env.CLOUDINARY_FOLDER_NAME,
          "image"
        );
      } catch (err) {
        console.error("Error deleting thumbnail:", err.message);
      }
    }

    // Delete all subsections and sections
    await Promise.all(
      course.courseContent.map(async (sectionId) => {
        const section = await Section.findById(sectionId);
        if (section) {
          await SubSection.deleteMany({ _id: { $in: section.subSection } });
        }
        await Section.findByIdAndDelete(sectionId);
      })
    );

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// *************************  Mark Lecture as Completed *************************
exports.markLectureAsCompleted = async (req, res) => {
  const { courseId, subSectionId, userId } = req.body;

  // Check if all the required fields are present
  if (!courseId || !subSectionId || !userId) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    // Check if the course progress already exists for the user
    progressAlreadyExists = await CourseProgress.findOne({
      userID: userId,
      courseID: courseId,
    });

    // If the course progress does not exist, create a new course progress for the user
    const completedVideos = progressAlreadyExists.completedVideos;
    if (!completedVideos.includes(subSectionId)) {
      await CourseProgress.findOneAndUpdate(
        { userID: userId, courseID: courseId },
        {
          $push: { completedVideos: subSectionId },
        }
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Lecture already completed",
      });
    }

    // Update the course progress with the new completed video
    await CourseProgress.findOneAndUpdate(
      { userID: userId, courseID: courseId },
      {
        completedVideo: completedVideos,
      }
    );

    // Return response if the lecture is marked as completed
    return res.status(200).json({
      success: true,
      message: "Lecture marked as completed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal error while mark lecture as completed",
      error: error.message,
    });
  }
};
