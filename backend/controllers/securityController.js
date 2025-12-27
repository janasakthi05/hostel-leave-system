const LeaveRequest = require("../models/LeaveRequest");

exports.scanQR = async (req, res) => {
  try {
    const { qrToken } = req.body;

    // 1️⃣ QR token must be present
    if (!qrToken) {
      return res.status(400).json({ message: "QR token missing" });
    }

    // 2️⃣ Find approved & unused leave with this QR
    const leave = await LeaveRequest.findOne({
      qrToken,
      status: "APPROVED",
      isUsed: false
    }).populate(
      "studentId",
      "name email hostelBlock roomNumber idCardPhoto"
    );

    if (!leave) {
      return res.status(401).json({
        message: "Invalid, expired, or already used QR"
      });
    }

    // 3️⃣ Validate student
    if (!leave.studentId) {
      return res.status(400).json({
        message: "Student data not found"
      });
    }

    const now = new Date();

    // 4️⃣ Validate leave time window
    if (now < leave.fromDate || now > leave.toDate) {
      return res.status(403).json({
        message: "QR expired or not yet valid"
      });
    }

    // 5️⃣ Mark QR as used & log exit
    leave.isUsed = true;
    leave.exitTime = now;
    await leave.save();

    // 6️⃣ ACCESS GRANTED RESPONSE
    return res.json({
      message: "ACCESS GRANTED",
      student: {
        name: leave.studentId.name,
        email: leave.studentId.email,
        hostelBlock: leave.studentId.hostelBlock,
        roomNumber: leave.studentId.rollNumber,          // ✅ FIXED
        idCardPhoto: leave.studentId.idCardPhoto // ✅ READY
      },
      leaveDetails: {
        purpose: leave.purpose,
        validFrom: leave.fromDate,
        validTill: leave.toDate,
        approvedAt: leave.approvedAt
      },
      exitTime: now
    });

  } catch (err) {
    console.error("SECURITY SCAN ERROR 👉", err);
    return res.status(500).json({ message: "Server error" });
  }
};
