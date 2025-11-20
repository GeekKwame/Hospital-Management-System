const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const PasswordResetToken = sequelize.define("PasswordResetToken", {
    token_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    token_hash: { type: DataTypes.STRING(128), allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: "password_reset_tokens",
    timestamps: false
});

PasswordResetToken.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = PasswordResetToken;

