const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware"); // ✅ ADD THIS

const {
  login,
  studentSignup
} = require("../controllers/authController");

// Login (unchanged)
router.post("/login", login);

// ✅ Student signup with ID card upload
router.post(
  "/student-signup",
  upload.single("idCardPhoto"),
  studentSignup
);

module.exports = router;
