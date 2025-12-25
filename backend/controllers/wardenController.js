const LeaveRequest = require("../models/LeaveRequest");
const crypto = require("crypto");

// View pending requests
exports.getPendingRequests = async (req, res) => {
  const requests = await LeaveRequest.find({ status: "PENDING" })
    .populate("studentId", "name email");
  res.json(requests);
};

// Approve request
exports.approveRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // CASE 1: Normal approval (PENDING)
   if (request.status === "PENDING") {
  request.status = "APPROVED";
  request.approvedAt = new Date();

  // 🔐 Generate QR token
  request.qrToken = crypto.randomBytes(20).toString("hex");
  request.qrGeneratedAt = new Date();

  await request.save();

  return res.json({ message: "Request approved" });
}

    // CASE 2: Re-approval after rejection (WITHIN 24 HOURS)
    if (request.status === "REJECTED") {
      const now = new Date();
      const rejectedTime = new Date(request.rejectedAt);

      const diffInHours =
        (now.getTime() - rejectedTime.getTime()) / (1000 * 60 * 60);

      if (diffInHours > 24) {
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

    return res.status(400).json({ message: "Invalid request state" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
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
