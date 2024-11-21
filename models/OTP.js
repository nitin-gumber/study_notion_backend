const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailVerificationTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true, // Ensure email is unique
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Set the expiry time to 10 minutes
  },
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
  try {
    await mailSender(
      email,
      "Email Verification",
      emailVerificationTemplate(otp, email)
    );
  } catch (error) {
    throw error;
  }
}

// Define a post- save hook to send the verification email
OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Check if the document is new or not
    try {
      // Remove any existing document with the same email
      await mongoose.model("OTP").deleteOne({ email: this.email });
      await sendVerificationEmail(this.email, this.otp);
    } catch (error) {
      throw error;
    }
  }
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
