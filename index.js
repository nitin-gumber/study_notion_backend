const express = require("express");

const app = express();

// Import the required routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactUsRoutes = require("./routes/Contact");

// Cookie parser middleware to parse the cookies
const cookieParser = require("cookie-parser");

// cors middleware to allow cross-origin requests
const cors = require("cors");

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

const whitelist = process.env.CORS_ORIGIN
  ? JSON.parse(process.env.CORS_ORIGIN)
  : ["*"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allowed origins
      const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

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
  return res.json({
    success: true,
    message: "Welcome to the E-Learning API",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
