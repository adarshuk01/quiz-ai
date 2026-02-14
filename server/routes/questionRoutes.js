const router = require("express").Router();
const upload = require("../middlewares/uploadMiddleware");
const { processPDF, getMyQuestionSets, getQuestionSetById, generateFromTopic, updateQuestionSet, deleteQuestionSet, generateManualFromTopic } = require("../controllers/questionsController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/upload",protect, upload.single("file"), processPDF);
router.get("/my-questions", protect,getMyQuestionSets);
router.get("/:id", protect,getQuestionSetById);
router.post("/generate", protect, generateFromTopic);
router.put("/:id", protect, updateQuestionSet);
router.delete("/:id", protect, deleteQuestionSet);
router.post("/generate-manual", protect, generateManualFromTopic);

module.exports = router;
