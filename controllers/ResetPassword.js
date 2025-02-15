const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { validatePassword } = require("../utils/validations");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// *************** Reset Password Token ***************
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find and update user with reset token
    const token = crypto.randomBytes(20).toString("hex");
    const user = await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 600000, // 10 minutes
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Construct reset URL
    const resetUrl = `https://studynotion-online.vercel.app/update-password/${token}`;

    // Send reset password email
    mailSender(
      email,
      "Reset Your Password",
      `
      Dear ${user.firstName}, <br><br>
      Click the link below to reset your password: <br>
      <a href="${resetUrl}">${resetUrl}</a> <br><br>
      If you didn't request this, please ignore this email. <br>
      This link will expire in 10 minutes. <br><br>
      Best regards, <br>
      StudyNotion Team
      `
    ).catch((err) => console.error("Error sending mail:", err.message));

    return res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Reset Password Token Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while sending reset password email",
      error: error.message,
    });
  }
};

// *************** Update / Reset Password ***************
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password field is required",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Find user with token and check expiry
    const user = await User.findOne({ token });

    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and remove token fields
    await User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        $unset: { token: "", resetPasswordExpires: "" },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while updating password",
      error: error.message,
    });
  }
};
