const express = require("express");
const router = express.Router();

const {
  applyLeave,
  myLeaves,
  deleteLeave
} = require("../controllers/studentController");

const authStudent = require("../middleware/studentAuthMiddleware");

// Apply leave
router.post("/apply-leave", authStudent, applyLeave);

// View my leaves
router.get("/my-leaves", authStudent, myLeaves);

// ✅ Delete pending leave (STUDENT ONLY)
router.delete("/leave/:id", authStudent, deleteLeave);

module.exports = router;
