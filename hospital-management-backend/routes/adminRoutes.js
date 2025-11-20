const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { getAuditLogs } = require("../controllers/adminController");

router.use(authMiddleware, roleMiddleware(["Admin"]));

router.get("/dashboard", (_req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/audit-logs", getAuditLogs);

module.exports = router;
