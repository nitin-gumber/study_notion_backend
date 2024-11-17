const mongoose = require("mongoose");
require("dotenv").config();

// ************ Connect to MongoDB ************
exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_DATABASE_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("MongoDB Connection Failed");
    console.error(err);
    process.exit(1); // Exit process with failure
  }
};
