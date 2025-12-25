const LeaveRequest = require("../models/LeaveRequest");

// View pending requests
exports.getPendingRequests = async (req, res) => {
  const requests = await LeaveRequest.find({ status: "PENDING" })
    .populate("studentId", "name email");
  res.json(requests);
};

// Approve request
exports.approveRequest = async (req, res) => {
  const request = await LeaveRequest.findById(req.params.id);

  if (!request) return res.status(404).json({ message: "Request not found" });

  // Allow approval if PENDING
  if (request.status === "PENDING") {
    request.status = "APPROVED";
    request.approvedAt = new Date();
    await request.save();
    return res.json({ message: "Request approved" });
  }

  // Allow re-approval within 24 hours after rejection
  if (request.status === "REJECTED") {
    const hoursPassed = (Date.now() - request.rejectedAt) / (1000 * 60 * 60);
    if (hoursPassed <= 24) {
      request.status = "APPROVED";
      request.approvedAt = new Date();
      await request.save();
      return res.json({ message: "Request re-approved" });
    }
  }

  res.status(400).json({ message: "Approval not allowed" });
};

// Reject request
exports.rejectRequest = async (req, res) => {
  const { reason } = req.body;
  const request = await LeaveRequest.findById(req.params.id);

  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = "REJECTED";
  request.rejectionReason = reason;
  request.rejectedAt = new Date();
  await request.save();

  res.json({ message: "Request rejected with reason" });
};
