const { getDashboardStats } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");
const router = require("express").Router();


router.get("/stats", protect, getDashboardStats);

module.exports = router;
