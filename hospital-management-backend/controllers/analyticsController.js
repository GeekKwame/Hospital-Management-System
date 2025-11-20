const { Op } = require("sequelize");
const { User, Appointment, Room, Admission } = require("../models");

exports.getSummary = async (_req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      doctorCount,
      patientCount,
      nurseCount,
      totalAppointments,
      todaysAppointments,
      activeAdmissions
    ] = await Promise.all([
      User.count({ where: { role: "Doctor" } }),
      User.count({ where: { role: "Patient" } }),
      User.count({ where: { role: "Nurse" } }),
      Appointment.count(),
      Appointment.count({ where: { scheduled_at: { [Op.gte]: startOfDay } } }),
      Admission.count({ where: { status: { [Op.ne]: "Discharged" } } })
    ]);

    res.json({
      doctors: doctorCount,
      patients: patientCount,
      nurses: nurseCount,
      totalAppointments,
      todaysAppointments,
      activeAdmissions
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load summary analytics" });
  }
};

exports.getAppointmentTrends = async (_req, res) => {
  try {
    const daysBack = 6;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const appointments = await Appointment.findAll({
      where: {
        scheduled_at: {
          [Op.gte]: startDate
        }
      }
    });

    const counts = appointments.reduce((acc, appointment) => {
      const key = new Date(appointment.scheduled_at).toISOString().split("T")[0];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const trends = [];
    for (let i = 0; i <= daysBack; i += 1) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      const key = day.toISOString().split("T")[0];
      trends.push({
        day: key,
        count: counts[key] || 0
      });
    }

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: "Failed to load appointment trends" });
  }
};

exports.getRoomOccupancy = async (_req, res) => {
  try {
    const rooms = await Room.findAll({
      attributes: ["room_id", "room_number", "type", "capacity", "is_available"],
      include: [
        {
          model: Admission,
          as: "admissions",
          where: { status: { [Op.ne]: "Discharged" } },
          required: false
        }
      ]
    });

    const totalsByType = {};
    rooms.forEach((room) => {
      const type = room.type;
      if (!totalsByType[type]) {
        totalsByType[type] = { total: 0, occupied: 0 };
      }
      totalsByType[type].total += 1;
      if (!room.is_available) {
        totalsByType[type].occupied += 1;
      }
    });

    res.json({
      rooms: rooms.map((room) => ({
        room_id: room.room_id,
        room_number: room.room_number,
        type: room.type,
        capacity: room.capacity,
        is_available: room.is_available,
        active_admissions: room.admissions?.length || 0
      })),
      totalsByType
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load room occupancy" });
  }
};

