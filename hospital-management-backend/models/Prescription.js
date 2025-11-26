const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Appointment = require("./Appointment");

const Prescription = sequelize.define("Prescription", {
    prescription_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    doctor_id: { type: DataTypes.INTEGER, allowNull: false },
    patient_id: { type: DataTypes.INTEGER, allowNull: false },
    appointment_id: { type: DataTypes.INTEGER, allowNull: true },
    medication: { type: DataTypes.STRING(255), allowNull: false },
    dosage: { type: DataTypes.STRING(100), allowNull: false },
    frequency: { type: DataTypes.STRING(100), allowNull: false },
    duration: { type: DataTypes.STRING(100), allowNull: false },
    instructions: { type: DataTypes.TEXT, allowNull: true },
    prescribed_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: {
        type: DataTypes.ENUM("Active", "Completed", "Cancelled"),
        defaultValue: "Active"
    }
}, {
    tableName: "prescriptions",
    timestamps: false
});

Prescription.belongsTo(User, { as: "doctor", foreignKey: "doctor_id" });
Prescription.belongsTo(User, { as: "patient", foreignKey: "patient_id" });
Prescription.belongsTo(Appointment, { as: "appointment", foreignKey: "appointment_id" });

module.exports = Prescription;

