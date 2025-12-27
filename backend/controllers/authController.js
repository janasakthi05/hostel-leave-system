const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   LOGIN (ALL ROLES)
========================= */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   STUDENT SIGN-UP (FINAL)
========================= */
exports.studentSignup = async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      email,
      password,
      hostelBlock,
      roomNumber,
      phone
    } = req.body;

    // 🔐 College email validation
    if (!email.endsWith("@kongu.edu")) {
      return res.status(400).json({
        message: "Only college email (@kongu.edu) allowed"
      });
    }

    // 🔍 Check existing student
    const existingUser = await User.findOne({
      $or: [{ email }, { rollNumber }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Student already registered"
      });
    }

    // 🔑 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧑‍🎓 Create student
    const student = new User({
      name,
      rollNumber,
      email,
      password: hashedPassword,
      role: "STUDENT",
      hostelBlock,
      roomNumber,
      phone,
      idCardPhoto: req.file ? req.file.path : null // ✅ FIX
    });

    await student.save();

    return res.status(201).json({
      message: "Student registered successfully"
    });
  } catch (err) {
    console.error("SIGNUP ERROR 👉", err);
    return res.status(500).json({ message: "Server error" });
  }
};
