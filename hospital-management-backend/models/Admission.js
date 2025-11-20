const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./User");
const Room = require("./Room");

const Admission = sequelize.define("Admission", {
    admission_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    patient_id: { type: DataTypes.INTEGER, allowNull: false },
    room_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
        type: DataTypes.ENUM("Admitted", "Under Observation", "Discharged"),
        defaultValue: "Admitted"
    },
    admitted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    discharged_at: { type: DataTypes.DATE, allowNull: true },
    diagnosis: { type: DataTypes.TEXT, allowNull: true }
}, {
    tableName: "admissions",
    timestamps: false
});

Admission.belongsTo(User, { as: "patient", foreignKey: "patient_id" });
Admission.belongsTo(Room, { as: "room", foreignKey: "room_id" });

module.exports = Admission;

