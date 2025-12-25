const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getPendingRequests,
  approveRequest,
  rejectRequest
} = require("../controllers/wardenController");

router.get("/pending", auth, getPendingRequests);
router.put("/approve/:id", auth, approveRequest);
router.put("/reject/:id", auth, rejectRequest);

module.exports = router;
