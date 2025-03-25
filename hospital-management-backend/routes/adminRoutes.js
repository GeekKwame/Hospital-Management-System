const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/admin/dashboard", authMiddleware, roleMiddleware(["Admin"]), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});
