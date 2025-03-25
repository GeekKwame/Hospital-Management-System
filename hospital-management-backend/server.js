const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const sequelize = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api", routes);

// Sync Database
sequelize.sync().then(() => console.log("✅ Database synchronized"));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
