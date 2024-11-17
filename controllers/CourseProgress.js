const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;

  try {
    // Check if the subSection exists in the database
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Check if the user has already completed the course or not
    let courseProgress = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course Progress not found",
      });
    } else {
      // Check for re-completion of the same subSection
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res.status(400).json({
          success: false,
          message: "SubSection already completed",
        });
      }

      // Update the courseProgress
      courseProgress.completedVideos.push(subSectionId);
    }
    await courseProgress.save();

    // Return response
    return res.status(200).json({
      success: true,
      message: "Lecture Completed Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
