require("dotenv").config();

const sequelize = require("../db");
const { User, Room, Appointment, Admission } = require("../models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await Promise.all([
    Appointment.destroy({ where: {} }),
    Admission.destroy({ where: {} })
  ]);
  await Promise.all([
    User.destroy({ where: {} }),
    Room.destroy({ where: {} })
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

