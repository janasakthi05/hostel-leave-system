const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["STUDENT", "WARDEN", "SECURITY", "ADMIN"]
  }
});

module.exports = mongoose.model("User", userSchema);
