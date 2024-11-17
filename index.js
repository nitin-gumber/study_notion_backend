const express = require("express");
// cors middleware to allow cross-origin requests
const cors = require("cors");

const app = express();

// Import the required routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactUsRoutes = require("./routes/Contact");

// Cookie parser middleware to parse the cookies
const cookieParser = require("cookie-parser");

// File upload middleware to upload files
const fileUpload = require("express-fileupload");

// Cloudinary middleware to connect to cloudinary
const { connectCloudinary } = require("./config/cloudinary");

// dotenv middleware to access the environment variables
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to database
const { connectDB } = require("./config/database");
connectDB();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static("public")) 
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connect to cloudinary
connectCloudinary();

// Routes
app.use("/api/v1_102024/auth", userRoutes);
app.use("/api/v1_102024/payment", paymentRoutes);
app.use("/api/v1_102024/profile", profileRoutes);
app.use("/api/v1_102024/course", courseRoutes);
app.use("/api/v1_102024/reach", contactUsRoutes);

// default route
app.get("/", (req, res) => {
  res.send("Welcome to the eLearning platform");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
