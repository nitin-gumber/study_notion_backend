const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      Index: true,
    },

    password: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    approved: {
      type: Boolean,
      default: true,
    },

    additionalDetials: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    token: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },

    image: {
      type: String,
      required: true,
    },

    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],
  },
  { timestamps: true } // Add timestamps for when the document is created and modified
);

module.exports = mongoose.model("User", userSchema);
