require("dotenv").config();
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// *************** Sign Up ***************
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // check if email is provided
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Now, check if password and confirmPassword are same or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password should be same",
      });
    }

    // Check if User already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is Already Registered, Please Login",
      });
    }

    // find most recent OTP stored for the user
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1); // sort in descending order and get the latest OTP stored
    if (response.length === 0) {
      // OTP not found for the user
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is incorrect",
      });
    }

    // Hash the Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    let approved = "";
    approved === "Instuctor" ? (approved = false) : (approved = true);

    // create entry in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetials: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}+${lastName}`,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User can't be registered, Please try again",
      error: err.message,
    });
  }
};

// *************** Login ***************
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user is registered or not
    const user = await User.findOne({ email }).populate("additionalDetials");
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User is not registered, Please Sign Up",
      });
    }

    // check if password is correct or not using bcrypt compare method
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
          accountType: user.accountType,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // remove password from user object and add token to user object for response
      user.token = token;
      user.password = undefined;

      // set cookie in response header for client
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 1 day
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Login Failed, Please try again",
      error: err.message,
    });
  }
};

// *************** Send OTP ***************
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // check if user already exist with this email
    const user = await User.findOne({
      email: email,
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email, Please Login",
      });
    }

    // generate OTP using otp-generator
    let otp = otpGenerator.generate(6, {
      upperCase: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    // check if OTP already exist in DB or not
    const result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCase: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false,
      });
    }

    // send OTP to user's email using mailSender function
    const otpBody = await OTP.create({
      email: email,
      otp: otp,
    });

    // send email to user with OTP
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: otpBody,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending OTP",
      error: error.message,
    });
  }
};

// *************** Change Password ***************
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findOne({ _id: req.user.id });
    const { oldPassword, newPassword } = req.body;

    // check if all fields are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if old password and new password are same or not
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password should not be same",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old Password is incorrect",
      });
    }

    // encrypt the new password using bcrypt hash method
    const encryptPassword = await bcrypt.hash(newPassword, 10);

    // update the password in DB
    const updatedUserDetails = await User.findByIdAndUpdate(
      { _id: req.user.id },
      { password: encryptPassword },
      { new: true }
    );

    // send email to user
    try {
      const emailResponse = await mailSender(
        userDetails.email,
        "Password Updated",
        passwordUpdated(updatedUserDetails.firstName)
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while sending email",
        error: error.message,
      });
    }

    // return response to user after updating the password
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Password can't be changed, Please try again",
      error: err.message,
    });
  }
};
