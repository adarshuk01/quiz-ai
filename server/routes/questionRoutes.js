const router = require("express").Router();
const upload = require("../middlewares/uploadMiddleware");
const { processPDF, getMyQuestionSets, getQuestionSetById, generateFromTopic, updateQuestionSet } = require("../controllers/questionsController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/upload",protect, upload.single("pdf"), processPDF);
router.get("/my-questions", protect,getMyQuestionSets);
router.get("/:id", protect,getQuestionSetById);
router.post("/generate", protect, generateFromTopic);
router.put("/:id", protect, updateQuestionSet);

module.exports = router;
