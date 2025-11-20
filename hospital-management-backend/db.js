const { Sequelize } = require("sequelize");
const config = require("./config");

const baseOptions = {
    host: config.DB.host,
    port: config.DB.port,
    dialect: config.DB.dialect,
    logging: false
};

const sequelize = config.DB.url
    ? new Sequelize(config.DB.url, { ...baseOptions })
    : new Sequelize(config.DB.database, config.DB.user, config.DB.password, baseOptions);

module.exports = sequelize;
