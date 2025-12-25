const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "STUDENT") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = decoded; // contains student id
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
