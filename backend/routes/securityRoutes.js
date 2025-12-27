const express = require("express");
const router = express.Router();
const { scanQR } = require("../controllers/securityController");

router.post("/scan", scanQR);

module.exports = router;
