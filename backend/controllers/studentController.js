const LeaveRequest = require("../models/LeaveRequest");

/**
 * APPLY LEAVE
 */
exports.applyLeave = async (req, res) => {
  try {
    const { purpose, fromDate, toDate } = req.body;

    // ✅ Strong validation
    if (!purpose || !fromDate || !toDate) {
      return res.status(400).json({
        message: "Purpose, Out Date and In Date are required"
      });
    }

    const leave = new LeaveRequest({
      studentId: req.user.id,
      purpose: purpose.trim(),   // ✅ ensure clean value
      fromDate,
      toDate,
      status: "PENDING"
    });

    await leave.save();

    return res.status(201).json({
      message: "Leave request submitted successfully",
      leave
    });
  } catch (error) {
    console.error("Apply leave error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * VIEW MY LEAVES
 */
exports.myLeaves = async (req, res) => {
  try {
    // ✅ DO NOT use select() here
    // ✅ Return full document including purpose
    const leaves = await LeaveRequest.find({
      studentId: req.user.id
    })
      .sort({ createdAt: -1 })
      .lean(); // optional but good practice

    return res.status(200).json(leaves);
  } catch (error) {
    console.error("Fetch leaves error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
/**
 * DELETE PENDING LEAVE
 */
exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await LeaveRequest.findOne({
      _id: id,
      studentId: req.user.id
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending leave requests can be deleted"
      });
    }

    await LeaveRequest.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Leave request deleted successfully"
    });
  } catch (error) {
    console.error("Delete leave error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
