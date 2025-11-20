const sequelize = require("../db");
const Room = require("../models/Room");
const Admission = require("../models/Admission");
const User = require("../models/User");
const { logAction } = require("../utils/auditLogger");

exports.getRooms = async (_req, res) => {
  try {
    const rooms = await Room.findAll({ order: [["room_number", "ASC"]] });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedCount, updatedRooms] = await Room.update(req.body, {
      where: { room_id: id },
      returning: true
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    await logAction({
      userId: req.user?.user_id,
      action: "ROOM_UPDATED",
      resource: "Room",
      details: { room_id: id, changes: req.body }
    });

    res.json(updatedRooms[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating room" });
  }
};

exports.admitPatient = async (req, res) => {
  const { patient_id, room_id, diagnosis } = req.body;

  if (!patient_id || !room_id) {
    return res.status(400).json({ message: "patient_id and room_id are required" });
  }

  const transaction = await sequelize.transaction();
  try {
    const patient = await User.findByPk(patient_id, { transaction });

    if (!patient || patient.role !== "Patient") {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid patient_id" });
    }

    const room = await Room.findByPk(room_id, { transaction });

    if (!room) {
      await transaction.rollback();
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.is_available) {
      await transaction.rollback();
      return res.status(409).json({ message: "Room is not available" });
    }

    const admission = await Admission.create({
      patient_id,
      room_id,
      diagnosis
    }, { transaction });

    await room.update({ is_available: false }, { transaction });

    await transaction.commit();
    await logAction({
      userId: req.user?.user_id,
      action: "PATIENT_ADMITTED",
      resource: "Admission",
      details: { admission_id: admission.admission_id, room_id: room_id }
    });

    res.status(201).json(admission);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Error admitting patient" });
  }
};

exports.dischargePatient = async (req, res) => {
  const { id } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const admission = await Admission.findByPk(id, { transaction });

    if (!admission) {
      await transaction.rollback();
      return res.status(404).json({ message: "Admission not found" });
    }

    if (admission.status === "Discharged") {
      await transaction.rollback();
      return res.status(400).json({ message: "Patient already discharged" });
    }

    await admission.update(
      { status: "Discharged", discharged_at: new Date() },
      { transaction }
    );

    await Room.update(
      { is_available: true },
      { where: { room_id: admission.room_id }, transaction }
    );

    await transaction.commit();
    await logAction({
      userId: req.user?.user_id,
      action: "PATIENT_DISCHARGED",
      resource: "Admission",
      details: { admission_id: admission.admission_id }
    });

    res.json({ message: "Patient discharged" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Error discharging patient" });
  }
};
