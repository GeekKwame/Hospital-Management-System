const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Room = sequelize.define("Room", {
    room_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    room_number: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    type: { type: DataTypes.ENUM("ICU", "General", "Private", "Emergency"), defaultValue: "General" },
    capacity: { type: DataTypes.INTEGER, defaultValue: 1 },
    is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
    notes: { type: DataTypes.TEXT, allowNull: true }
}, {
    tableName: "rooms",
    timestamps: false
});

module.exports = Room;

