const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  purpose: String,
  fromDate: Date,
  toDate: Date,
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },
  rejectionReason: String,
  rejectedAt: Date,
  approvedAt: Date,
    qrToken: String,
  qrGeneratedAt: Date,
  exitTime: Date

});

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
