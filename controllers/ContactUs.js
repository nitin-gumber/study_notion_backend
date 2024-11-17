require("dotenv").config();
const { contactUsEmail } = require("../mail/templates/contactUsEmail");
const mailSender = require("../utils/mailSender");

// *************** Contact Us ***************
exports.contactUsController = async (req, res) => {
  const { email, firstName, lastName, message, phoneNumber, countryCode } =
    req.body;

  // Check if all required fields are present
  if (
    !email ||
    !firstName ||
    !lastName ||
    !message ||
    !phoneNumber ||
    !countryCode
  ) {
    return res.status(403).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Send Email to User (User Notification)
    await mailSender(
      email,
      "Your Data has been send to StudyNotion",
      contactUsEmail(
        email,
        firstName,
        lastName,
        message,
        phoneNumber,
        countryCode
      )
    );

    // Send Email to Admin (Admin Notification)
    await mailSender(
      process.env.MAIL_USER,
      `New Contact Us form submission from ${firstName} ${lastName}`,
      contactUsEmail(
        email,
        firstName,
        lastName,
        message,
        phoneNumber,
        countryCode
      )
    );

    // Respond back with success message
    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
