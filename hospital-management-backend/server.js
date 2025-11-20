const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const sequelize = require("./db");
const config = require("./config");

require("./models");

const createApp = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(morgan("combined"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200
    })
  );
  app.use("/api", routes);
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  return app;
};

const app = createApp();
const PORT = config.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected...");
    await sequelize.sync();
    console.log("✅ Database synchronized");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
