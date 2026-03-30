const LeaveRequest = require("../models/LeaveRequest");

exports.scanQR = async (req, res) => {
  try {
    let { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({
        status: "DENIED",
        message: "QR token missing"
      });
    }

    qrToken = qrToken.trim();

    const leave = await LeaveRequest.findOne({
      qrToken,
      status: "APPROVED"
    }).populate(
      "studentId",
      "name email hostelBlock roomNumber idCardPhoto"
    );

    if (!leave) {
      return res.status(401).json({
        status: "DENIED",
        message: "Invalid QR token"
      });
    }

    if (leave.isUsed) {
      return res.status(403).json({
        status: "DENIED",
        message: "QR already used"
      });
    }

    if (!leave.studentId) {
      return res.status(400).json({
        status: "DENIED",
        message: "Student data not found"
      });
    }

    const now = new Date();

    if (now < new Date(leave.fromDate)) {
      return res.status(403).json({
        status: "DENIED",
        message: "QR not yet valid"
      });
    }

    if (now > new Date(leave.toDate)) {
      return res.status(403).json({
        status: "DENIED",
        message: "QR expired"
      });
    }

    leave.isUsed = true;
    leave.exitTime = now;
    await leave.save();

    return res.json({
      status: "GRANTED",
      message: "ACCESS GRANTED",
      student: {
        name: leave.studentId.name,
        email: leave.studentId.email,
        hostelBlock: leave.studentId.hostelBlock,
        roomNumber: leave.studentId.roomNumber,
        idCardPhoto: leave.studentId.idCardPhoto
      },
      leaveDetails: {
        purpose: leave.purpose,
        validFrom: leave.fromDate,
        validTill: leave.toDate,
        approvedAt: leave.approvedAt
      },
      scannedAt: now
    });

  } catch (error) {
    console.error("SECURITY SCAN ERROR:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Internal server error"
    });
  }
};
