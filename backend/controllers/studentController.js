const LeaveRequest = require("../models/LeaveRequest");

exports.applyLeave = async (req, res) => {
  try {
    const { purpose, fromDate, toDate } = req.body;

    if (!purpose || !fromDate || !toDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = new LeaveRequest({
      studentId: req.user.id,
      purpose,
      fromDate,
      toDate,
      status: "PENDING"
    });

    await leave.save();

    res.status(201).json({
      message: "Leave request submitted successfully",
      leave
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
