const cloudinary = require("cloudinary").v2;

// ************ Connect to Cloudinary ************
exports.connectCloudinary = async () => {
  try {
    // Cloudinary Configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary Connected Successfully");
  } catch (error) {
    console.log("Error occured while connecting to Cloudinary", error);
  }
};
