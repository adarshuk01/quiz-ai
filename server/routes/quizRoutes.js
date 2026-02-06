const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  createQuiz,
  getQuizByCode,
  submitQuiz,
  startQuiz,
} = require("../controllers/quizController");

// Admin
router.post("/create", protect, createQuiz);

// Public
router.get("/:code", getQuizByCode);
router.post("/:code/submit", submitQuiz);
router.post("/:code/start", startQuiz);

module.exports = router;
