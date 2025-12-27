const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/warden", require("./routes/wardenRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/qr", require("./routes/qrRoutes"));
app.use("/api/security", require("./routes/securityRoutes"));
app.use("/uploads", express.static("uploads"));
