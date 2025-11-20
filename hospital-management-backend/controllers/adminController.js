const AuditLog = require("../models/AuditLog");
const User = require("../models/User");

exports.getAuditLogs = async (_req, res) => {
  try {
    const logs = await AuditLog.findAll({
      include: [{ model: User, as: "actor", attributes: ["user_id", "first_name", "last_name", "role"] }],
      order: [["created_at", "DESC"]],
      limit: 100
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to load audit logs" });
  }
};

