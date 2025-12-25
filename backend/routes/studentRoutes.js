const express = require("express");
const router = express.Router();
const { applyLeave } = require("../controllers/studentController");
const authStudent = require("../middleware/studentAuthMiddleware");

router.post("/apply-leave", authStudent, applyLeave);

module.exports = router;
