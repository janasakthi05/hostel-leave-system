const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["STUDENT", "WARDEN", "SECURITY", "ADMIN"],
      default: "STUDENT"
    },

    hostelBlock: {
      type: String,
      required: true
    },

    roomNumber: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    // ✅ ID Card Photo (stored as file path)
    idCardPhoto: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);
