const QuestionSet = require("../models/QuestionSet");
const { extractTextFromPDFBuffer } = require("../services/pdfService");
const { chunkText } = require("../services/chunkService");
const {
  generateQuizQuestions,
  generateTopicFromText,
} = require("../services/aiService");
const ai = require("../config/ai"); // your AI config
const { extractTextFromFile } = require("../services/fileTextService");


exports.generateFromTopic = async (req, res) => {
  try {
    const { topic, count, language } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic required" });
    }

    const allowedLanguages = ["English", "Malayalam", "Hindi", "Tamil"];
    const selectedLanguage =
      language && allowedLanguages.includes(language)
        ? language
        : "English";

    const totalRequired = Number(count) || 50;
    const batchSize = 20; // safer than 50 for 8B model

    const generateBatch = async (batchCount, retry = 0) => {
      const prompt = `
Generate ${batchCount} multiple choice questions about "${topic}" strictly in ${selectedLanguage}.

STRICT RULES:
- Return ONLY valid JSON
- Return ONLY a JSON array
- Do NOT translate JSON keys
- Keys must be exactly: question, options, correctAnswer
- Each question must have exactly 4 options
- correctAnswer must be a NUMBER (0,1,2,3)
- No explanations
- No text before or after JSON
- Do NOT repeat questions

FORMAT:
[
  {
    "question": "string",
    "options": ["string","string","string","string"],
    "correctAnswer": 0
  }
]
`;

      const aiResponse = await ai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });

      const text = aiResponse.choices[0].message.content.trim();

      try {
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          throw new Error("Not an array");
        }

        return parsed;
      } catch (err) {
        console.log("⚠️ Invalid JSON. Retrying...");
        console.log("Raw AI Response:", text);

        if (retry < 2) {
          return generateBatch(batchCount, retry + 1);
        } else {
          throw new Error("Failed after retries");
        }
      }
    };

    let questions = [];

    while (questions.length < totalRequired) {
      const remaining = totalRequired - questions.length;
      const currentBatchSize = Math.min(batchSize, remaining);

      const batch = await generateBatch(currentBatchSize);

      // Remove duplicates inside same topic
      const existingQuestions = new Set(
        questions.map((q) => q.question.trim())
      );

      const filteredBatch = batch.filter(
        (q) => !existingQuestions.has(q.question.trim())
      );

      questions = [...questions, ...filteredBatch];
    }

    questions = questions.slice(0, totalRequired);

    const questionSet = await QuestionSet.create({
      topic,
      language: selectedLanguage,
      questions,
      createdBy: req.user._id,
    });

    res.json({
      message: "Question set created",
      questionSetId: questionSet._id,
      language: selectedLanguage,
      total: questions.length,
      questions,
    });
  } catch (err) {
    console.error("AI GENERATE ERROR:", err);
    res.status(500).json({
      message: "Failed to generate questions",
      error: err.message,
    });
  }
};



exports.generateManualFromTopic = async (req, res) => {
  try {
    const { topic, count } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic required" });
    }

    const totalRequired = Number(count) || 10; // default 10

    // Create empty questions
    const questions = Array.from({ length: totalRequired }, () => ({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    }));

    const questionSet = await QuestionSet.create({
      topic,
      questions,
      createdBy: req.user._id,
    });

    res.json({
      message: "Manual question set created",
      questionSetId: questionSet._id,
      questions,
    });
  } catch (err) {
    console.error("MANUAL GENERATE ERROR:", err);
    res.status(500).json({ message: "Failed to create manual question set" });
  }
};






exports.deleteQuestionSet = async (req, res) => {
  try {
    const { id } = req.params;

    const questionSet = await QuestionSet.findById(id);

    if (!questionSet) {
      return res.status(404).json({ message: "Question set not found" });
    }

    // Optional: ensure only creator can delete
    if (questionSet.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await QuestionSet.findByIdAndDelete(id);

    res.json({ message: "Question set deleted successfully" });
  } catch (err) {
    console.error("DELETE QUESTION SET ERROR:", err);
    res.status(500).json({ message: "Failed to delete question set" });
  }
};



// PUT /api/question-sets/:id
exports.updateQuestionSet = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid questions array" });
    }

    // Validate each question
    const validQuestions = questions.filter(q =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      Number.isInteger(q.correctAnswer) &&
      q.correctAnswer >= 0 &&
      q.correctAnswer <= 3
    );

    const updated = await QuestionSet.findByIdAndUpdate(
      req.params.id,
      { questions: validQuestions },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "QUESTION_SET_NOT_FOUND" });
    }

    res.json({
      message: "Question set updated",
      questionSet: updated,
    });
  } catch (err) {
    console.error("UPDATE QUESTION SET ERROR:", err);
    res.status(500).json({ message: "Failed to update question set" });
  }
};


exports.processPDF = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "FILE_REQUIRED" });
    }

    // 🔹 Extract text (PDF + Image supported)
    let text;
    try {
      text = await extractTextFromFile(req.file);
    } catch {
      return res.status(400).json({
        message: "FILE_HAS_NO_READABLE_TEXT",
      });
    }

    // 🔹 Generate topic
    let topic = "General";
    try {
      topic = await generateTopicFromText(text);
    } catch {
      console.warn("Topic generation failed, using default");
    }

    // 🔹 Chunk text
    const chunks = chunkText(text, 15000);
    let allQuestions = [];

    for (const chunk of chunks) {
      try {
        let questions = await generateQuizQuestions(chunk);

        questions = questions.filter(q =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.options.every(opt => typeof opt === "string") &&
          Number.isInteger(q.correctAnswer) &&
          q.correctAnswer >= 0 &&
          q.correctAnswer <= 3
        );

        allQuestions.push(...questions);
      } catch {
        console.warn("AI failed for one chunk, skipping");
      }
    }

    if (allQuestions.length === 0) {
      return res.status(400).json({
        message: "NO_VALID_QUESTIONS_GENERATED",
      });
    }

    const saved = await QuestionSet.create({
      sourceFile: req.file.originalname,
      topic,
      questions: allQuestions,
      createdBy: req.user.id
    });

    res.status(201).json(saved);

  } catch (err) {
    console.error("PROCESS FILE ERROR:", err);
    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};

exports.getMyQuestionSets = async (req, res) => {
  try {
    const sets = await QuestionSet.find({
      createdBy: req.user.id,
    })
      .select("topic sourceFile createdAt questions")
      .sort({ createdAt: -1 });

    // send only count instead of full questions
    const formatted = sets.map(set => ({
      _id: set._id,
      topic: set.topic,
      sourceFile: set.sourceFile,
      createdAt: set.createdAt,
      questionCount: set.questions.length,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};

exports.getQuestionSetById = async (req, res) => {
  try {
    const set = await QuestionSet.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!set) {
      return res.status(404).json({ message: "NOT_FOUND" });
    }

    res.status(200).json(set);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};



