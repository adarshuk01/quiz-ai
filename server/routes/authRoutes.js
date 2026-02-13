const router = require("express").Router();
const { signup, login, changePassword, getProfile, updateProfile, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.put("/change-password", protect, changePassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


module.exports = router;
