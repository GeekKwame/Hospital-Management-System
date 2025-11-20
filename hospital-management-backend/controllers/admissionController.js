const sequelize = require("../db");
const { Admission, Room, User } = require("../models");
const { logAction } = require("../utils/auditLogger");

exports.getAdmissions = async (_req, res) => {
  try {
    const admissions = await Admission.findAll({
      include: [
        { model: User, as: "patient", attributes: ["user_id", "first_name", "last_name"] },
        { model: Room, as: "room", attributes: ["room_id", "room_number", "type"] }
      ],
      order: [["admitted_at", "DESC"]]
    });

    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admissions" });
  }
};

exports.updateAdmissionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Admitted", "Under Observation", "Discharged"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const transaction = await sequelize.transaction();
  try {
    const admission = await Admission.findByPk(id, { transaction });

    if (!admission) {
      await transaction.rollback();
      return res.status(404).json({ message: "Admission not found" });
    }

    await admission.update(
      {
        status,
        discharged_at: status === "Discharged" ? new Date() : admission.discharged_at
      },
      { transaction }
    );

    if (status === "Discharged") {
      await Room.update(
        { is_available: true },
        { where: { room_id: admission.room_id }, transaction }
      );
    }

    await transaction.commit();

    await logAction({
      userId: req.user?.user_id,
      action: "UPDATE_ADMISSION_STATUS",
      resource: "Admission",
      details: { admission_id: admission.admission_id, status }
    });

    res.json(admission);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Error updating admission status" });
  }
};

