const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(config.DB.database, config.DB.user, config.DB.password, {
    host: config.DB.host,
    dialect: "postgres",
    logging: false
});

sequelize.authenticate()
    .then(() => console.log("✅ Database connected..."))
    .catch(err => console.error("❌ Database connection failed:", err));

module.exports = sequelize;
