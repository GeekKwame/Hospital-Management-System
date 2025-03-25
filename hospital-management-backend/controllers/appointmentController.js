const Appointment = require("../models/Appointment");

exports.bookAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment" });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const appointments = await Appointment.findAll({ where: { doctor_id } });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.update(req.body, { where: { id } });
    res.json({ message: "Appointment updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await Appointment.destroy({ where: { id } });
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment" });
  }
};
