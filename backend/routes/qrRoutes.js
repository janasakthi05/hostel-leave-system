const express = require("express");
const router = express.Router();
const { generateQR } = require("../controllers/qrController");
const authStudent = require("../middleware/studentAuthMiddleware");

router.get("/generate/:leaveId", authStudent, generateQR);

module.exports = router;
