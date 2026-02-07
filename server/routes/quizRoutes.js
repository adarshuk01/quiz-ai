const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");

const {
  createQuiz,
  getQuizByCode,
  submitQuiz,
  startQuiz,
  getUserQuizzes,
  deleteQuiz,
  getQuizById,
  updateQuiz,
} = require("../controllers/quizController");

// Admin
router.post("/create", protect, createQuiz);
router.get("/my-quizzes", protect, getUserQuizzes);
router.delete("/:id", protect, deleteQuiz);
router.get("/:id", protect, getQuizById);
router.put("/:id", protect, updateQuiz);




// Public
router.get("/:code", getQuizByCode);
router.post("/:code/submit", submitQuiz);
router.post("/:code/start", startQuiz);

module.exports = router;
