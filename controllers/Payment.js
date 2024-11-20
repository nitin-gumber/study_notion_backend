const mongoose = require("mongoose");
const crypto = require("crypto");
const instance = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const mailSender = require("../utils/mailSender");
const {
  courseEnrolledEmail,
} = require("../mail/templates/courseEnrolledEmail");
const {
  paymentSuccessfully,
} = require("../mail/templates/paymentSuccessfully");
const CourseProgress = require("../models/CourseProgress");

// *************** Create Payment ***************
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  // Check if the user is authenticated or not
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" });
  }

  let total_amount = 0;

  for (const course_id of courses) {
    try {
      // Find the course by its ID
      const course = await Course.findById(course_id);

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Could not find the Course" });
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(409)
          .json({ success: false, message: "Student is already Enrolled" });
      }

      // Add the price of the course to the total amount
      total_amount += course.price;
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  const options = {
    amount: total_amount * 100, // Amount is in paise like 100 paise == 1 INR
    currency: "INR",
    receipt: `receipt_${Math.floor(Math.random() * 1000000)}`,
  };

  try {
    // Create a new order using the Razorpay instance
    const paymentResponse = await instance.orders.create(options);

    res.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not initiate order.",
      error: error.message,
    });
  }
};

// *************** Verify Signature of Razorpay and Server ***************
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;

  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  // Create the body of the message to be verified by Razorpay
  let body = razorpay_order_id + "|" + razorpay_payment_id;

  // Create the expected signature using the Razorpay secret key and the body
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

// *************** Send Email Success Payment ***************
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    // Send the email to the enrolled student using the mailSender function
    await mailSender(
      enrolledStudent.email,
      `Payment Sucessfully`,
      paymentSuccessfully(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    });
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }

      // Create a new course progress for the student
      const courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideos: [],
      });
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      // Send an email notification to the enrolled student
      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrolledEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};
