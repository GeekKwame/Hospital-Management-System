const AuditLog = require("../models/AuditLog");

const logAction = async ({ userId, action, resource, details }) => {
  try {
    await AuditLog.create({
      user_id: userId || null,
      action,
      resource,
      details
    });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
};

module.exports = {
  logAction
};

