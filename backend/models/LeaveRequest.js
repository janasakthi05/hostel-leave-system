const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ✅ purpose is now compulsory
    purpose: {
      type: String,
      required: true,
      trim: true
    },

    fromDate: {
      type: Date,
      required: true
    },

    toDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },

    rejectionReason: {
      type: String,
      trim: true
    },

    rejectedAt: Date,
    approvedAt: Date,

    // QR fields
    qrToken: String,
    qrGeneratedAt: Date,

    // Gate tracking
    exitTime: Date,

    // Prevent QR reuse
    isUsed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
