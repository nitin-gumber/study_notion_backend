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
        message: "Email Required",
      });
    }

    // check if the user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // generate token and update the user details with token and expiry time
    const token = crypto.randomBytes(20).toString("hex");
    await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 600000, // 10 minutes
      },
      { new: true }
    );

    // create url for the reset password
    const url = `https://studynotion-online.vercel.app/${token}`;

    // send the mail to the user
    await mailSender(
      email,
      "Reset Your Password",
      `
      Dear User,
    
      We received a request to reset your password for your account. Please click the link below to reset your password:
    
      ${url}
    
      If you did not request a password reset, please ignore this email or contact our support team immediately.
    
      For security reasons, this link will expire in 10 min.
    
      Best regards,  
      The StudyNotion Team  
      Email: studynotionceo@gmail.com  
      Website: https://studynotion-online.vercel.app/  
      `
    );

    // return response to user with success message
    return res.status(200).json({
      success: true,
      message: "Email sent successfully, please check your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending email",
      error: error.message,
    });
  }
};

// *************** Update / Reset Password ***************
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // check if password and confirm password is provided or not
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password field required",
      });
    }

    // validate the password
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password must match, Please try again",
      });
    }

    // check if token is valid
    const userDetails = await User.findOne({ token });

    // check if token is valid
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token",
      });
    }

    // check if token is expired
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token Expired",
      });
    }

    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update the password
    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword },
      { new: true }
    );

    // send email to user for password update
    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating password",
      error: error.message,
    });
  }
};
