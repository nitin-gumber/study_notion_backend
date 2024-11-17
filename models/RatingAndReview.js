const mongoose = require("mongoose");

// Define the RatingAndReview schema
const ratingAndReview = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true, // Indexing the course field for faster query performance
  },
});

module.exports = mongoose.model("RatingAndReview", ratingAndReview);
