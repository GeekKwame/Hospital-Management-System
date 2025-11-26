const User = require("./User");
const Appointment = require("./Appointment");
const Room = require("./Room");
const Admission = require("./Admission");
const AuditLog = require("./AuditLog");
const PasswordResetToken = require("./PasswordResetToken");
const Prescription = require("./Prescription");

Room.hasMany(Admission, { foreignKey: "room_id", as: "admissions" });
User.hasMany(AuditLog, { foreignKey: "user_id", as: "logs" });
User.hasMany(PasswordResetToken, { foreignKey: "user_id", as: "resetTokens" });
User.hasMany(Prescription, { as: "prescribedBy", foreignKey: "doctor_id" });
User.hasMany(Prescription, { as: "prescribedTo", foreignKey: "patient_id" });

module.exports = {
    User,
    Appointment,
    Room,
    Admission,
    AuditLog,
    PasswordResetToken,
    Prescription
};

