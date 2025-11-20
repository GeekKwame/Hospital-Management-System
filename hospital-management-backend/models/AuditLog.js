const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const AuditLog = sequelize.define("AuditLog", {
    log_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    action: { type: DataTypes.STRING(100), allowNull: false },
    resource: { type: DataTypes.STRING(100), allowNull: false },
    details: { type: DataTypes.JSON, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: "audit_logs",
    timestamps: false
});

AuditLog.belongsTo(User, { foreignKey: "user_id", as: "actor" });

module.exports = AuditLog;

