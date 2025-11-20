require("dotenv").config();

const DB_URL = process.env.DB_URL || process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || "development";

const isTestEnv = NODE_ENV === "test";

module.exports = {
    PORT: process.env.PORT || 5000,
    DB: {
        url: isTestEnv ? "sqlite::memory:" : DB_URL,
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "hospital_db",
        port: Number(process.env.DB_PORT) || 5432,
        dialect: isTestEnv ? "sqlite" : process.env.DB_DIALECT || "postgres"
    },
    JWT_SECRET: process.env.JWT_SECRET || "change_me_in_production",
    NODE_ENV
};