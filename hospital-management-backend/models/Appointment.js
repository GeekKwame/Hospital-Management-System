const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");

const Appointment = sequelize.define("Appointment", {
    appointment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    doctor_id: { type: DataTypes.INTEGER, allowNull: false },
    patient_id: { type: DataTypes.INTEGER, allowNull: false },
    scheduled_at: { type: DataTypes.DATE, allowNull: false },
    status: {
        type: DataTypes.ENUM("Scheduled", "In Progress", "Completed", "Cancelled"),
        defaultValue: "Scheduled"
    },
    reason: { type: DataTypes.STRING(255), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true }
}, {
    tableName: "appointments",
    timestamps: false
});

Appointment.belongsTo(User, { as: "doctor", foreignKey: "doctor_id" });
Appointment.belongsTo(User, { as: "patient", foreignKey: "patient_id" });

module.exports = Appointment;

