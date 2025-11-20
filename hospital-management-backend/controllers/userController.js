const User = require("../models/User");
const { logAction } = require("../utils/auditLogger");

const sanitizeUser = (userInstance) => {
  const user = userInstance.get({ plain: true });
  delete user.password_hash;
  return user;
};

// Get all doctors
exports.getDoctors = async (_req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: "Doctor" },
      order: [["last_name", "ASC"], ["first_name", "ASC"]]
    });
    res.json(doctors.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// Get all patients
exports.getPatients = async (_req, res) => {
  try {
    const patients = await User.findAll({
      where: { role: "Patient" },
      order: [["created_at", "DESC"]]
    });
    res.json(patients.map(sanitizeUser));
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients" });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = ["first_name", "last_name", "phone", "role"];
    const payload = allowedFields.reduce((acc, field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        acc[field] = req.body[field];
      }
      return acc;
    }, {});

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const [updatedCount, updatedUsers] = await User.update(payload, {
      where: { user_id: id },
      returning: true
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUserData = sanitizeUser(updatedUsers[0]);

    await logAction({
      userId: req.user?.user_id,
      action: "USER_UPDATED",
      resource: "User",
      details: { target_user_id: id, changes: payload }
    });

    res.json(updatedUserData);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { user_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    await logAction({
      userId: req.user?.user_id,
      action: "USER_DELETED",
      resource: "User",
      details: { target_user_id: id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
