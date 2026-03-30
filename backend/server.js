const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

const app = express();

// ===== CREATE UPLOADS FOLDER (IMPORTANT FIX) =====
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ===== MIDDLEWARE =====
app.use(cors({
  origin: "https://hostel-leave-system.vercel.app",
  credentials: true
}));

app.use(express.json());

// ===== STATIC FILES =====
app.use("/uploads", express.static("uploads"));

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

// ===== ROUTES =====
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/warden", require("./routes/wardenRoutes"));
app.use("/api/qr", require("./routes/qrRoutes"));
app.use("/api/security", require("./routes/securityRoutes"));
app.use("/api/warden/analytics", require("./routes/wardenAnalytics"));

// ===== HEALTH CHECK (VERY USEFUL) =====
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});

// ===== START SERVER (FIXED FOR RENDER) =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});