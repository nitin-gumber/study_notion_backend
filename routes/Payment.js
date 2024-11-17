const express = require("express");
const router = express.Router();

// Import the required controllers and middlewares for the user routes
const {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/Payment");

// Import the required middlewares for the user routes
const { auth, isStudent } = require("../middlewares/auth");

// **************************************************************************************
//                            Payment Routes
// **************************************************************************************

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

module.exports = router;
