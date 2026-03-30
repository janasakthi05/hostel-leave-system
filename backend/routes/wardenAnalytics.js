const express = require("express");
const router = express.Router();
const LeaveRequest = require("../models/LeaveRequest");

router.get("/leave-trends", async (req, res) => {
  try {
    const data = await LeaveRequest.aggregate([
      {
        $match: { status: "APPROVED" }
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },

      // ✅ Extract department from rollNumber (23CDR045 → CDR)
      {
        $addFields: {
          department: {
            $substr: ["$student.rollNumber", 2, 3]
          }
        }
      },

      {
        $group: {
          _id: "$department",
          leaveCount: { $sum: 1 }
        }
      },

      { $sort: { leaveCount: -1 } }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;