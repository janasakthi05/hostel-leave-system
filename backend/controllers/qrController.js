const QRCode = require("qrcode");
const LeaveRequest = require("../models/LeaveRequest");

exports.generateQR = async (req, res) => {
  try {
    console.log("QR request received");

    const { leaveId } = req.params;
    console.log("Leave ID:", leaveId);

    const leave = await LeaveRequest.findById(leaveId);
    console.log("Leave data:", leave);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== "APPROVED") {
      return res.status(400).json({ message: "Leave not approved" });
    }

    if (!leave.qrToken) {
      return res.status(400).json({ message: "QR token missing" });
    }

    const qrData = JSON.stringify({
      qrToken: leave.qrToken,
      leaveId: leave._id
    });

    const qrImage = await QRCode.toDataURL(qrData);

    return res.json({
      message: "QR generated successfully",
      qrImage
    });
  } catch (err) {
    console.error("QR ERROR 👉", err);
    return res.status(500).json({ message: "Server error" });
  }
};
