const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING(50), allowNull: false },
    last_name: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    role: { type: DataTypes.ENUM("Admin", "Doctor", "Nurse", "Patient"), allowNull: false },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: "users",
    timestamps: false
});

module.exports = User;
