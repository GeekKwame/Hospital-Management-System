const User = require("./User");
const Appointment = require("./Appointment");
const Room = require("./Room");
const Admission = require("./Admission");
const AuditLog = require("./AuditLog");
const PasswordResetToken = require("./PasswordResetToken");

Room.hasMany(Admission, { foreignKey: "room_id", as: "admissions" });
User.hasMany(AuditLog, { foreignKey: "user_id", as: "logs" });
User.hasMany(PasswordResetToken, { foreignKey: "user_id", as: "resetTokens" });

module.exports = {
    User,
    Appointment,
    Room,
    Admission,
    AuditLog,
    PasswordResetToken
};

