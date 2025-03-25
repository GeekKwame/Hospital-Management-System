const Room = require("../models/Room");
const Admission = require("../models/Admission");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    await Room.update(req.body, { where: { id } });
    res.json({ message: "Room updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating room" });
  }
};

exports.admitPatient = async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json(admission);
  } catch (error) {
    res.status(500).json({ message: "Error admitting patient" });
  }
};

exports.dischargePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await Admission.update({ status: "Discharged" }, { where: { id } });
    res.json({ message: "Patient discharged" });
  } catch (error) {
    res.status(500).json({ message: "Error discharging patient" });
  }
};
