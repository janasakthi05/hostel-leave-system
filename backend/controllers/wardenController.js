const LeaveRequest = require("../models/LeaveRequest");
const crypto = require("crypto");

// View pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const requests = await LeaveRequest.find({
      $or: [
        { status: "PENDING" },
        {
          status: "REJECTED",
          rejectedAt: { $gte: twentyFourHoursAgo }
        }
      ]
    }).populate("studentId", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Approve request
exports.approveRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status === "PENDING") {
      request.status = "APPROVED";
      request.approvedAt = new Date();
      request.qrToken = crypto.randomBytes(20).toString("hex");
      request.qrGeneratedAt = new Date();
      await request.save();

      return res.json({ message: "Request approved" });
    }

    if (request.status === "REJECTED") {
      const diff =
        (Date.now() - new Date(request.rejectedAt)) /
        (1000 * 60 * 60);

      if (diff > 24) {
        return res.status(400).json({
          message: "Re-approval time expired. Student must apply again."
        });
      }

      request.status = "APPROVED";
      request.approvedAt = new Date();
      request.qrToken = crypto.randomBytes(20).toString("hex");
      request.qrGeneratedAt = new Date();
      await request.save();

      return res.json({ message: "Request re-approved" });
    }

    res.status(400).json({ message: "Invalid request state" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reject request
exports.rejectRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await LeaveRequest.findById(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    request.status = "REJECTED";
    request.rejectionReason = reason;
    request.rejectedAt = new Date();
    await request.save();

    res.json({ message: "Request rejected with reason" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};