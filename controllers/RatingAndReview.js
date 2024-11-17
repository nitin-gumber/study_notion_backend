const mongoose = require("mongoose");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

// ************************* createRatingAndReview *************************
exports.createRatingAndReview = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body;
    const userId = req.user.id;

    if (!courseId || !userId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // check if user is enrolled in the course or not to give review
    const courseDetails = await Course.find({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course, please enroll first",
      });
    }

    // check if user already reviewed the course or not
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    }).exec();

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    // create the rating and review
    const ratingAndReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // update the course rating and review
    await Course.findOneAndUpdate(
      { _id: courseId },
      {
        $push: { ratingAndReview: ratingAndReview._id },
      },
      { new: true }
    ).exec();

    // return response to user
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      data: ratingAndReview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal error while create rating and review",
      error: error.message,
    });
  }
};

// ************************* getAverageRating *************************
exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId(courseId),
        },
      },

      // group the rating and calculate the average rating of the course
      {
        $group: {
          // group by course_id
          _id: null,
          averageRating: { $avg: "$rating" }, // calculate average rating
        },
      },
    ]);

    // return rating to user
    if (result > 0) {
      return res.status(200).json({
        success: true,
        message: "Average rating fetched successfully",
        averageRating: result[0].averageRating,
      });
    } else {
      return res.status(200).json({
        message: "Average rating is 0, no ratings given till now",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal error while get average rating",
      error: error.message,
    });
  }
};

// ************************* getAllRatingAndReview *************************\
exports.getAllRating = async (req, res) => {
  try {
    const allRating = await RatingAndReview.find({})
      .sort({ rating: -1 }) // sort the rating in descending order
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    // check if rating is available or not  in the database
    if (!allRating) {
      return res.status(400).json({
        success: false,
        message: "Rating not found",
      });
    }

    // return response to user
    return res.status(200).json({
      success: true,
      message: "All Rating return Successfully",
      data: allRating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal error while get all rating",
      error: error.message,
    });
  }
};
