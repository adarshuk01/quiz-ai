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
  getQuizResult,
  setQuizPauseState,
  getQuizAnalytics,
  getAttemptReview,
} = require("../controllers/quizController");

// Admin
router.post("/create", protect, createQuiz);
router.get("/my-quizzes", protect, getUserQuizzes);
router.delete("/:id", protect, deleteQuiz);
router.get("/:id", protect, getQuizById);
router.put("/:id", protect, updateQuiz);
router.patch("/:quizId/pause",protect, setQuizPauseState);
router.get("/analytics/:quizId", getQuizAnalytics);





// Public
router.get("/code/:code", getQuizByCode);
router.get("/review/:attemptId", getAttemptReview);

router.post("/:code/submit", submitQuiz);
router.post("/:code/start", startQuiz);
router.get("/result/:attemptId", getQuizResult);

module.exports = router;
